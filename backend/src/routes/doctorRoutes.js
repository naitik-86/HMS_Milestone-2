const express = require('express');
const { getDoctorQueue, saveConsultation } = require('../controllers/doctorController');
const { protect, authorize } = require('../middlewares/auth');
const router = express.Router();

router.get('/queue', protect, authorize('DOCTOR'), getDoctorQueue);
router.put('/consultation', protect, authorize('DOCTOR'), saveConsultation);

module.exports = router;