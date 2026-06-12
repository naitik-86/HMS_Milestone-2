const express = require('express');
const router = express.Router();

// Middleware Imports
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload'); // NEW: AWS S3 Multer Middleware

// Controller Imports
const { requestLoginOTP, verifyOTPAndLogin, verifySuperAdmin } = require('../controllers/authController');
const {
  getMe,
  createClinic,
  createStaff,
  updateStaff,
  deleteStaff,
  getAllClinics,
  updateSubscription,
  getAdminDashboard,
  updateClinicVerification, // NEW
  uploadClinicDocuments     // NEW
} = require('../controllers/adminController');

const {
  searchOwner,
  getClinicQueue,
  updateAppointmentStatus,
  registerOwnerAndPet,
  bookAppointment,
  updateVitals
} = require('../controllers/receptionController');

const { saveConsultation } = require('../controllers/doctorController');
const { searchNearbyClinics } = require('../controllers/clinicController');
const { getDoctorSlots, getOwnerAppointments } = require('../controllers/appointmentController');
const { getPetMedicalHistory } = require('../controllers/medicalRecordController');
const { getVaccinationSchedule } = require('../controllers/vaccineController');
const {
  createPaymentOrder,
  verifyRazorpayWebhook,
  getOwnerInvoices
} = require('../controllers/paymentController');
const { addPet, getPetDetails, updatePet } = require('../controllers/petController');
const { addReview, getClinicReviews, deleteReview } = require('../controllers/reviewController');


// ==========================================
// AUTHENTICATION
// ==========================================
router.post('/auth/request-otp', requestLoginOTP);
router.post('/auth/login', verifySuperAdmin); // log in of superadmin via email & password
router.post('/auth/verify-otp', verifyOTPAndLogin);


// ==========================================
// M1 & M4: USER & ADMIN ROUTES
// ==========================================
router.get('/users/me', protect, getMe);

// Super Admin
router.post('/clinics', protect, authorize('SUPER_ADMIN'), createClinic);
router.get('/clinics', protect, authorize('SUPER_ADMIN'), getAllClinics);
router.put('/clinics/:id/subscription', protect, authorize('SUPER_ADMIN'), updateSubscription);
router.get('/clinics/dashboard', protect, authorize('SUPER_ADMIN'), getAdminDashboard);
// NEW: Document Upload and Verification State
router.put('/clinics/:id/verification', protect, authorize('SUPER_ADMIN'), updateClinicVerification);
router.post('/clinics/:id/documents', protect, authorize('SUPER_ADMIN'), upload.fields([
  { name: 'vetCouncilCertificate', maxCount: 1 },
  { name: 'tradeLicense', maxCount: 1 },
  { name: 'cancelledCheque', maxCount: 1 }
]), uploadClinicDocuments);

// Clinic Admin
router.post('/users/staff', protect, authorize('CLINIC_ADMIN'), createStaff);
router.put('/users/staff/:id', protect, authorize('CLINIC_ADMIN'), updateStaff);
router.delete('/users/staff/:id', protect, authorize('CLINIC_ADMIN'), deleteStaff);


// ==========================================
// M2: RECEPTION & FRONT DESK ROUTES
// ==========================================
router.post('/owners/register', protect, authorize('RECEPTIONIST', 'CLINIC_ADMIN'), registerOwnerAndPet);
router.get('/owners/search', protect, authorize('RECEPTIONIST', 'CLINIC_ADMIN', 'DOCTOR'), searchOwner);
router.get('/appointments/queue', protect, authorize('RECEPTIONIST', 'CLINIC_ADMIN'), getClinicQueue);
router.post('/appointments/book', protect, authorize('RECEPTIONIST', 'CLINIC_ADMIN', 'OWNER'), bookAppointment);
router.put('/appointments/:id/status', protect, authorize('RECEPTIONIST', 'CLINIC_ADMIN'), updateAppointmentStatus);


// ==========================================
// DOCTOR & PARA-MEDICAL WORKFLOW
// ==========================================
router.post('/records/vitals', protect, authorize('PARA_MEDICAL'), updateVitals);
router.put('/records/consultation', protect, authorize('DOCTOR'), saveConsultation);


// ==========================================
// M6: PET MANAGEMENT & MOBILE APP
// ==========================================
router.post('/pets', protect, addPet);
router.get('/pets/:id', protect, getPetDetails);
router.put('/pets/:id', protect, updatePet);
router.get('/appointments/owner', protect, authorize('OWNER'), getOwnerAppointments);


// ==========================================
// CORE PLATFORM & RECURRING WORKFLOWS
// ==========================================
router.get('/clinics/search', searchNearbyClinics);
router.get('/appointments/slots', protect, getDoctorSlots);
router.get('/records/history/:petId', protect, authorize('DOCTOR', 'CLINIC_ADMIN'), getPetMedicalHistory);
router.get('/vaccines/schedule/:petId', protect, getVaccinationSchedule);


// ==========================================
// M7: PAYMENTS & INVOICES
// ==========================================
router.post('/payments/create-order', protect, authorize('OWNER', 'RECEPTIONIST'), createPaymentOrder);
router.post('/payments/webhook', verifyRazorpayWebhook);
router.get('/payments/invoices', protect, authorize('OWNER'), getOwnerInvoices);


// ==========================================
// RATINGS & FEEDBACK
// ==========================================
router.post('/reviews', protect, authorize('OWNER'), addReview);
router.get('/reviews/clinic/:id', getClinicReviews);
router.delete('/reviews/:id', protect, authorize('SUPER_ADMIN'), deleteReview);

module.exports = router;