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

const GOOGLE_TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo";

const verifyGoogleCredential = async (credential) => {
  if (!credential) {
    const error = new Error("Google credential is required");
    error.statusCode = 400;
    throw error;
  }

  const { default: axios } = await import("axios");
  const { data } = await axios.get(GOOGLE_TOKENINFO_URL, {
    params: { id_token: credential },
  });

  const expectedClientId = process.env.GOOGLE_CLIENT_ID;
  if (!expectedClientId) {
    const error = new Error("GOOGLE_CLIENT_ID is not configured");
    error.statusCode = 500;
    throw error;
  }

  if (data.aud !== expectedClientId) {
    const error = new Error("Invalid Google client");
    error.statusCode = 401;
    throw error;
  }

  if (!data.email || data.email_verified !== "true") {
    const error = new Error("Google email is not verified");
    error.statusCode = 401;
    throw error;
  }

  return {
    email: data.email.toLowerCase(),
    name: data.name,
    picture: data.picture,
  };
};

const normalizeRole = (role) =>
  typeof role === "string"
    ? role.trim().toUpperCase().replace(/[\s-]+/g, "_")
    : "";

const comparePasswordWithWhitespaceFallback = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    return false;
  }

  const exactMatch = await bcrypt.compare(plainPassword, hashedPassword);
  if (exactMatch) {
    return true;
  }

  const trimmedPassword = plainPassword.trim();
  if (trimmedPassword !== plainPassword) {
    return bcrypt.compare(trimmedPassword, hashedPassword);
  }

  return false;
};

const createOtpChallengeForLogin = async ({ account, accountType, email }) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  if (accountType === "SUPER_ADMIN") {
    const mobile = process.env.SUPER_ADMIN_MOBILE;
    if (!mobile) {
      const error = new Error("SUPER_ADMIN_MOBILE is not configured in .env");
      error.statusCode = 500;
      throw error;
    }

    const otpEmail = generateOTP();
    const otpMobile = generateOTP();

    await LoginOtp.create({
      userType: "SUPER_ADMIN",
      userId: account._id,
      email: account.email,
      mobile,
      otpEmail,
      otpMobile,
      expiresAt,
    });

    await sendOtpMultiChannel({
      email: account.email,
      mobile,
      otpEmail,
      otpMobile,
      emailSender: sendEmail,
    });

    return {
      message: "OTP sent to registered email and mobile. Verify to login.",
      role: "SUPER_ADMIN",
      user: {
        id: account._id,
        email: account.email,
        mobile,
        role: "SUPER_ADMIN",
      },
    };
  }

  if (accountType === "CLINIC_ADMIN") {
    const otpEmail = email === "admin@clinic.com" ? "123456" : generateOTP();

    await LoginOtp.create({
      userType: "CLINIC_ADMIN",
      userId: account._id,
      email: account.email,
      otpEmail,
      expiresAt,
    });

    await sendOtpMultiChannel({
      email: account.email,
      otpEmail,
      emailSender: sendEmail,
    });

    return {
      message: "OTP sent to registered email. Verify to login.",
      role: "CLINIC_ADMIN",
      user: {
        id: account._id,
        email: account.email,
        role: "CLINIC_ADMIN",
        clinicId: account.clinicId || account.clinic,
      },
    };
  }

  if (accountType === "STAFF") {
    if (!account.accountInfo.accountActive) {
      const error = new Error("Account is inactive");
      error.statusCode = 403;
      throw error;
    }

    const otpEmail = generateOTP();
    const otpMobile = generateOTP();
    const mobile = account.personalInfo.mobileNumber;

    await LoginOtp.create({
      userType: "STAFF",
      userId: account._id,
      email: account.personalInfo.email,
      mobile,
      otpEmail,
      otpMobile,
      expiresAt,
    });

    await sendOtpMultiChannel({
      email: account.personalInfo.email,
      mobile,
      otpEmail,
      otpMobile,
      emailSender: sendEmail,
    });

    return {
      message: "OTP sent to registered email and mobile. Verify to login.",
      role: account.employmentInfo.role,
      user: {
        id: account._id,
        name: account.personalInfo.fullName,
        email: account.personalInfo.email,
        mobile,
        role: account.employmentInfo.role,
        clinicId: account.clinicId,
      },
    };
  }

  const error = new Error("Unsupported account type");
  error.statusCode = 400;
  throw error;
};

