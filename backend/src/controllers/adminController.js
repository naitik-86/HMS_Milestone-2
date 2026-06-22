const User = require('../models/User');
const Clinic = require('../models/Clinic');
const Owner = require('../models/Owner');
const sendEmail = require('../utils/emailService'); // NEW: Email Trigger Utility
const bcrypt = require("bcryptjs");
const sendClinicCredentials = require("../utils/sendClinicCredentials");
// ==========================================
// M1: USER & ONBOARDING LOGIC
// ==========================================

// GET /api/users/me -> Fetch logged-in user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('clinicId', 'name subscriptionStatus');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/clinics -> Super Admin onboarding a new clinic
exports.createClinic = async (req, res) => {
  try {
    const {
      name,
      address,
      subscriptionType,
      maxDoctors,
      maxStaff,
      email,
    } = req.body;

    let expiryDate = new Date();
    let subscriptionPrice = 0;

    if (subscriptionType === "6_MONTHS") {
      expiryDate.setMonth(expiryDate.getMonth() + 6);
      subscriptionPrice = 4999;
    }

    if (subscriptionType === "12_MONTHS") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      subscriptionPrice = 8999;
    }

    if (subscriptionType === "FREE_TIER") {
      expiryDate = null;
      subscriptionPrice = 0;
    }

    const plainPassword = Math.random()
      .toString(36)
      .slice(-8);

    const hashedPassword = await bcrypt.hash(
      plainPassword,
      10
    );

    const clinic = await Clinic.create({
      name,
      email,
      password: hashedPassword,
      address,

      subscriptionType,
      subscriptionPrice,

      expiryDate,

      licenseLimits: {
        maxDoctors,
        maxStaff,
      },
    });

    console.log("Clinic Email:", email);
    console.log("Password:", plainPassword);


    try {

      await sendClinicCredentials({
        clinicName: clinic.name,
        email: clinic.email,
        password: plainPassword,
        planType: clinic.subscriptionType,
        planPrice: clinic.subscriptionPrice,
      });

      console.log("Email Sent Successfully");

    } catch (err) {

      console.error(
        "Email Sending Failed:",
        err.message
      );

    }


    res.status(201).json({
      success: true,
      data: clinic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// POST /api/users/staff -> Clinic Admin creating doctor/staff accounts
exports.createStaff = async (req, res) => {
  try {
    const { name, mobile, role, specialization, practiceType, consultationFee } = req.body;
    // Bind to Admin's clinic (If Super Admin is creating a solo doctor, this might be null)
    const clinicId = req.user.role === 'SUPER_ADMIN' && role === 'DOCTOR' ? null : req.user.clinicId;

    const staff = await User.create({
      clinicId,
      name,
      mobile,
      role,
      specialization: role === 'DOCTOR' ? specialization : undefined,
      practiceType: role === 'DOCTOR' ? practiceType : undefined,
      consultationFee: role === 'DOCTOR' ? consultationFee : undefined
    });

    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// M4: CLINIC ADMIN - STAFF MANAGEMENT
// ==========================================

// PUT /api/users/staff/:id -> Update staff roles/permissions
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const clinicId = req.user.clinicId;

    const updatedStaff = await User.findOneAndUpdate(
      { _id: id, clinicId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ success: false, message: 'Staff member not found in this clinic' });
    }

    res.status(200).json({ success: true, data: updatedStaff });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/users/staff/:id -> Remove staff
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const clinicId = req.user.clinicId;

    const staff = await User.findOneAndUpdate(
      { _id: id, clinicId },
      { isActive: false },
      { new: true }
    );

    if (!staff) return res.status(404).json({ success: false, message: 'Staff member not found' });
    res.status(200).json({ success: true, message: 'Staff member deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// M4: SUPER ADMIN - PLATFORM MANAGEMENT
// ==========================================

// GET /api/clinics -> List all clinics
exports.getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: clinics.length, data: clinics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/clinics/:id/subscription -> Renew or suspend subscription
exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { subscriptionStatus, subscriptionType } = req.body;

    let updateData = { subscriptionStatus };

    if (subscriptionType) {
      let expiryDate = new Date();
      if (subscriptionType === '6_MONTHS') expiryDate.setMonth(expiryDate.getMonth() + 6);
      if (subscriptionType === '12_MONTHS') expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      updateData.subscriptionType = subscriptionType;
      updateData.expiryDate = expiryDate;
    }

    const clinic = await Clinic.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ success: true, data: clinic });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/clinics/dashboard -> Platform stats
exports.getAdminDashboard = async (req, res) => {
  try {
    const totalClinics = await Clinic.countDocuments();
    const activeClinics = await Clinic.countDocuments({ subscriptionStatus: 'ACTIVE' });
    const totalOwners = await Owner.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalClinics,
        activeClinics,
        suspendedClinics: totalClinics - activeClinics,
        totalPlatformUsers: totalOwners
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// NEW: VERIFICATION & UPLOADS
// ==========================================

// PUT /api/clinics/:id/verification -> Super Admin updating approval state
exports.updateClinicVerification = async (req, res) => {
  try {
    const { status, rejectionReason, clinicEmail } = req.body;

    const clinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: status, rejectionReason: rejectionReason || '' },
      { new: true }
    );

    if (!clinic) return res.status(404).json({ success: false, message: 'Clinic not found' });

    // Flowchart Logic: Automated Email Triggers
    if (status === 'APPROVED' && clinicEmail) {
      await sendEmail({
        email: clinicEmail,
        subject: 'Clinic Account Activated',
        message: 'Your clinic has been verified and your account is now active.'
      });
    } else if (status === 'REJECTED' && clinicEmail) {
      await sendEmail({
        email: clinicEmail,
        subject: 'Clinic Registration Rejected',
        message: `Your registration was rejected. Reason: ${rejectionReason}`
      });
    }

    res.status(200).json({ success: true, data: clinic });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/clinics/:id/documents
// Local/dev replacement: multer stores uploads in memory.
// We don't upload to S3 here; instead we accept the files and return success.
// (Production can re-introduce S3 storage + req.files[].location mapping.)
exports.uploadClinicDocuments = async (req, res) => {
  try {
    // In-memory uploads => files won't have .location
    // We just ensure the request is multipart and the clinic exists.
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) return res.status(404).json({ success: false, message: 'Clinic not found' });

    // Optionally: validate required documents exist
    const hasAny = Boolean(
      (req.files && req.files.vetCouncilCertificate && req.files.vetCouncilCertificate.length) ||
      (req.files && req.files.tradeLicense && req.files.tradeLicense.length) ||
      (req.files && req.files.cancelledCheque && req.files.cancelledCheque.length)
    );

    if (!hasAny) {
      return res.status(400).json({ success: false, message: 'No documents uploaded' });
    }

    return res.status(200).json({ success: true, data: clinic });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
