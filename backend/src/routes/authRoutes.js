const express = require('express');
const router = express.Router();

const {
    requestLoginOTP,
    verifyOTPAndLogin,
    login
} = require('../controllers/authController');

router.post('/request-otp', requestLoginOTP);
router.post('/login', login);
router.post('/verify-otp', verifyOTPAndLogin);

module.exports = router;