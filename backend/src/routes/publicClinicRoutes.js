const express = require('express');
const router = express.Router();

const {
    registerClinic,
    getPublicPlans,
    sendClinicAdminOtp,
    verifyClinicAdminOtp,
} = require('../controllers/adminController');

// Deliberately unauthenticated - this is the public "Register your clinic"
// sign-up flow (Testing server only). sendClinicAdminOtp/verifyClinicAdminOtp
// are the same functions Super Admin's Add Clinic form already uses to
// verify the admin's phone before submission - reused as-is here.
router.get('/plans', getPublicPlans);
router.post('/admin-otp/send', sendClinicAdminOtp);
router.post('/admin-otp/verify', verifyClinicAdminOtp);
router.post('/register', registerClinic);

module.exports = router;
