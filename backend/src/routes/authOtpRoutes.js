const express = require('express');
const router = express.Router();

const {
    verifySuperAdminOtp,
    verifyClinicAdminOtp,
    verifyStaffOtp,
    selectStaffRole,
    switchStaffRole,
} = require('../controllers/authOtpController');
const { resendLoginOtp } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/superadmin/verify-otp', verifySuperAdminOtp);
router.post('/clinicadmin/verify-otp', verifyClinicAdminOtp);
router.post('/staff/verify-otp', verifyStaffOtp);
router.post('/resend-otp', resendLoginOtp);
router.post('/select-role', selectStaffRole);
// Already-logged-in staff switching to another of their own roles - needs a
// valid session token, unlike /select-role which runs right after OTP verify
// before any session token exists yet.
router.post('/switch-role', protect, switchStaffRole);

module.exports = router;
