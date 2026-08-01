const express = require('express');
const router = express.Router();

const {
    verifySuperAdminOtp,
    verifyClinicAdminOtp,
    verifyStaffOtp,
} = require('../controllers/authOtpController');
const { resendLoginOtp } = require('../controllers/authController');

router.post('/superadmin/verify-otp', verifySuperAdminOtp);
router.post('/clinicadmin/verify-otp', verifyClinicAdminOtp);
router.post('/staff/verify-otp', verifyStaffOtp);
router.post('/resend-otp', resendLoginOtp);

module.exports = router;
