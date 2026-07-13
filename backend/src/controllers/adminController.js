const User = require('../models/User');
const Clinic = require('../models/Clinic');
const ClinicAdmin = require("../models/ClinicAdmin")
const Appointment = require('../models/Appointment');
const Groomer = require('../models/GroomerModel')
const Kennel = require('../models/KennelModel')
const LabRecord = require('../models/LabRecord');
const LabReport = require('../models/LabReport');
const LabTechnician = require('../models/LabTechnician')
const DoctorDetails = require('../models/DoctorDetails')
const DoctorModule = require('../models/DoctorConsultationModdel');
const Owner = require('../models/Owner');
const MedicalRecord = require('../models/MedicalRecord');
const PreConsultation = require('../models/PreConsultation');
const PetRegistration = require('../models/PetRegistration');
const Review = require('../models/Review');
const Visit = require('../models/visitModel');
const OwnerReport = require('../models/OwnerReport');
const LoginOtp = require('../models/LoginOtp');
const Staff = require('../models/Staff');
const { Pet } = require('../models/Pet');
const sendEmail = require('../utils/emailService'); // NEW: Email Trigger Utility
const bcrypt = require('bcryptjs');
const generatePassword = require('../utils/generatePassword');

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');
const deleteManyByClinicId = (model, clinicId) => model.deleteMany({
  $or: [
    { clinicId },
    { clinicId: clinicId.toString() },
  ],
});

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
      addressDetails,
      latitude
    } = req.body;

    const contactEmail = normalizeEmail(email);
    const clinicAdminEmail = normalizeEmail(adminEmail);

    if (!clinicAdminEmail) {
      return res.status(400).json({
        success: false,
        message: 'Admin email is required to create a clinic account.',
      });
    }

    const existingClinicAdmin = await ClinicAdmin.findOne({ email: clinicAdminEmail });
    if (existingClinicAdmin) {
      return res.status(409).json({
        success: false,
        message: 'A clinic admin with this email already exists.',
      });
    }

    let expiryDate = new Date();
    if (subscriptionType === '6_MONTHS') expiryDate.setMonth(expiryDate.getMonth() + 6);
    if (subscriptionType === '12_MONTHS') expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    if (subscriptionType === 'FREE_TIER') expiryDate = null;

    const clinic = await Clinic.create({
      name,
      address,
      subscriptionType,
      expiryDate,
      licenseLimits: { maxDoctors, maxStaff },
      addressDetails,
      contactEmail: contactEmail || undefined,
      location: latitude && longitude
        ? {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)]
          }
        : undefined
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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

