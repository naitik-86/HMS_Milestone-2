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
const SubscriptionPlan = require('../models/SubscriptionPlan');
const { Pet } = require('../models/Pet');
const sendEmail = require('../utils/emailService'); // NEW: Email Trigger Utility
const bcrypt = require('bcryptjs');
const generatePassword = require('../utils/generatePassword');

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');
const escapeRegex = (value) => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const AADHAAR_REGEX = /^\d{12}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PASSPORT_REGEX = /^[A-Z][0-9]{7}$/;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const parseMaybeJson = (value, fallback = null) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

const normalizeStringList = (value) => {
  const parsed = parseMaybeJson(value, []);

  if (Array.isArray(parsed)) {
    return parsed
      .map((item) => String(item || '').trim())
      .filter(Boolean);
  }

  if (typeof parsed === 'string') {
    return parsed
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeQualifications = (value) => {
  const parsed = parseMaybeJson(value, []);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((item) => ({
      degree: String(item?.degree || '').trim(),
      institution: String(item?.institution || '').trim(),
      year: String(item?.year || '').trim(),
    }))
    .filter((item) => item.degree || item.institution || item.year);
};

const normalizeBoolean = (value) =>
  value === true || value === 'true' || value === 'on' || value === 1 || value === '1';

const normalizeNumber = (value) => {
  const nextValue = Number(String(value || '').trim());
  return Number.isFinite(nextValue) ? nextValue : NaN;
};

const isPastDate = (value) => {
  if (!value) return false;

  const selected = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected < today;
};

const isFutureDate = (value) => {
  if (!value) return false;

  const selected = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected > today;
};

const isValidGovernmentId = (type, value) => {
  const normalized = String(value || '').trim().toUpperCase();

  switch (type) {
    case 'PAN':
      return PAN_REGEX.test(normalized);
    case 'Passport':
      return PASSPORT_REGEX.test(normalized);
    default:
      return AADHAAR_REGEX.test(normalized);
  }
};

const isValidGstPan = (value) => {
  const normalized = String(value || '').trim().toUpperCase();
  return PAN_REGEX.test(normalized) || GST_REGEX.test(normalized);
};

const firstUploadName = (file) =>
  file?.originalname || file?.filename || file?.name || '';

const normalizeUploadNames = (files) => {
  if (!Array.isArray(files)) {
    return [];
  }

  return files
    .map(firstUploadName)
    .filter(Boolean);
};

const normalizeSingleUploadName = (file) => firstUploadName(Array.isArray(file) ? file[0] : file);

const formatDateForInput = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toISOString().slice(0, 10);
};

const normalizeQualificationItems = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => ({
      degree: String(item?.degree || '').trim(),
      institution: String(item?.institution || '').trim(),
      year: String(item?.year || '').trim(),
    }))
    .filter((item) => item.degree || item.institution || item.year);
};

const serializeVeterinarian = (vet) => {
  const experienceValue = Number(vet.experience || 0);
  const status = vet.isActive === false ? 'Suspended' : vet.forcePasswordReset ? 'Pending' : 'Active';
  const qualifications = normalizeQualificationItems(vet.qualifications);
  const bankDetails = vet.bankDetails || {};
  const serviceAreas = Array.isArray(vet.serviceAreas) ? vet.serviceAreas : [];
  const specializations = Array.isArray(vet.specializations) ? vet.specializations : [];
  const languages = Array.isArray(vet.languages) ? vet.languages : [];

  return {
    id: String(vet._id),
    displayId: `VET-${String(vet._id).slice(-6).toUpperCase()}`,
    name: vet.name || 'Unnamed veterinarian',
    fullName: vet.name || '',
    mobile: vet.mobile || '-',
    email: vet.email || '',
    location: [vet.city, vet.state].filter(Boolean).join(', ') || '-',
    city: vet.city || '',
    state: vet.state || '',
    clinicId: vet.clinicId?._id ? String(vet.clinicId._id) : vet.clinicId ? String(vet.clinicId) : '',
    clinicName: vet.clinicId?.name || '',
    practice: vet.practiceType || vet.specialization || 'Independent',
    experience: `${Number.isFinite(experienceValue) ? experienceValue : 0} yrs`,
    experienceValue: String(vet.experience ?? ''),
    status,
    gender: vet.gender || '',
    dob: formatDateForInput(vet.dateOfBirth),
    dateOfBirth: vet.dateOfBirth || null,
    profilePhoto: vet.profilePhoto || '',
    languages,
    address: vet.address || '',
    pincode: vet.pincode || '',
    govtIdType: vet.govtIdType || '',
    govtIdNumber: vet.govtIdNumber || '',
    govtIdDocument: vet.govtIdDocument || '',
    qualifications,
    degreeCertificates: Array.isArray(vet.degreeCertificates) ? vet.degreeCertificates : [],
    specialization: vet.specialization || '',
    specializations,
    vetCouncilRegistrationNumber: vet.vetCouncilRegistrationNumber || '',
    stateVetCouncil: vet.stateVetCouncil || '',
    registrationCertificate: vet.registrationCertificate || '',
    certificateValidityDate: formatDateForInput(vet.certificateValidityDate),
    certificateValidityRaw: vet.certificateValidityDate || null,
    isRenewable: Boolean(vet.isRenewable),
    practiceType: vet.practiceType || '',
    consultationFee: String(vet.consultationFee ?? ''),
    emergencyAvailable: Boolean(vet.emergencyAvailable),
    serviceAreas,
    serviceAreasText: serviceAreas.join(', '),
    gstPan: vet.gstPan || '',
    bankDetails: {
      accountName: bankDetails.accountName || '',
      accountNumber: bankDetails.accountNumber || '',
      ifsc: bankDetails.ifsc || '',
      bankName: bankDetails.bankName || '',
      branch: bankDetails.branch || '',
    },
    accountName: bankDetails.accountName || '',
    accountNumber: bankDetails.accountNumber || '',
    ifsc: bankDetails.ifsc || '',
    bankName: bankDetails.bankName || '',
    branch: bankDetails.branch || '',
    plan: vet.plan || '',
    createdAt: vet.createdAt,
    updatedAt: vet.updatedAt,
  };
};