const findOtpLoginAccountByEmail = async (email) => {
  const normalizedEmail = email.toLowerCase();

  const admin = await SuperAdmin.findOne({ email: normalizedEmail }).select("+password");
  if (admin) return { account: admin, accountType: "SUPER_ADMIN" };

  const clinicAdmin = await ClinicAdmin.findOne({ email: normalizedEmail }).select("+password");
  if (clinicAdmin) return { account: clinicAdmin, accountType: "CLINIC_ADMIN" };

  const staff = await Staff.findOne({
    "personalInfo.email": normalizedEmail,
    isDeleted: false,
  });
  if (staff) return { account: staff, accountType: "STAFF" };

  return null;
};

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

      // 2FA OTP Generation for Clinic Admin (with Developer Testing Bypass)
      const otpEmail = (email.toLowerCase() === 'admin@clinic.com') ? '123456' : generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

      await LoginOtp.create({
        userType: 'CLINIC_ADMIN',
        userId: clinicAdmin._id,
        email: clinicAdmin.email,
        otpEmail,
        expiresAt,
      });

      // Send Email OTP (keep developer bypass OTP generation, but do not skip sending)
      await sendOtpMultiChannel({
        email: clinicAdmin.email,
        otpEmail,
        emailSender: sendEmail,
      });


      return res.status(200).json({
        success: true,
        message: "OTP sent to registered email. Verify to login.",
        role: "CLINIC_ADMIN",
        user: {
          id: clinicAdmin._id,
          email: clinicAdmin.email,
          role: "CLINIC_ADMIN",
          clinicId: clinicAdmin.clinicId || clinicAdmin.clinic
        },
      });
    }

    /* =========================
       3. CHECK STAFF
    ========================= */
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

      // 2FA OTP Generation for Staff
      const otpEmail = generateOTP();
      const otpMobile = generateOTP();
      const mobile = staff.personalInfo.mobileNumber;
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

      await LoginOtp.create({
        userType: 'STAFF', 
        userId: staff._id,
        email: staff.personalInfo.email,
        mobile: mobile,
        otpEmail,
        otpMobile,
        expiresAt,
      });

      // Send both OTPs via Email and WhatsApp/SMS
      await sendOtpMultiChannel({
        email: staff.personalInfo.email,
        mobile: mobile,
        otpEmail,
        otpMobile,
        emailSender: sendEmail,
      });

      return res.status(200).json({
        success: true,
        message: "OTP sent to registered email and mobile. Verify to login.",
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
       4. CHECK NORMAL USERS 
    ========================= */
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const requiresPasswordReset = Boolean(user.forcePasswordReset);

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        clinicId: user.clinicId,
        // flags for frontend (not security)
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

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    const role = normalizeRole(req.user?.role);
    const userId = req.user?.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (!userId || !role) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    if (role === "SUPER_ADMIN") {
      const admin = await SuperAdmin.findById(userId).select("+password");

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Super admin not found",
        });
      }

      const isMatch = await comparePasswordWithWhitespaceFallback(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      admin.password = hashedNewPassword;
      await admin.save();

      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    }

    if (role === "CLINIC_ADMIN") {
      const admin = await ClinicAdmin.findOne({ _id: userId }).select("+password");

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Clinic admin not found",
        });
      }

      const isMatch = await comparePasswordWithWhitespaceFallback(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      admin.password = hashedNewPassword;
      admin.forcePasswordReset = false;
      await admin.save();

      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    }

    const staff = await Staff.findOne({
      _id: userId,
      clinicId: req.user?.clinicId,
      isDeleted: false,
    });

    if (staff) {
      const storedPassword = staff.accountInfo?.password;
      const isMatch = await comparePasswordWithWhitespaceFallback(currentPassword, storedPassword);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      staff.accountInfo.password = hashedNewPassword;
      staff.accountInfo.forcePasswordReset = false;
      staff.accountInfo.temporaryPassword = "";

      await staff.save();

      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    }

    const userAccount = await User.findOne({
      _id: userId,
    }).select("+password");

    if (userAccount) {
      const storedPassword = userAccount.password;
      const isMatch = await comparePasswordWithWhitespaceFallback(currentPassword, storedPassword);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      userAccount.password = hashedNewPassword;
      userAccount.forcePasswordReset = false;
      userAccount.temporaryPassword = "";

      await userAccount.save();

      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    }

    return res.status(404).json({
      success: false,
      message: "Account not found for password update",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update password",
    });
  }
};

/* ==========================================
   GOOGLE LOGIN (GOOGLE ACCOUNT + OTP)
========================================== */

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const googleUser = await verifyGoogleCredential(credential);
    const match = await findOtpLoginAccountByEmail(googleUser.email);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const challenge = await createOtpChallengeForLogin({
      account: match.account,
      accountType: match.accountType,
      email: googleUser.email,
    });

    return res.status(200).json({
      success: true,
      ...challenge,
      googleUser,
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Google login failed",
    });
  }
};
