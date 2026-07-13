const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const authOtpRoutes = require('./authOtpRoutes');
const superAdminRoutes = require('./superAdminRoutes');
const superAdminReportsRoutes = require('./superAdminReportsRoutes');
const clinicAdminRoutes = require('./clinicAdminRoutes');
const doctorRoutes = require('./doctorRoutes');
const receptionRoutes = require('./receptionRoutes');
const preConsultationRoutes = require("./preConsultationRoutes");
const petOwnerRoutes = require("./petOwnerRoutes");
const doctorModule = require('./DoctorModuleRoutes');
const labRoutes = require("./labRoutes");
const contactRoute = require("./contactRoutes")


// Import middlewares and controllers for root-level routes
const { protect, authorize } = require('../middlewares/auth');
const { getDashboardRedirect } = require('../controllers/dashboardController');

// Public routes
router.use('/auth', authRoutes);
router.use('/auth', authOtpRoutes);

// Protected role-based modules
router.use('/super-admin', protect, superAdminRoutes);

router.use('/super-admin-reports', protect, superAdminReportsRoutes);

router.use('/clinic', protect, clinicAdminRoutes);

// Owner Pet
router.use("/pet-owner", petOwnerRoutes);

// Doctor Module
router.use("/doctorModule", doctorModule)

// lab module 
router.use("/lab", labRoutes);
router.use("/contact", contactRoute)



// ==========================================
// CENTRALIZED DASHBOARD REDIRECT
// ==========================================
router.get('/dashboard', protect, getDashboardRedirect);

module.exports = router;
