//  ANKIT SIR CODE ++++++++++++

// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const { generateOTP, sendSMS, sendWhatsApp } = require('../utils/otpService');

// const bcrypt = require("bcryptjs");
// const SuperAdmin = require("../models/SuperAdmin");


// // Temporary in-memory store for OTPs (Use Redis or MongoDB in production)
// const otpStore = new Map();

// exports.requestLoginOTP = async (req, res) => {
//   try {
//     const { mobile, channel } = req.body; // channel can be 'SMS' or 'WHATSAPP'

//     if (!mobile || typeof mobile !== 'string') {
//       return res.status(400).json({ success: false, message: 'mobile is required' });
//     }

//     // Normalize channel
//     const normalizedChannel = channel === 'WHATSAPP' ? 'WHATSAPP' : 'SMS';

//     // Check if user exists (Staff or Owner)
//     const user = await User.findOne({ mobile });
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const otp = generateOTP();

//     // Store OTP with an expiry (e.g., 5 minutes)
//     otpStore.set(mobile, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

//     // Route message based on user preference
//     if (normalizedChannel === 'WHATSAPP') {
//       await sendWhatsApp(mobile, otp);
//     } else {
//       await sendSMS(mobile, otp);
//     }

//     res.status(200).json({ success: true, message: `OTP sent via ${normalizedChannel}` });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// exports.verifyOTPAndLogin = async (req, res) => {
//   try {
//     const { mobile, otp } = req.body;
//     const record = otpStore.get(mobile);

//     if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
//       return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
//     }

//     // OTP verified, remove it
//     otpStore.delete(mobile);

//     // Fetch user and generate JWT
//     const user = await User.findOne({ mobile });
//     const token = jwt.sign(
//       { id: user._id, role: user.role, clinicId: user.clinicId },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     res.status(200).json({ success: true, token, user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };





// exports.verifySuperAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     console.log("Email : " + email);
//     console.log("password : " + password);

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     const admin = await SuperAdmin.findOne({ email }).select("+password");;
//     if (!admin) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials **",
//       });
//     }

//     const token = jwt.sign(
//       {
//         id: admin._id,
//         role: admin.role,
//         email: admin.email,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//         issuer: "HMS-app",
//       }
//     );
//     console.log("GENERATED TOKEN:", token);
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: admin._id,
//         email: admin.email,
//         role: admin.role,
//       },
//     });

//   } catch (error) {
//     console.error("SUPER ADMIN LOGIN ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };


/* ==============================================================================================
=================================================================================================
================================================================================================== */

// const User = require("../models/User");
// const SuperAdmin = require("../models/SuperAdmin");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const {
//   generateOTP,
//   sendSMS,
//   sendWhatsApp,
// } = require("../utils/otpService");

// // Temporary OTP Store (Use Redis in Production)
// const otpStore = new Map();

// /* ==========================================
//    STAFF LOGIN (OTP BASED)
// ========================================== */

// exports.requestLoginOTP = async (req, res) => {
//   try {
//     const { mobile, role, channel = "SMS" } = req.body;

//     if (!mobile || !role) {
//       return res.status(400).json({
//         success: false,
//         message: "Mobile and role are required",
//       });
//     }

//     const user = await User.findOne({ mobile });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (user.role !== role) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid role selected",
//       });
//     }

//     const otp = generateOTP();

//     otpStore.set(mobile, {
//       otp,
//       expiresAt: Date.now() + 5 * 60 * 1000,
//     });

//     if (channel === "WHATSAPP") {
//       await sendWhatsApp(mobile, otp);
//     } else {
//       await sendSMS(mobile, otp);
//     }

//     res.status(200).json({
//       success: true,
//       message: `OTP sent via ${channel}`,
//     });
//   } catch (error) {
//     console.error("REQUEST OTP ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.verifyOTPAndLogin = async (req, res) => {
//   try {
//     const { mobile, otp, role } = req.body;

//     const record = otpStore.get(mobile);

//     if (
//       !record ||
//       record.otp !== otp ||
//       record.expiresAt < Date.now()
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired OTP",
//       });
//     }

//     const user = await User.findOne({ mobile });

//     if (!user || user.role !== role) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized login",
//       });
//     }

//     otpStore.delete(mobile);

//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: user.role,
//         clinicId: user.clinicId,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user,
//     });
//   } catch (error) {
//     console.error("VERIFY OTP ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ==========================================
//    SUPER ADMIN LOGIN (EMAIL + PASSWORD)
// ========================================== */

// exports.verifySuperAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     const admin = await SuperAdmin.findOne({ email }).select("+password");

//     if (!admin) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     const token = jwt.sign(
//       {
//         id: admin._id,
//         role: admin.role,
//         email: admin.email,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//         issuer: "HMS-app",
//       }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: admin._id,
//         email: admin.email,
//         role: admin.role,
//       },
//     });
//   } catch (error) {
//     console.error("SUPER ADMIN LOGIN ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

const User = require("../models/User");
const SuperAdmin = require("../models/SuperAdmin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ClinicAdmin = require("../models/ClinicAdmin")

/* ==========================================
   LOGIN (EMAIL + PASSWORD ONLY)
========================================== */

exports.login = async (req, res) => {
  try {

    console.log("************************");
    console.log(req.body);


    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    /* =========================
       1. CHECK SUPER ADMIN
    ========================= */
    const admin = await SuperAdmin.findOne({ email }).select("+password");

    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        {
          id: admin._id,
          role: "SUPER_ADMIN",
          email: admin.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        role: "SUPER_ADMIN",
        user: admin,
      });
    }


    /* =========================
       1. CHECK CLINIC ADMIN
    ========================= */
    const clinicAdmin = await ClinicAdmin.findOne({ email }).select("+password");

    if (clinicAdmin) {
      const isMatch = await bcrypt.compare(
        password,
        clinicAdmin.password
      );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        {
          id: clinicAdmin._id,
          role: "CLINIC_ADMIN",
          email: clinicAdmin.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        role: "CLINIC_ADMIN",
        user: clinicAdmin,
      });
    }

    /* =========================
       2. CHECK NORMAL USERS
    ========================= */
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        clinicId: user.clinicId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      user,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
