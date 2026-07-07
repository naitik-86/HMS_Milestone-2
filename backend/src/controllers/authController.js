// {

//  ANKIT's  CODE ++++++++++++

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

//}

const User = require("../models/User");
const SuperAdmin = require("../models/SuperAdmin");
const ClinicAdmin = require("../models/ClinicAdmin");
const LoginOtp = require('../models/LoginOtp');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { generateOTP } = require('../utils/otpService');
const { sendOtpMultiChannel } = require('../utils/sendOtpMultiChannel');
const sendEmail = require('../utils/emailService');

const Staff = require("../models/Staff");

/* ==========================================
   UNIVERSAL LOGIN (EMAIL + PASSWORD)
========================================== */

exports.login = async (req, res) => {
  try {



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
    const admin = await SuperAdmin.findOne({ email: email.toLowerCase() }).select("+password");

    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // 2FA OTP Generation for Super Admin
      const otpEmail = generateOTP();
      const otpMobile = generateOTP();

      const mobile = process.env.SUPER_ADMIN_MOBILE;
      if (!mobile) {
        return res.status(500).json({
          success: false,
          message: "SUPER_ADMIN_MOBILE is not configured in .env",
        });
      }

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

      await LoginOtp.create({
        userType: 'SUPER_ADMIN',
        userId: admin._id,
        email: admin.email,
        mobile,
        otpEmail,
        otpMobile,
        expiresAt,
      });

      // Send both OTPs via Email and WhatsApp/SMS
      await sendOtpMultiChannel({
        email: admin.email,
        mobile,
        otpEmail,
        otpMobile,
        emailSender: sendEmail,
      });

      return res.status(200).json({
        success: true,
        message: "OTP sent to registered email and mobile. Verify to login.",
        role: "SUPER_ADMIN",
        user: {
          id: admin._id,
          email: admin.email,
          role: 'SUPER_ADMIN'
        },
      });
    }

    /* =========================
       2. CHECK CLINIC ADMIN
    ========================= */
    const clinicAdmin = await ClinicAdmin.findOne({ email: email.toLowerCase() }).select("+password");

    if (clinicAdmin) {
      const isMatch = await bcrypt.compare(password, clinicAdmin.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate JWT Token (Added clinicId for Multi-tenancy)
      console.log("clinincid", clinicAdmin);

      const token = jwt.sign(
        {
          id: clinicAdmin._id,
          role: "CLINIC_ADMIN",
          email: clinicAdmin.email,
          clinicId: clinicAdmin?.clinicId
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        role: "CLINIC_ADMIN",
        user: {
          id: clinicAdmin._id,
          email: clinicAdmin.email,
          role: "CLINIC_ADMIN",
          clinicId: clinicAdmin.clinicId || clinicAdmin.clinic
        },
      });
    }


    // Check for the staff login 


    const staff = await Staff.findOne({
      "personalInfo.email": email.toLowerCase(),
      isDeleted: false,
    });

    if (staff) {

      if (!staff.accountInfo.accountActive) {
        return res.status(403).json({
          success: false,
          message: "Account is inactive",
        });
      }

      const isMatch = await bcrypt.compare(
        password,
        staff.accountInfo.password
      );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        {
          id: staff._id,
          clinicId: staff.clinicId,
          role: staff.employmentInfo.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        role: staff.employmentInfo.role,
        user: {
          id: staff._id,
          name: staff.personalInfo.fullName,
          email: staff.personalInfo.email,
          role: staff.employmentInfo.role,
          clinicId: staff.clinicId,
        },
      });

    }

    /* =========================
       3. CHECK NORMAL USERS 
    ========================= */
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");


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

    // For staff login, we currently issue JWT only after password match.
    // We additionally enforce first-time password reset + TOTP setup.

    // Try to locate Staff account (TOTP fields are on Staff model).
    // Note: user is from User model; we map using email.
    const Staff = require('../models/Staff');
    const staff = await Staff.findOne({ 'personalInfo.email': user.email });

    const requiresPasswordReset = staff?.accountInfo?.forcePasswordReset === true;
    const requiresTotpSetup = staff?.accountInfo?.twoFactorEnabled !== true;

    // If TOTP not enabled, we still return token (for setup UI), but block app access
    // by setting flags.

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        clinicId: user.clinicId,
        // flags for frontend (not security)
        totpRequired: requiresTotpSetup,
        passwordResetRequired: requiresPasswordReset,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      requiresPasswordReset: requiresPasswordReset,
      requiresTotpSetup: requiresTotpSetup,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during login.",
      error: error.message
    });
  }
};
