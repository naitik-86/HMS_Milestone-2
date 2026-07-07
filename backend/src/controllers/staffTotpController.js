const bcrypt = require('bcryptjs');
const Staff = require('../models/Staff');
const { authenticator } = require('otplib');

// POST /staff/totp/setup
// Body: { email }
// Auth: protect + authorize('...') should already restrict to logged-in staff if you add middleware.
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

    // secret length default is fine
    const secret = authenticator.generateSecret();
    const otpauth_url = authenticator.keyuri(staff.personalInfo.email, staff.personalInfo.fullName, secret);

    staff.accountInfo = staff.accountInfo || {};
    staff.accountInfo.twoFactorSecret = secret;
    staff.accountInfo.twoFactorEnabled = false;
    staff.accountInfo.twoFactorVerifiedAt = null;
    staff.accountInfo.forceTotpSetup = false; // we already are in setup

    await staff.save();

    return res.status(200).json({
      success: true,
      otpauth_url,
      // do NOT return secret in real apps; leaving it helps debug but we omit.
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

    const isValid = authenticator.check(token, secret);
    if (!isValid) {
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

