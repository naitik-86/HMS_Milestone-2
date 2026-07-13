const express = require('express');
const router = express.Router();

const { authorize } = require('../middlewares/auth');
const {
    createClinic,
    getAllClinics,
    deleteClinic,
    updateSubscription,
    getAdminDashboard,
    updateClinicVerification,
    uploadClinicDocuments
} = require('../controllers/adminController');
const {
    createPlan,
    getPlans,
    updatePlan,
    deletePlan
} = require('../controllers/subscriptionPlanController');

const upload = require('../middlewares/upload');

router.use(authorize('SUPER_ADMIN'));

router.post('/clinics', createClinic);
router.get('/clinics', getAllClinics);
router.delete('/clinics/:id', deleteClinic);
router.put('/clinics/:id/subscription', updateSubscription);
router.get('/dashboard', getAdminDashboard);
router.post('/plans', createPlan);
router.get('/plans', getPlans);
router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

router.put('/clinics/:id/verification', updateClinicVerification);

router.post(
    '/clinics/:id/documents',
    upload.fields([
        { name: 'clinicLogo', maxCount: 1 },
        { name: 'vetCouncilCertificate', maxCount: 1 },
        { name: 'tradeLicense', maxCount: 1 },
        { name: 'cancelledCheque', maxCount: 1 },
        { name: 'adminProfile', maxCount: 1 }
    ]),
    uploadClinicDocuments
);

module.exports = router;
