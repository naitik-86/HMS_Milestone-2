const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const superAdminRoutes = require('./superAdminRoutes');
const clinicAdminRoutes = require('./clinicAdminRoutes');
const doctorRoutes = require('./doctorRoutes');
const receptionRoutes = require('./receptionRoutes');
const preConsultationRoutes = require("./preConsultationRoutes");
const petOwnerRoutes = require("./petOwnerRoutes");
const doctorModule = require('./DoctorModuleRoutes')
const { protect, authorize } = require('../middlewares/auth');
const labRoutes = require("./labRoutes");
// Public routes
router.use('/auth', authRoutes);

// Protected role-based modules

router.use('/super-admin', protect, superAdminRoutes);

router.use('/clinic', protect, clinicAdminRoutes);

// Owner Pet
router.use("/pet-owner", petOwnerRoutes);

// Doctor Module
router.use("/doctorModule", doctorModule)

// lab module 
router.use("/lab", labRoutes);

module.exports = router;