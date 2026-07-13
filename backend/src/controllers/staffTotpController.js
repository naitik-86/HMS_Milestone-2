const bcrypt = require('bcryptjs');
const Staff = require('../models/Staff');

// Naye v13 ke functions ko direct import karein
const { generateSecret, generateURI, verify } = require('otplib');

// POST /staff/totp/setup
// Body: { staffId }
exports.setupTotp = async (req, res) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({ success: false, message: 'staffId is required' });
    }

    const staff = await Staff.findOne({ 'employmentInfo.staffId': staffId });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    // otplib v13: secret generate karne ka naya tarika
    const secret = generateSecret();
    
    // otplib v13: QR Code URL generate karne ka naya tarika (keyuri ki jagah generateURI)
    const otpauth_url = generateURI({
      issuer: 'HMS App',
      label: staff.personalInfo.email,
      secret: secret
    });

    staff.accountInfo = staff.accountInfo || {};
    staff.accountInfo.twoFactorSecret = secret;
    staff.accountInfo.twoFactorEnabled = false;
    staff.accountInfo.twoFactorVerifiedAt = null;
    staff.accountInfo.forceTotpSetup = false; 

    await staff.save();

    return res.status(200).json({
      success: true,
      otpauth_url,
    });
  } catch (error) {
    console.error('setupTotp error', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /staff/totp/verify
// Body: { staffId, token }
exports.verifyTotp = async (req, res) => {
  try {
    const { staffId, token } = req.body;

    if (!staffId || !token) {
      return res.status(400).json({ success: false, message: 'staffId and token are required' });
    }

    const staff = await Staff.findOne({ 'employmentInfo.staffId': staffId });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    const secret = staff?.accountInfo?.twoFactorSecret;
    if (!secret) {
      return res.status(400).json({ success: false, message: 'TOTP not setup for this staff' });
    }

    // otplib v13: Verify ab ek async function ban gaya hai jo object return karta hai
    const result = await verify({ token, secret });
    
    if (!result.valid) {
      return res.status(401).json({ success: false, message: 'Invalid TOTP code' });
    }

    staff.accountInfo.twoFactorEnabled = true;
    staff.accountInfo.twoFactorVerifiedAt = new Date();
    staff.accountInfo.forcePasswordReset = false;

    await staff.save();

    return res.status(200).json({ success: true, message: 'TOTP verified. 2FA enabled.' });
  } catch (error) {
    console.error('verifyTotp error', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};