const jwt = require('jsonwebtoken');

const SuperAdmin = require('../models/SuperAdmin');
const LoginOtp = require('../models/LoginOtp');
// ==========================================
// SUPER_ADMIN OTP VERIFY
// ==========================================
exports.verifySuperAdminOtp = async (req, res) => {
  try {
    const { email, otpEmail, otpMobile } = req.body;

    if (!email || !otpEmail || !otpMobile) {
      return res.status(400).json({
        success: false,
        message: 'email, otpEmail and otpMobile are required',
      });
    }

    const mobile = process.env.SUPER_ADMIN_MOBILE;
    if (!mobile) {
      return res.status(500).json({
        success: false,
        message: 'SUPER_ADMIN_MOBILE is not configured in .env',
      });
    }

    const otpRecord = await LoginOtp.findOne({
      userType: 'SUPER_ADMIN',
      email: email.toLowerCase(),
      mobile,
      otpEmail,
      otpMobile,
      isConsumed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired OTPs',
      });
    }

    otpRecord.isConsumed = true;
    otpRecord.verifiedAt = new Date();
    await otpRecord.save();

    const admin = await SuperAdmin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Super admin not found' });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: 'SUPER_ADMIN',
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      role: 'SUPER_ADMIN',
      user: admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