const deleteManyByClinicId = (model, clinicId) => model.deleteMany({
  $or: [
    { clinicId },
    { clinicId: clinicId.toString() },
  ],
});

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const buildMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const getMonthDate = (baseDate, offset) =>
  new Date(baseDate.getFullYear(), baseDate.getMonth() - offset, 1);

const monthLabel = (date) =>
  MONTH_NAMES[date.getMonth()] || date.toLocaleString('en-US', { month: 'short' });

const buildMonthlySeries = (aggregation, fieldName, months = 12) => {
  const values = new Map(
    aggregation.map((item) => [
      buildMonthKey(new Date(item._id.year, item._id.month - 1, 1)),
      Number(item[fieldName] || 0),
    ])
  );

  const now = new Date();
  const series = [];

  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const monthDate = getMonthDate(now, offset);
    series.push({
      month: monthLabel(monthDate),
      value: Number(values.get(buildMonthKey(monthDate)) || 0),
    });
  }

  return series;
};

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

exports.getVeterinarians = async (req, res) => {
  try {
    const search = String(req.query.search || '').trim();
    const status = String(req.query.status || '').trim();

    const query = { role: 'DOCTOR' };

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), 'i');
      query.$or = [
        { name: searchRegex },
        { mobile: searchRegex },
        { email: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
        { practiceType: searchRegex },
        { specialization: searchRegex },
        { specializations: searchRegex },
        { vetCouncilRegistrationNumber: searchRegex },
      ];
    }

    if (status === 'Active') {
      query.isActive = true;
      query.forcePasswordReset = false;
    } else if (status === 'Pending') {
      query.isActive = true;
      query.forcePasswordReset = true;
    } else if (status === 'Suspended') {
      query.isActive = false;
    }

    const veterinarians = await User.find(query)
      .sort({ createdAt: -1 })
      .populate('clinicId', 'name')
      .select(
        'name mobile email gender dateOfBirth profilePhoto languages address city state pincode govtIdType govtIdNumber govtIdDocument qualifications degreeCertificates experience specialization specializations vetCouncilRegistrationNumber stateVetCouncil registrationCertificate certificateValidityDate isRenewable practiceType consultationFee emergencyAvailable serviceAreas gstPan bankDetails plan isActive forcePasswordReset createdAt updatedAt clinicId'
      );

    const data = veterinarians.map(serializeVeterinarian);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch veterinarians.',
    });
  }
};

exports.deleteVeterinarian = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVeterinarian = await User.findOneAndDelete({
      _id: id,
      role: 'DOCTOR',
    });

    if (!deletedVeterinarian) {
      return res.status(404).json({
        success: false,
        message: 'Veterinarian not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Veterinarian deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete veterinarian.',
    });
  }
};

