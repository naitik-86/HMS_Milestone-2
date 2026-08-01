const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');
const ClinicAdmin = require('../models/ClinicAdmin');
const Staff = require('../models/Staff');
const Clinic = require('../models/Clinic');
const LoginOtp = require('../models/LoginOtp');
const lockoutService = require('../utils/lockoutService');
const { getClinicGateError } = require('../utils/clinicStatus');

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const recordLoginSuccess = async (doc, fields, req) => {
  fields.lastLoginAt = new Date();
  fields.lastLoginIp = req.headers['x-forwarded-for'] || req.ip || null;
  fields.lastLoginDevice = req.headers['user-agent'] || null;
  await doc.save();
};

const otpFailureMessage = async ({ userType, email, otp }) => {
  const expiredOtp = await LoginOtp.exists({
    userType,
    purpose: 'LOGIN',
    email,
    otpEmail: otp,
    isConsumed: false,
    expiresAt: { $lte: new Date() },
  });

  return expiredOtp
    ? 'OTP has expired. Please request a new OTP.'
    : 'Invalid OTP.';
};

const ensureClinicIsActive = async (clinicId, res) => {
  const clinic = await Clinic.findById(clinicId).select('isActive verificationStatus');
  const gateError = getClinicGateError(clinic);
  if (!gateError) return true;
  res.status(403).json({ success: false, ...gateError });
  return false;
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

    const admin = await SuperAdmin.findOne({ email: normalizedEmail });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    if (lockoutService.isLocked(admin, 'otp')) {
      return res.status(403).json({ success: false, message: lockoutService.LOCK_MESSAGE.otp });
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
      await lockoutService.registerFailedAttempt(admin, admin, 'otp');
      return res.status(401).json({ success: false, message: await otpFailureMessage({ userType: 'SUPER_ADMIN', email: normalizedEmail, otp }) });
    }

    otpRecord.isConsumed = true;
    otpRecord.verifiedAt = new Date();
    await otpRecord.save();

    await lockoutService.resetAttempts(admin, admin, 'otp');
    await recordLoginSuccess(admin, admin, req);

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

    const clinicAdmin = await ClinicAdmin.findOne({ email: normalizedEmail });
    if (!clinicAdmin || !(await ensureClinicIsActive(clinicAdmin.clinicId, res))) return;

    if (lockoutService.isLocked(clinicAdmin, 'otp')) {
      return res.status(403).json({ success: false, message: lockoutService.LOCK_MESSAGE.otp });
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
      await lockoutService.registerFailedAttempt(clinicAdmin, clinicAdmin, 'otp');
      return res.status(401).json({ success: false, message: await otpFailureMessage({ userType: 'CLINIC_ADMIN', email: normalizedEmail, otp }) });
    }

    otpRecord.isConsumed = true;
    otpRecord.verifiedAt = new Date();
    await otpRecord.save();

    await lockoutService.resetAttempts(clinicAdmin, clinicAdmin, 'otp');
    await recordLoginSuccess(clinicAdmin, clinicAdmin, req);

    const admin = clinicAdmin;
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
      requiresPasswordReset: admin.forcePasswordReset !== false,
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

    if (!(await ensureClinicIsActive(staff.clinicId, res))) return;

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: 'A valid 6 digit OTP is required' });
    }

    if (lockoutService.isLocked(staff.accountInfo, 'otp')) {
      return res.status(403).json({ success: false, message: lockoutService.LOCK_MESSAGE.otp });
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
      await lockoutService.registerFailedAttempt(staff, staff.accountInfo, 'otp');
      return res.status(401).json({ success: false, message: await otpFailureMessage({ userType: 'STAFF', email: normalizedEmail, otp }) });
    }

    otpRecord.isConsumed = true;
    otpRecord.verifiedAt = new Date();
    await otpRecord.save();

    await lockoutService.resetAttempts(staff, staff.accountInfo, 'otp');
    await recordLoginSuccess(staff, staff.accountInfo, req);

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
