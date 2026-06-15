const express = require('express');
const router = express.Router();

const { authorize } = require('../middlewares/auth');

const {
    createClinic,
    getAllClinics,
    updateSubscription,
    getAdminDashboard,
    updateClinicVerification,
    uploadClinicDocuments
} = require('../controllers/adminController');

const upload = require('../middlewares/upload');

router.use(authorize('SUPER_ADMIN'));

router.post('/clinics', createClinic);
router.get('/clinics', getAllClinics);
router.put('/clinics/:id/subscription', updateSubscription);
router.get('/dashboard', getAdminDashboard);

router.put('/clinics/:id/verification', updateClinicVerification);

router.post(
    '/clinics/:id/documents',
    upload.fields([
        { name: 'vetCouncilCertificate', maxCount: 1 },
        { name: 'tradeLicense', maxCount: 1 },
        { name: 'cancelledCheque', maxCount: 1 }
    ]),
    uploadClinicDocuments
);

module.exports = router;