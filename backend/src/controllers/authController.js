const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateOTP, sendSMS, sendWhatsApp } = require('../utils/otpService');

const bcrypt = require("bcryptjs");
const SuperAdmin = require("../models/SuperAdmin");


// Temporary in-memory store for OTPs (Use Redis or MongoDB in production)
const otpStore = new Map();

exports.requestLoginOTP = async (req, res) => {
  try {
    const { mobile, channel } = req.body; // channel can be 'SMS' or 'WHATSAPP'

    if (!mobile || typeof mobile !== 'string') {
      return res.status(400).json({ success: false, message: 'mobile is required' });
    }

    // Normalize channel
    const normalizedChannel = channel === 'WHATSAPP' ? 'WHATSAPP' : 'SMS';

    // Check if user exists (Staff or Owner)
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = generateOTP();

    // Store OTP with an expiry (e.g., 5 minutes)
    otpStore.set(mobile, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    // Route message based on user preference
    if (normalizedChannel === 'WHATSAPP') {
      await sendWhatsApp(mobile, otp);
    } else {
      await sendSMS(mobile, otp);
    }

    res.status(200).json({ success: true, message: `OTP sent via ${normalizedChannel}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyOTPAndLogin = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const record = otpStore.get(mobile);

    if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // OTP verified, remove it
    otpStore.delete(mobile);

    // Fetch user and generate JWT
    const user = await User.findOne({ mobile });
    const token = jwt.sign(
      { id: user._id, role: user.role, clinicId: user.clinicId },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};





exports.verifySuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Email : " + email);
    console.log("password : " + password);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await SuperAdmin.findOne({ email }).select("+password");;
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials **",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
        issuer: "HMS-app",
      }
    );
    console.log("GENERATED TOKEN:", token);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("SUPER ADMIN LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};