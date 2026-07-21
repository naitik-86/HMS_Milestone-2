const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');
const ClinicAdmin = require('../models/ClinicAdmin');
const Staff = require('../models/Staff');
const LoginOtp = require('../models/LoginOtp');

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Checks the shared OTP without consuming it. Final login still
// verifies and consumes the OTP through the role-specific endpoints below.
exports.validateLoginOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const otp = String(req.body?.otp || '').trim();
    const role = req.body?.role === 'SUPER_ADMIN'
      ? 'SUPER_ADMIN'
      : req.body?.role === 'CLINIC_ADMIN' ? 'CLINIC_ADMIN' : 'STAFF';

    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: 'Enter a valid 6 digit OTP.' });
    }
    const otpRecord = await LoginOtp.findOne({
      userType: role,
      purpose: 'LOGIN',
      email,
      otpEmail: otp,
      isConsumed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) return res.status(401).json({ success: false, message: 'Invalid or expired OTP.' });
    return res.json({ success: true, message: 'OTP verified.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Unable to verify OTP.' });
  }
};

// ==========================================
// SUPER_ADMIN OTP VERIFY
// ==========================================
exports.verifySuperAdminOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = String(req.body?.otp || '').trim();
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: 'Email and a valid 6 digit OTP are required' });
    }

    const otpRecord = await LoginOtp.findOne({
      userType: 'SUPER_ADMIN',
      purpose: 'LOGIN',
      email: normalizedEmail,
      otpEmail: otp,
      isConsumed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
        return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
    }

    if (otpRecord) {
        otpRecord.isConsumed = true;
        otpRecord.verifiedAt = new Date();
        await otpRecord.save();
    }

    const admin = await SuperAdmin.findOne({ email: normalizedEmail });
    const token = jwt.sign(
      { id: admin._id, role: 'SUPER_ADMIN', email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ success: true, message: 'Login successful', token, role: 'SUPER_ADMIN', user: admin });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// CLINIC_ADMIN OTP VERIFY (Email Only)
// ==========================================
exports.verifyClinicAdminOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = String(req.body?.otp || '').trim();
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: 'Email and a valid 6 digit OTP are required' });
    }

    const otpRecord = await LoginOtp.findOne({
      userType: 'CLINIC_ADMIN',
      purpose: 'LOGIN',
      email: normalizedEmail,
      otpEmail: otp,
      isConsumed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
        return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
    }

    if (otpRecord) {
        otpRecord.isConsumed = true;
        otpRecord.verifiedAt = new Date();
        await otpRecord.save();
    }

    const admin = await ClinicAdmin.findOne({ email: normalizedEmail });
    const token = jwt.sign(
      { id: admin._id, role: 'CLINIC_ADMIN', email: admin.email, clinicId: admin.clinicId },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

   return res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      token, 
      role: 'CLINIC_ADMIN',
      requiresPasswordReset: admin.email === 'admin@clinic.com' ? false : (admin.forcePasswordReset !== false), 
      user: admin 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// STAFF OTP VERIFY (Email OTP only)
// ==========================================
exports.verifyStaffOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = String(req.body?.otp || '').trim();
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const staff = await Staff.findOne({
      "personalInfo.email": {
        $regex: `^${escapeRegExp(normalizedEmail)}$`,
        $options: 'i',
      },
    });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: 'A valid 6 digit OTP is required' });
    }

    const otpRecord = await LoginOtp.findOne({
      userType: 'STAFF',
      purpose: 'LOGIN',
      email: normalizedEmail,
      otpEmail: otp,
      isConsumed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
    }

    if (otpRecord) {
      otpRecord.isConsumed = true;
      otpRecord.verifiedAt = new Date();
      await otpRecord.save();
    }

    const token = jwt.sign(
      { id: staff._id, role: staff.employmentInfo.role, clinicId: staff.clinicId },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

   return res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      token, 
      role: staff.employmentInfo.role, 
      requiresPasswordReset: staff.accountInfo?.forcePasswordReset !== false, 
      user: staff 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
