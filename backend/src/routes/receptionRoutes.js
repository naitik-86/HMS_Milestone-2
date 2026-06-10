const express = require('express');
const { registerOwnerAndPet, bookAppointment, updateVitals } = require('../controllers/receptionController');
const { protect, authorize } = require('../middlewares/auth');
const router = express.Router();

router.post('/register', protect, authorize('RECEPTIONIST', 'CLINIC_ADMIN'), registerOwnerAndPet);
router.post('/book', protect, authorize('RECEPTIONIST', 'CLINIC_ADMIN'), bookAppointment);
router.post('/vitals', protect, authorize('PARA_MEDICAL'), updateVitals);

module.exports = router;