const express = require('express');
const router = express.Router();

const { verifySuperAdminOtp } = require('../controllers/authOtpController');


router.post('/superadmin/verify-otp', verifySuperAdminOtp);

module.exports = router;