// DELETE /api/clinics/:id -> Remove a clinic and its tenant data
exports.deleteClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found',
      });
    }

    const [clinicAdmins, staffMembers, registrations] = await Promise.all([
      ClinicAdmin.find({ clinicId: clinic._id }).select('_id email'),
      Staff.find({ clinicId: clinic._id }).select('_id personalInfo.email'),
      PetRegistration.find({ clinicId: clinic._id }).select('_id'),
    ]);

    const clinicAdminIds = clinicAdmins.map((admin) => admin._id);
    const staffIds = staffMembers.map((staff) => staff._id);
    const registrationIds = registrations.map((registration) => registration._id);

    await Promise.all([
      deleteManyByClinicId(ClinicAdmin, clinic._id),
      deleteManyByClinicId(Staff, clinic._id),
      deleteManyByClinicId(User, clinic._id),
      deleteManyByClinicId(Appointment, clinic._id),
      deleteManyByClinicId(Groomer, clinic._id),
      deleteManyByClinicId(Kennel, clinic._id),
      deleteManyByClinicId(LabTechnician, clinic._id),
      deleteManyByClinicId(DoctorDetails, clinic._id),
      deleteManyByClinicId(DoctorModule, clinic._id),
      deleteManyByClinicId(LabRecord, clinic._id),
      deleteManyByClinicId(LabReport, clinic._id),
      deleteManyByClinicId(MedicalRecord, clinic._id),
      deleteManyByClinicId(PreConsultation, clinic._id),
      deleteManyByClinicId(Review, clinic._id),
      deleteManyByClinicId(Visit, clinic._id),
      deleteManyByClinicId(OwnerReport, clinic._id),
      deleteManyByClinicId(PetRegistration, clinic._id),
      registrationIds.length
        ? Pet.deleteMany({ ownerId: { $in: registrationIds } })
        : Promise.resolve({ deletedCount: 0 }),
      (clinicAdminIds.length || staffIds.length)
        ? LoginOtp.deleteMany({
            userType: { $in: ['CLINIC_ADMIN', 'STAFF'] },
            userId: { $in: [...clinicAdminIds, ...staffIds] },
          })
        : Promise.resolve({ deletedCount: 0 }),
    ]);

    await Clinic.findByIdAndDelete(clinic._id);

    return res.status(200).json({
      success: true,
      message: 'Clinic deleted successfully.',
      data: {
        clinicId: clinic._id,
        clinicName: clinic.name,
      },
    });
  } catch (error) {
    console.error('DELETE CLINIC ERROR:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete clinic',
      error: error.message,
    });
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
    const clinicAdmin = await ClinicAdmin.findOne({ clinicId: clinic._id }).select('email');
    const recipientEmails = [...new Set([
      normalizeEmail(clinicEmail),
      normalizeEmail(clinic.contactEmail),
      normalizeEmail(clinicAdmin?.email),
    ].filter(Boolean))];

    const notificationWarnings = [];

    if ((status === 'APPROVED' || status === 'REJECTED') && recipientEmails.length > 0) {
      const subject = status === 'APPROVED'
        ? 'Clinic Account Activated'
        : 'Clinic Registration Rejected';

      const message = status === 'APPROVED'
        ? `Your clinic "${clinic.name}" has been verified and is now active. You can log in with your clinic admin email.`
        : `Your clinic "${clinic.name}" registration was rejected. Reason: ${rejectionReason || 'Not provided'}`;

      const results = await Promise.allSettled(
        recipientEmails.map((recipientEmail) =>
          sendEmail({
            email: recipientEmail,
            subject,
            message,
          })
        )
      );

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const failedEmail = recipientEmails[index];
          const failureMessage = `Failed to send clinic verification email to ${failedEmail}: ${result.reason?.message || result.reason}`;
          notificationWarnings.push(failureMessage);
          console.error(failureMessage);
        }
      });
    }

    res.status(200).json({
      success: true,
      message: notificationWarnings.length
        ? 'Clinic verification updated, but one or more notification emails failed.'
        : 'Clinic verification updated successfully.',
      data: clinic,
      emailWarning: notificationWarnings.length ? notificationWarnings : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



exports.getTotalUsers = async (req, res) => {
  try {
    const [
      users,
      clinics,
      groomers,
      kennels,
      labTechs,
      doctors
    ] = await Promise.all([
      User.countDocuments(),
      Clinic.countDocuments(),
      Groomer.countDocuments(),
      Kennel.countDocuments(),
      LabTechnician.countDocuments(),
      DoctorDetails.countDocuments()
    ]);

    const totalUsers =
      users +
      clinics +
      groomers +
      kennels +
      labTechs +
      doctors;

    res.status(200).json({
      success: true,
      data: {
        users,
        clinics,
        groomers,
        kennels,
        labTechnicians: labTechs,
        doctors,
        totalUsers
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching total users"
    });
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
    const normalize = (v) => {
      if (!v) return [];
      return Array.isArray(v) ? v : [v];
    };

    const logo = normalize(req.files?.clinicLogo);
    const vet = normalize(req.files?.vetCouncilCertificate);
    const trade = normalize(req.files?.tradeLicense);
    const cheque = normalize(req.files?.cancelledCheque);
    const adminProfile = normalize(req.files?.adminProfile);

    const hasAny = logo.length > 0 || vet.length > 0 || trade.length > 0 || cheque.length > 0 || adminProfile.length > 0;


    if (!hasAny) {
      return res.status(400).json({ success: false, message: 'No documents uploaded' });
    }

    return res.status(200).json({ success: true, data: clinic });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
