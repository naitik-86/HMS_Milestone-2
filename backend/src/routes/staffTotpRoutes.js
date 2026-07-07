const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/auth');
const { setupTotp, verifyTotp } = require('../controllers/staffTotpController');

// NOTE: This app currently logs staff using /auth/login which issues JWT with {id, role, clinicId}.
// protect() will populate req.user.

router.post('/setup', protect, setupTotp);
router.post('/verify', protect, verifyTotp);

module.exports = router;

