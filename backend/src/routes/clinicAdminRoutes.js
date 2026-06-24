const express = require('express');
const router = express.Router();

const { authorize } = require('../middlewares/auth');
const upload = require('../middlewares/uploadMiddleware');

// controllers
const staffController = require('../controllers/staffController');
const doctorController = require('../controllers/doctorDetailController');
const labController = require('../controllers/labTechnicianController');
const groomerController = require('../controllers/groomerController');
const kennelController = require('../controllers/kennelController');
const settingsController = require('../controllers/clinicSettingsController');
const reportsController = require('../controllers/adminReportsController');

const labReportController = require("../controllers/labDashboardController");
const petRegistrationController = require("../controllers/petRegistrationController");

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
router.get("/lab-technicians/:id", labController.getSingleLabTechnician)
router.put("/lab-technicians/:id", labController.updateLabTechnician);
router.delete("/lab-technicians/:id", labController.deleteLabTechnician);

//labReportDashboard

router.get("/stats", labReportController.getDashboardStats);
router.get("/recent-activities", labReportController.getRecentActivities);
router.get("/pending-summary", labReportController.getPendingSummary);

// for create report

router.post("/report", upload.single("reportFile"), labReportController.createReport);
router.get("/report", labReportController.getAllReports);
router.get("/report/:id", labReportController.getSingleReport);
router.put("/report/:id", labReportController.updateReport);
router.delete("/report/:id", labReportController.deleteReport);

/* GROOMER */
router.post('/groomers/create', upload.fields([
    { name: "certificateDocument", maxCount: 1 },
]), groomerController.createGroomer);

router.get("/groomers", groomerController.getAllGroomers);
router.get("/groomers/:id", groomerController.getGroomerById);
router.put(
    "/groomers/:id",
    upload.fields([
        { name: "profilePhoto", maxCount: 1 },
        { name: "certificateDocument", maxCount: 1 }
    ]),
    groomerController.updateGroomer
);

router.delete("/groomers/:id", groomerController.deleteGroomer);

/* KENNEL */
router.post('/kennel/create', upload.fields([
    { name: "firstAidCertificate", maxCount: 1 },
]), kennelController.createKennel);
router.get("/kennel", kennelController.getAllKennels);
router.get("/kennel/:id", kennelController.getKennelById);
router.put("/kennel/:id", upload.fields([
    { name: "firstAidCertificate", maxCount: 1, },
]), kennelController.updateKennel);
router.patch("/kennel/:id/status", kennelController.toggleKennelStatus);
router.delete("/kennel/:id", kennelController.deleteKennel);

/* SETTINGS */
router.get('/clinic-settings', settingsController.getClinicSettings);
router.put('/clinic-settings', settingsController.updateClinicSettings);
router.post("/clinic-settings/logo", upload.single("logo"), settingsController.uploadClinicLogo);

/* REPORTS */

router.get("/reports/dashboard-summary", reportsController.getDashboardSummary);
router.get("/reports/revenue", reportsController.getRevenueReport);
router.get("/reports/staff-role", reportsController.getStaffRoleReport);
router.get("/reports/appointment-trend", reportsController.getAppointmentTrend);
router.get("/reports/top-doctors", reportsController.getTopDoctors);


//reception routes

router.post("/reception/new-registration", upload.single("petPhoto"), petRegistrationController.createRegistration);
router.get("/reception/new-registration/mobile/:mobileNumber", petRegistrationController.searchCustomer);
router.get("/reception/new-registration/owner/:ownerId", petRegistrationController.getOwnerDetails);
router.post("/reception/new-registration/owner/:ownerId/pets", petRegistrationController.addPet);
router.post("/reception/new-registration/owner/:ownerId/pets/:petId/visit", petRegistrationController.addVisit);
router.get("/reception/new-registration/owner/:ownerId/pets/:petId/history", petRegistrationController.getPetHistory);

router.get("/reception/existing-customers/stats", petRegistrationController.getDashboardStats);
router.get("/reception/existing-customers", petRegistrationController.getExistingCustomers);
router.get("/reception/existing-customers/:ownerId/pets/:petId", petRegistrationController.getPetDetails);

module.exports = router;