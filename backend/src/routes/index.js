const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const superAdminRoutes = require('./superAdminRoutes');
const clinicAdminRoutes = require('./clinicAdminRoutes');
const doctorRoutes = require('./doctorRoutes');
const receptionRoutes = require('./receptionRoutes');

const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.use('/auth', authRoutes);
// Protected role-based modules
router.use('/super-admin', protect, superAdminRoutes);
router.use('/clinic', protect, authorize("CLINIC_ADMIN"), clinicAdminRoutes);

module.exports = router;