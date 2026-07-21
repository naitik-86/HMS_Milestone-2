const express = require('express');
const router = express.Router();

const { 
    verifySuperAdminOtp, 
    verifyClinicAdminOtp, 
    verifyStaffOtp,
    validateLoginOtp
} = require('../controllers/authOtpController');

router.post('/superadmin/verify-otp', verifySuperAdminOtp);
router.post('/clinicadmin/verify-otp', verifyClinicAdminOtp);
router.post('/staff/verify-otp', verifyStaffOtp);
router.post('/validate-login-otp', validateLoginOtp);

module.exports = router;
