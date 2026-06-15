const express = require('express');
const router = express.Router();

const {
    requestLoginOTP,
    verifyOTPAndLogin,
    verifySuperAdmin
} = require('../controllers/authController');

router.post('/request-otp', requestLoginOTP);
router.post('/login', verifySuperAdmin);
router.post('/verify-otp', verifyOTPAndLogin);

module.exports = router;