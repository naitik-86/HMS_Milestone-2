const express = require('express');
const router = express.Router();

const { authorize } = require('../middlewares/auth');
const { upload } = require('../middlewares/uploadMiddleware');

// controllers
const staffController = require('../controllers/staffController');
const doctorController = require('../controllers/doctorDetailController');
const labController = require('../controllers/labTechnicianController');
const groomerController = require('../controllers/groomerController');
const kennelController = require('../controllers/kennelController');
const settingsController = require('../controllers/clinicSettingsController');
const reportsController = require('../controllers/adminReportsController');

router.use(authorize('CLINIC_ADMIN'));

/* STAFF */
router.get('/managers', staffController.getManagers);
router.post('/staff', upload.single("profilePhoto"), staffController.createStaff);
router.get('/staff', staffController.getAllStaff);
router.get('/staff/:id', staffController.getStaffById);
router.put('/staff/:id', staffController.updateStaff);
router.delete('/staff/:id', staffController.deleteStaff);

/* DOCTORS */
router.post('/doctors/create', upload.fields([
    { name: "degreeCertificates", maxCount: 10 },
    { name: "registrationCertificate", maxCount: 1 },
    { name: "digitalSignature", maxCount: 1 },
    { name: "doctorLetterhead", maxCount: 1 },
]), doctorController.createDoctor);

router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctors/:id', doctorController.getDoctorById);
router.put('/doctors/:id', doctorController.updateDoctor);
router.delete('/doctors/:id', doctorController.deleteDoctor);

/* LAB */
router.post('/lab-technicians/create', upload.fields([
    { name: "certificate", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
]), labController.createLabTechnician);

router.get('/lab-technicians', labController.getAllLabTechnicians);

/* GROOMER */
router.post('/groomers/create', upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "certificateDocument", maxCount: 1 },
]), groomerController.createGroomer);

/* KENNEL */
router.post('/kennel/create', upload.fields([
    { name: "firstAidCertificate", maxCount: 1 },
]), kennelController.createKennel);

/* SETTINGS */
router.get('/clinic-settings', settingsController.getClinicSettings);
router.put('/clinic-settings', settingsController.updateClinicSettings);

/* REPORTS */
router.get('/reports/dashboard-summary', reportsController.getDashboardSummary);
router.get('/reports/revenue', reportsController.getRevenueReport);

module.exports = router;