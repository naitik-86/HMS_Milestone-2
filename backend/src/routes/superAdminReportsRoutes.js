const express = require('express');
const router = express.Router();

const { authorize } = require('../middlewares/auth');
const { getSuperAdminBasicReports } = require('../controllers/adminReportsController');

router.use(authorize('SUPER_ADMIN'));

router.get('/basic', getSuperAdminBasicReports);

module.exports = router;

