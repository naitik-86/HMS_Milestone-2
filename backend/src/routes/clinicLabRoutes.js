const express = require('express');
const router = express.Router();
const { authorize } = require('../middlewares/auth');
const upload = require('../middlewares/uploadMiddleware');
const labController = require('../controllers/labTechnicianController');


router.use(authorize("LAB_TECHNICIAN", "CLINIC_ADMIN", "STAFF", "RECEPTION", "RECEPTIONIST", "SUPER_ADMIN", "DOCTOR"));

router.get('/dashboard', labController.getLabDashboard);
router.post('/create', upload.fields([
    { name: "certificate", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
]), labController.createLabTechnician);

router.get('/', labController.getAllLabTechnicians);
router.get('/pending-pets', labController.getLabPendingPets);
router.get('/required-tests', labController.getRequiredLabTests);
router.get('/reports', labController.getAllPatientReports);

router.post(
    "/upload-lab-reports",
    upload.fields([
        { name: "CBC" },
        { name: "Biochemistry" },
        { name: "Urinalysis" },
        { name: "Culture & Sensitivity" },
        { name: "X-Ray" },
        { name: "USG" },
        { name: "Cytology" },
        { name: "ELISA" },
        { name: "PCR" },
        { name: "Blood" },
        { name: "Urine" },
        { name: "Stool" },
        { name: "Swab" },
        { name: "Biopsy" }
    ]),
    labController.uploadLabReports
);
router.put("/update/:id", labController.updateLabResults);
router.put("/completed-pets", labController.getCompletedLabPets);
router.get("/:id", labController.getSingleLabTechnician)
router.put("/:id", labController.updateLabTechnician);
router.delete("/:id", labController.deleteLabTechnician);

module.exports = router;