exports.updateVeterinarian = async (req, res) => {
  try {
    const { id } = req.params;
    const existingVeterinarian = await User.findOne({ _id: id, role: 'DOCTOR' });

    if (!existingVeterinarian) {
      return res.status(404).json({
        success: false,
        message: 'Veterinarian not found.',
      });
    }

    const {
      clinicId,
      fullName,
      gender,
      dob,
      mobile,
      email,
      address,
      city,
      state,
      pincode,
      govtIdType,
      govtIdNumber,
      experience,
      vetCouncilRegistrationNumber,
      stateVetCouncil,
      certificateValidityDate,
      isRenewable,
      practiceType,
      consultationFee,
      emergencyAvailable,
      gstPan,
      accountName,
      accountNumber,
      ifsc,
      bankName,
      branch,
      plan,
    } = req.body;

    const normalizedEmail = normalizeEmail(email || existingVeterinarian.email);
    const normalizedMobile = String(mobile || existingVeterinarian.mobile || '').trim();
    const normalizedFullName = String(fullName || existingVeterinarian.name || '').trim();
    const normalizedGender = String(gender || existingVeterinarian.gender || '').trim();
    const normalizedDob = dob || existingVeterinarian.dateOfBirth;
    const qualifications = normalizeQualifications(req.body.qualifications);
    const nextQualifications = qualifications.length
      ? qualifications
      : normalizeQualificationItems(existingVeterinarian.qualifications);
    const languages = normalizeStringList(req.body.languages);
    const nextLanguages = languages.length
      ? languages
      : (Array.isArray(existingVeterinarian.languages) ? existingVeterinarian.languages : []);
    const specializations = normalizeStringList(req.body.specializations);
    const nextSpecializations = specializations.length
      ? specializations
      : (Array.isArray(existingVeterinarian.specializations) ? existingVeterinarian.specializations : []);
    const serviceAreas = normalizeStringList(req.body.serviceAreas);
    const nextServiceAreas = serviceAreas.length
      ? serviceAreas
      : (Array.isArray(existingVeterinarian.serviceAreas) ? existingVeterinarian.serviceAreas : []);
    const bankDetails = parseMaybeJson(req.body.bankDetails, {}) || {};
    const existingBankDetails = existingVeterinarian.bankDetails || {};
    const normalizedBankDetails = {
      accountName: String(bankDetails.accountName || accountName || existingBankDetails.accountName || '').trim(),
      accountNumber: String(bankDetails.accountNumber || accountNumber || existingBankDetails.accountNumber || '').trim(),
      ifsc: String(bankDetails.ifsc || ifsc || existingBankDetails.ifsc || '').trim().toUpperCase(),
      bankName: String(bankDetails.bankName || bankName || existingBankDetails.bankName || '').trim(),
      branch: String(bankDetails.branch || branch || existingBankDetails.branch || '').trim(),
    };

    const profilePhoto = normalizeSingleUploadName(req.files?.profilePhoto)
      || String(req.body.profilePhoto || existingVeterinarian.profilePhoto || '').trim();
    const govtIdDocument = normalizeSingleUploadName(req.files?.govtIdDocument)
      || String(req.body.govtIdDocument || existingVeterinarian.govtIdDocument || '').trim();
    const registrationCertificate = normalizeSingleUploadName(req.files?.registrationCertificate)
      || String(req.body.registrationCertificate || existingVeterinarian.registrationCertificate || '').trim();
    const degreeCertificates = normalizeUploadNames(req.files?.degreeCertificates);
    const nextDegreeCertificates = degreeCertificates.length
      ? degreeCertificates
      : (Array.isArray(existingVeterinarian.degreeCertificates) ? existingVeterinarian.degreeCertificates : []);

    const experienceValue = experience !== undefined && String(experience).trim() !== ''
      ? normalizeNumber(experience)
      : Number(existingVeterinarian.experience || 0);
    const vetCouncilNumber = String(vetCouncilRegistrationNumber || existingVeterinarian.vetCouncilRegistrationNumber || '').trim();
    const councilName = String(stateVetCouncil || existingVeterinarian.stateVetCouncil || '').trim();
    const nextCertificateValidityDate = certificateValidityDate || existingVeterinarian.certificateValidityDate;
    const practiceTypeValue = String(practiceType || existingVeterinarian.practiceType || '').trim();
    const consultationFeeValue = consultationFee !== undefined && String(consultationFee).trim() !== ''
      ? normalizeNumber(consultationFee)
      : Number(existingVeterinarian.consultationFee || 0);
    const gstPanValue = String(gstPan || existingVeterinarian.gstPan || '').trim().toUpperCase();
    const planValue = String(plan || existingVeterinarian.plan || '').trim();
    const nextClinicId = clinicId || existingVeterinarian.clinicId || null;
    const governmentIdTypeValue = String(govtIdType || existingVeterinarian.govtIdType || '').trim();
    const governmentIdNumberValue = String(govtIdNumber || existingVeterinarian.govtIdNumber || '').trim();
    const governmentIdDocumentValue = govtIdDocument;

    if (!normalizedFullName) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required.',
      });
    }

    if (normalizedFullName.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 3 characters.',
      });
    }

    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.',
      });
    }

    if (!normalizedMobile || !PHONE_REGEX.test(normalizedMobile)) {
      return res.status(400).json({
        success: false,
        message: 'A valid 10-digit mobile number is required.',
      });
    }

    if (!normalizedGender) {
      return res.status(400).json({
        success: false,
        message: 'Gender is required.',
      });
    }

    if (!normalizedDob) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth is required.',
      });
    }

    if (isFutureDate(normalizedDob)) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth cannot be in the future.',
      });
    }

    if (!profilePhoto) {
      return res.status(400).json({
        success: false,
        message: 'Profile photo is required.',
      });
    }

    if (!nextLanguages.length) {
      return res.status(400).json({
        success: false,
        message: 'At least one language is required.',
      });
    }

    if (!String(address || existingVeterinarian.address || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'Address is required.',
      });
    }

    if (!String(city || existingVeterinarian.city || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'City is required.',
      });
    }

    if (!String(state || existingVeterinarian.state || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'State is required.',
      });
    }

    if (!/^\d{6}$/.test(String(pincode || existingVeterinarian.pincode || '').trim())) {
      return res.status(400).json({
        success: false,
        message: 'PIN Code must be 6 digits.',
      });
    }

    if (!governmentIdTypeValue) {
      return res.status(400).json({
        success: false,
        message: 'Government ID type is required.',
      });
    }

    if (!governmentIdNumberValue) {
      return res.status(400).json({
        success: false,
        message: `Government ID number is required for ${governmentIdTypeValue}.`,
      });
    }

    if (!isValidGovernmentId(governmentIdTypeValue, governmentIdNumberValue)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${governmentIdTypeValue} number.`,
      });
    }

    if (!governmentIdDocumentValue) {
      return res.status(400).json({
        success: false,
        message: 'Government ID document is required.',
      });
    }

    if (!Number.isFinite(experienceValue) || experienceValue < 1 || experienceValue > 70) {
      return res.status(400).json({
        success: false,
        message: 'Experience must be between 1 and 70 years.',
      });
    }

    if (!vetCouncilNumber) {
      return res.status(400).json({
        success: false,
        message: 'Vet council registration number is required.',
      });
    }

    if (isPastDate(nextCertificateValidityDate)) {
      return res.status(400).json({
        success: false,
        message: 'Certificate validity date cannot be in the past.',
      });
    }

    if (!registrationCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Registration certificate is required.',
      });
    }

    if (!practiceTypeValue) {
      return res.status(400).json({
        success: false,
        message: 'Practice type is required.',
      });
    }

    if (!Number.isFinite(consultationFeeValue) || consultationFeeValue <= 0 || consultationFeeValue > 100000) {
      return res.status(400).json({
        success: false,
        message: 'Consultation fee must be between 1 and 100000.',
      });
    }

    if (!nextServiceAreas.length) {
      return res.status(400).json({
        success: false,
        message: 'Service areas are required.',
      });
    }

    if (!gstPanValue) {
      return res.status(400).json({
        success: false,
        message: 'GST or PAN is required.',
      });
    }

    if (!isValidGstPan(gstPanValue)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid GSTIN or PAN.',
      });
    }

    if (!normalizedBankDetails.accountName) {
      return res.status(400).json({
        success: false,
        message: 'Account holder name is required.',
      });
    }

    if (!/^\d{9,18}$/.test(String(normalizedBankDetails.accountNumber || '').trim())) {
      return res.status(400).json({
        success: false,
        message: 'Account number must be between 9 and 18 digits.',
      });
    }

    if (!IFSC_REGEX.test(String(normalizedBankDetails.ifsc || '').trim())) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid IFSC code.',
      });
    }

    if (!normalizedBankDetails.bankName) {
      return res.status(400).json({
        success: false,
        message: 'Bank name is required.',
      });
    }

    if (!normalizedBankDetails.branch) {
      return res.status(400).json({
        success: false,
        message: 'Branch is required.',
      });
    }

    if (!planValue) {
      return res.status(400).json({
        success: false,
        message: 'Plan assignment is required.',
      });
    }

    if (nextQualifications.length) {
      const currentYear = new Date().getFullYear();
      const missingQualificationRows = nextQualifications.some((item) => {
        const yearValue = Number(item.year);

        return (
          !item.degree ||
          !item.institution ||
          !item.year ||
          !/^\d{4}$/.test(item.year) ||
          !Number.isFinite(yearValue) ||
          yearValue < 1900 ||
          yearValue > currentYear
        );
      });

      if (missingQualificationRows) {
        return res.status(400).json({
          success: false,
          message: 'Each qualification must include a degree, institution and 4-digit passing year.',
        });
      }

      if (!nextDegreeCertificates.length) {
        return res.status(400).json({
          success: false,
          message: 'Degree certificates are required when qualifications are entered.',
        });
      }
    }

    const existingUser = await User.findOne({
      _id: { $ne: id },
      $or: [
        { email: normalizedEmail },
        { mobile: normalizedMobile },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === normalizedEmail
          ? 'A user with this email already exists.'
          : 'A user with this mobile number already exists.',
      });
    }

    const updatedVeterinarian = await User.findByIdAndUpdate(
      id,
      {
        clinicId: nextClinicId,
        name: normalizedFullName,
        email: normalizedEmail,
        mobile: normalizedMobile,
        gender: normalizedGender,
        dateOfBirth: normalizedDob,
        profilePhoto,
        languages: nextLanguages,
        address: String(address || existingVeterinarian.address || '').trim(),
        city: String(city || existingVeterinarian.city || '').trim(),
        state: String(state || existingVeterinarian.state || '').trim(),
        pincode: String(pincode || existingVeterinarian.pincode || '').trim(),
        govtIdType: governmentIdTypeValue,
        govtIdNumber: governmentIdNumberValue,
        govtIdDocument: governmentIdDocumentValue,
        qualifications: nextQualifications,
        degreeCertificates: nextDegreeCertificates,
        experience: experienceValue,
        specialization: nextSpecializations[0] || '',
        specializations: nextSpecializations,
        vetCouncilRegistrationNumber: vetCouncilNumber,
        stateVetCouncil: councilName,
        registrationCertificate,
        certificateValidityDate: nextCertificateValidityDate,
        isRenewable: normalizeBoolean(isRenewable),
        practiceType: practiceTypeValue,
        consultationFee: consultationFeeValue,
        emergencyAvailable: normalizeBoolean(emergencyAvailable),
        serviceAreas: nextServiceAreas,
        gstPan: gstPanValue,
        bankDetails: normalizedBankDetails,
        plan: planValue,
      },
      { new: true }
    ).populate('clinicId', 'name');

    return res.status(200).json({
      success: true,
      message: 'Veterinarian updated successfully.',
      data: serializeVeterinarian(updatedVeterinarian),
    });
  } catch (error) {
    if (error?.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];

      return res.status(409).json({
        success: false,
        message: duplicateField === 'email'
          ? 'A user with this email already exists.'
          : duplicateField === 'mobile'
            ? 'A user with this mobile number already exists.'
            : 'Duplicate veterinarian details found.',
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update veterinarian.',
    });
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
      latitude,
      longitude,
      email,
      adminEmail,
      adminName,
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
    if (subscriptionType === 'Monthly') expiryDate.setMonth(expiryDate.getMonth() + 1);
    if (subscriptionType === 'Quarterly') expiryDate.setMonth(expiryDate.getMonth() + 3);
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

    const temporaryPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    try {
      await ClinicAdmin.create({
        clinicId: clinic._id,
        email: clinicAdminEmail,
        password: hashedPassword,
        forcePasswordReset: true,
      });
    } catch (clinicAdminError) {
      await Clinic.findByIdAndDelete(clinic._id);
      throw clinicAdminError;
    }

    const notificationWarnings = [];
    const clinicDisplayName = name?.trim() || 'Clinic';
    const adminDisplayName = adminName?.trim() || 'Clinic Admin';

    const notificationJobs = [
      {
        email: clinicAdminEmail,
        subject: `${clinicDisplayName} clinic admin account created`,
        message: `Hello ${adminDisplayName},\n\nYour clinic "${clinicDisplayName}" has been created in HMS.\n\nLogin email: ${clinicAdminEmail}\nTemporary password: ${temporaryPassword}\n\nPlease sign in and change your password after the first login.`,
      },
    ];

    if (contactEmail && contactEmail !== clinicAdminEmail) {
      notificationJobs.push({
        email: contactEmail,
        subject: `${clinicDisplayName} clinic registration received`,
        message: `Hello,\n\nYour clinic "${clinicDisplayName}" has been created in HMS.\n\nThe clinic admin login has been prepared separately and will use the admin email on file.\n\nIf you are the clinic contact, you will receive future approval and status updates here.`,
      });
    }

    const notificationResults = await Promise.allSettled(
      notificationJobs.map(({ email: recipientEmail, subject, message }) =>
        sendEmail({
          email: recipientEmail,
          subject,
          message,
        })
      )
    );

    notificationResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        const failedEmail = notificationJobs[index].email;
        const failureMessage = `Failed to send clinic onboarding email to ${failedEmail}: ${result.reason?.message || result.reason}`;
        notificationWarnings.push(failureMessage);
        console.error(failureMessage);
      }
    });

    res.status(201).json({
      success: true,
      message: notificationWarnings.length
        ? 'Clinic created successfully, but one or more notification emails failed.'
        : 'Clinic created successfully. Login details sent to the clinic admin.',
      data: clinic,
      temporaryPassword,
      clinicAdminEmail,
      emailWarning: notificationWarnings.length ? notificationWarnings : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/veterinarians -> Super Admin onboarding a veterinarian
exports.createVeterinarian = async (req, res) => {
  try {
    const {
      clinicId,
      fullName,
      gender,
      dob,
      mobile,
      email,
      address,
      city,
      state,
      pincode,
      govtIdType,
      govtIdNumber,
      experience,
      vetCouncilRegistrationNumber,
      stateVetCouncil,
      certificateValidityDate,
      isRenewable,
      practiceType,
      consultationFee,
      emergencyAvailable,
      gstPan,
      accountName,
      accountNumber,
      ifsc,
      bankName,
      branch,
      plan,
    } = req.body;

    const normalizedEmail = normalizeEmail(email);
    const normalizedMobile = String(mobile || '').trim();
    const qualifications = normalizeQualifications(req.body.qualifications);
    const languages = normalizeStringList(req.body.languages);
    const specializations = normalizeStringList(req.body.specializations);
    const serviceAreas = normalizeStringList(req.body.serviceAreas);
    const bankDetails = parseMaybeJson(req.body.bankDetails, {}) || {};

    const normalizedBankDetails = {
      accountName: String(bankDetails.accountName || accountName || '').trim(),
      accountNumber: String(bankDetails.accountNumber || accountNumber || '').trim(),
      ifsc: String(bankDetails.ifsc || ifsc || '').trim().toUpperCase(),
      bankName: String(bankDetails.bankName || bankName || '').trim(),
      branch: String(bankDetails.branch || branch || '').trim(),
    };

    const profilePhoto = normalizeSingleUploadName(req.files?.profilePhoto);
    const govtIdDocument = normalizeSingleUploadName(req.files?.govtIdDocument);
    const registrationCertificate = normalizeSingleUploadName(req.files?.registrationCertificate);
    const degreeCertificates = normalizeUploadNames(req.files?.degreeCertificates);

    if (!fullName || !String(fullName).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required.',
      });
    }

    if (String(fullName).trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 3 characters.',
      });
    }

    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.',
      });
    }

    if (!normalizedMobile || !PHONE_REGEX.test(normalizedMobile)) {
      return res.status(400).json({
        success: false,
        message: 'A valid 10-digit mobile number is required.',
      });
    }

    if (!gender) {
      return res.status(400).json({
        success: false,
        message: 'Gender is required.',
      });
    }

    if (!dob) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth is required.',
      });
    }

    if (isFutureDate(dob)) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth cannot be in the future.',
      });
    }

    if (!profilePhoto) {
      return res.status(400).json({
        success: false,
        message: 'Profile photo is required.',
      });
    }

    if (!languages.length) {
      return res.status(400).json({
        success: false,
        message: 'At least one language is required.',
      });
    }

    if (!String(address || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'Address is required.',
      });
    }

    if (!String(city || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'City is required.',
      });
    }

    if (!String(state || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'State is required.',
      });
    }

    if (!/^\d{6}$/.test(String(pincode || '').trim())) {
      return res.status(400).json({
        success: false,
        message: 'PIN Code must be 6 digits.',
      });
    }

    if (!govtIdType) {
      return res.status(400).json({
        success: false,
        message: 'Government ID type is required.',
      });
    }

    if (!String(govtIdNumber || '').trim()) {
      return res.status(400).json({
        success: false,
        message: `Government ID number is required for ${govtIdType}.`,
      });
    }

    if (!isValidGovernmentId(govtIdType, govtIdNumber)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${govtIdType} number.`,
      });
    }

    if (!govtIdDocument) {
      return res.status(400).json({
        success: false,
        message: 'Government ID document is required.',
      });
    }

    const experienceValue = normalizeNumber(experience);
    if (!Number.isFinite(experienceValue) || experienceValue < 1 || experienceValue > 70) {
      return res.status(400).json({
        success: false,
        message: 'Experience must be between 1 and 70 years.',
      });
    }

    if (!String(vetCouncilRegistrationNumber || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vet council registration number is required.',
      });
    }

    if (!/^[A-Za-z0-9/-]{5,30}$/.test(String(vetCouncilRegistrationNumber || '').trim())) {
      return res.status(400).json({
        success: false,
        message: 'Vet council registration number must be 5-30 characters and may include letters, numbers, / or -.',
      });
    }

    if (!String(stateVetCouncil || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'State veterinary council is required.',
      });
    }

    if (!certificateValidityDate) {
      return res.status(400).json({
        success: false,
        message: 'Certificate validity date is required.',
      });
    }

    if (isPastDate(certificateValidityDate)) {
      return res.status(400).json({
        success: false,
        message: 'Certificate validity date cannot be in the past.',
      });
    }

    if (!registrationCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Registration certificate is required.',
      });
    }

    if (!String(practiceType || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'Practice type is required.',
      });
    }

    const consultationFeeValue = normalizeNumber(consultationFee);
    if (!Number.isFinite(consultationFeeValue) || consultationFeeValue <= 0 || consultationFeeValue > 100000) {
      return res.status(400).json({
        success: false,
        message: 'Consultation fee must be between 1 and 100000.',
      });
    }

    if (!serviceAreas.length) {
      return res.status(400).json({
        success: false,
        message: 'At least one service area or pincode is required.',
      });
    }

    if (!String(gstPan || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'GST or PAN is required.',
      });
    }

    if (!isValidGstPan(gstPan)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid GSTIN or PAN.',
      });
    }

    if (!normalizedBankDetails.accountName) {
      return res.status(400).json({
        success: false,
        message: 'Account holder name is required.',
      });
    }

    if (!normalizedBankDetails.accountNumber || !/^\d{9,18}$/.test(normalizedBankDetails.accountNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Account number must be between 9 and 18 digits.',
      });
    }

    if (!normalizedBankDetails.ifsc || !IFSC_REGEX.test(normalizedBankDetails.ifsc)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid IFSC code.',
      });
    }

    if (!normalizedBankDetails.bankName) {
      return res.status(400).json({
        success: false,
        message: 'Bank name is required.',
      });
    }

    if (!normalizedBankDetails.branch) {
      return res.status(400).json({
        success: false,
        message: 'Branch is required.',
      });
    }

    if (!String(plan || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'Plan assignment is required.',
      });
    }

    if (qualifications.length) {
      const currentYear = new Date().getFullYear();
      const missingQualificationRows = qualifications.some((item) => {
        const yearValue = Number(item.year);

        return (
          !item.degree ||
          !item.institution ||
          !item.year ||
          !/^\d{4}$/.test(item.year) ||
          !Number.isFinite(yearValue) ||
          yearValue < 1900 ||
          yearValue > currentYear
        );
      });

      if (missingQualificationRows) {
        return res.status(400).json({
          success: false,
          message: 'Each qualification must include a degree, institution and 4-digit passing year.',
        });
      }

      if (!degreeCertificates.length) {
        return res.status(400).json({
          success: false,
          message: 'Degree certificates are required when qualifications are entered.',
        });
      }
    }

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { mobile: normalizedMobile },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === normalizedEmail
          ? 'A user with this email already exists.'
          : 'A user with this mobile number already exists.',
      });
    }

    const temporaryPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const veterinarian = await User.create({
      clinicId: clinicId || null,
      name: String(fullName).trim(),
      email: normalizedEmail,
      mobile: normalizedMobile,
      password: hashedPassword,
      temporaryPassword,
      forcePasswordReset: true,
      role: 'DOCTOR',
      gender,
      dateOfBirth: dob,
      profilePhoto,
      languages,
      address: String(address || '').trim(),
      city: String(city || '').trim(),
      state: String(state || '').trim(),
      pincode: String(pincode || '').trim(),
      govtIdType,
      govtIdNumber: String(govtIdNumber || '').trim(),
      govtIdDocument,
      qualifications,
      degreeCertificates,
      experience: experienceValue,
      specialization: specializations[0] || '',
      specializations,
      vetCouncilRegistrationNumber: String(vetCouncilRegistrationNumber || '').trim(),
      stateVetCouncil: String(stateVetCouncil || '').trim(),
      registrationCertificate,
      certificateValidityDate,
      isRenewable: normalizeBoolean(isRenewable),
      practiceType: String(practiceType || '').trim(),
      consultationFee: consultationFeeValue,
      emergencyAvailable: normalizeBoolean(emergencyAvailable),
      serviceAreas,
      gstPan: String(gstPan || '').trim().toUpperCase(),
      bankDetails: {
        ...normalizedBankDetails,
        accountName: normalizedBankDetails.accountName,
      },
      plan: String(plan || '').trim(),
    });

    const notificationWarnings = [];

    try {
      await sendEmail({
        email: normalizedEmail,
        subject: 'Your veterinarian login credentials',
        message: `Hello ${String(fullName).trim()},\n\nYour veterinarian account has been created in HMS.\n\nLogin email: ${normalizedEmail}\nTemporary password: ${temporaryPassword}\n\nPlease sign in and change your password after the first login.\n\nRegards,\nHMS Team`,
      });
    } catch (emailError) {
      const warningMessage = `Failed to send veterinarian credential email to ${normalizedEmail}: ${emailError.message}`;
      notificationWarnings.push(warningMessage);
      console.error(warningMessage);
    }

      return res.status(201).json({
        success: true,
        message: notificationWarnings.length
          ? 'Veterinarian created successfully, but the credential email failed.'
          : 'Veterinarian created successfully. Login credentials sent to the registered email address.',
        data: veterinarian,
        emailWarning: notificationWarnings.length ? notificationWarnings : undefined,
      });
  } catch (error) {
    if (error?.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];

      return res.status(409).json({
        success: false,
        message: duplicateField === 'email'
          ? 'A user with this email already exists.'
          : duplicateField === 'mobile'
            ? 'A user with this mobile number already exists.'
            : 'Duplicate veterinarian details found.',
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
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

// ==========================================
// NEW: UPDATE CLINIC
// ==========================================
// PUT /api/clinics/:id -> Update full clinic details
exports.updateClinic = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const clinic = await Clinic.findById(id);
    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found',
      });
    }

    // Update the clinic using the new fields defined in the schema
    const updatedClinic = await Clinic.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Clinic updated successfully.',
      data: updatedClinic,
    });
  } catch (error) {
    console.error('UPDATE CLINIC ERROR:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update clinic',
      error: error.message,
    });
  }
};
// ==========================================
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
      if (subscriptionType === 'Monthly') expiryDate.setMonth(expiryDate.getMonth() + 1);
      if (subscriptionType === 'Quarterly') expiryDate.setMonth(expiryDate.getMonth() + 3);
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
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [
      totalClinics,
      activeClinics,
      suspendedClinics,
      totalOwners,
      totalDoctors,
      activeDoctors,
      activePlans,
      newClinicsThisWeek,
      newClinicsThisMonth,
      newDoctorsThisMonth,
      newPlansThisMonth,
      recentClinics,
      verificationAggregation,
      revenueAggregation,
      lastMonthRevenueAggregation,
    ] = await Promise.all([
      Clinic.countDocuments(),
      Clinic.countDocuments({ subscriptionStatus: 'ACTIVE' }),
      Clinic.countDocuments({ subscriptionStatus: { $in: ['SUSPENDED', 'EXPIRED'] } }),
      Owner.countDocuments(),
      DoctorDetails.countDocuments(),
      DoctorDetails.countDocuments({ status: 'Active' }),
      SubscriptionPlan.countDocuments({ status: 'Active' }),
      Clinic.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Clinic.countDocuments({ createdAt: { $gte: startOfMonth } }),
      DoctorDetails.countDocuments({ createdAt: { $gte: startOfMonth } }),
      SubscriptionPlan.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Clinic.find()
        .select('name contactEmail subscriptionStatus verificationStatus createdAt expiryDate')
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      Clinic.aggregate([
        {
          $group: {
            _id: '$verificationStatus',
            value: { $sum: 1 },
          },
        },
      ]),
      Appointment.aggregate([
        {
          $match: {
            status: 'COMPLETED',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctor',
          },
        },
        {
          $unwind: {
            path: '$doctor',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            fee: { $ifNull: ['$doctor.consultationFee', 0] },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$appointmentDate' },
              month: { $month: '$appointmentDate' },
            },
            revenue: { $sum: '$fee' },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
      ]),
      Appointment.aggregate([
        {
          $match: {
            status: 'COMPLETED',
            appointmentDate: {
              $gte: startOfLastMonth,
              $lte: endOfLastMonth,
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctor',
          },
        },
        {
          $unwind: {
            path: '$doctor',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum: { $ifNull: ['$doctor.consultationFee', 0] },
            },
          },
        },
      ]),
    ]);

    const revenueTrend = buildMonthlySeries(revenueAggregation, 'revenue', 12);
    const currentMonthRevenue = revenueTrend.at(-1)?.value || 0;
    const previousMonthRevenue = revenueTrend.at(-2)?.value || 0;
    const lastMonthRevenue = lastMonthRevenueAggregation[0]?.revenue || 0;

    const verificationMap = verificationAggregation.reduce((accumulator, item) => {
      accumulator[item._id || 'UNKNOWN'] = Number(item.value || 0);
      return accumulator;
    }, {
      SUBMITTED: 0,
      UNDER_REVIEW: 0,
      DOCS_VERIFIED: 0,
      APPROVED: 0,
      REJECTED: 0,
      UNKNOWN: 0,
    });

    const pendingVerifications =
      Number(verificationMap.SUBMITTED || 0) +
      Number(verificationMap.UNDER_REVIEW || 0) +
      Number(verificationMap.DOCS_VERIFIED || 0);

    const approvedClinics = Number(verificationMap.APPROVED || 0);
    const rejectedClinics = Number(verificationMap.REJECTED || 0);
    const unknownClinics = Number(verificationMap.UNKNOWN || 0);

    const totalRevenue = revenueAggregation.reduce(
      (sum, item) => sum + Number(item.revenue || 0),
      0
    );

    res.status(200).json({
      success: true,
      data: {
        totalClinics,
        activeClinics,
        suspendedClinics,
        totalPlatformUsers: totalOwners,
        totalDoctors,
        activeDoctors,
        activePlans,
        totalRevenue,
        newClinicsThisWeek,
        newClinicsThisMonth,
        newDoctorsThisMonth,
        newPlansThisMonth,
        verificationSummary: {
          SUBMITTED: Number(verificationMap.SUBMITTED || 0),
          UNDER_REVIEW: Number(verificationMap.UNDER_REVIEW || 0),
          DOCS_VERIFIED: Number(verificationMap.DOCS_VERIFIED || 0),
          APPROVED: approvedClinics,
          REJECTED: rejectedClinics,
          UNKNOWN: unknownClinics,
        },
        verificationDistribution: [
          { name: 'Approved', value: approvedClinics, color: '#22c55e' },
          { name: 'Pending Review', value: pendingVerifications, color: '#f59e0b' },
          { name: 'Rejected', value: rejectedClinics, color: '#ef4444' },
        ],
        recentClinics: recentClinics.map((clinic, index) => ({
          ...clinic,
          displayId: `#${String(index + 1).padStart(3, '0')}`,
        })),
        revenueTrend,
        revenueComparison: {
          currentMonthRevenue,
          previousMonthRevenue,
          lastMonthRevenue,
          difference: currentMonthRevenue - previousMonthRevenue,
          monthOverMonthChange: previousMonthRevenue
            ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
            : null,
        },
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
