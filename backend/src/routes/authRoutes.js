const express = require('express');
const router = express.Router();

// const {
//     requestLoginOTP,
//     verifyOTPAndLogin,
//     verifySuperAdmin
// } = require('../controllers/authController');
const authController = require('../controllers/authController');
//router.post('/auth/request-otp', requestLoginOTP);
// router.post('/auth/login', verifySuperAdmin); // log in of superadmin via email & password
//router.post('/auth/verify-otp', verifyOTPAndLogin);
router.post('/auth/login', authController.login);
module.exports = router;