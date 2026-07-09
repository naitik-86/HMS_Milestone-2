const express = require("express");
const router = express.Router();
const { authorize } = require('../middlewares/auth');
const {
    getDashboard,
    getPendingPets,
    getCompletedPets,
    getHistory,
    getPatient,
    getLabPets,
    updatePatient,
    createPatient,
    getLabReportByVisit,
    getPreConsultationByVisit,
} = require("../controllers/DoctorModuleController");

console.log("checking");



router.use(authorize("DOCTOR", "CLINIC_ADMIN"));

// Dashboard
router.get("/dashboard", getDashboard);

// Pending Pets
router.get("/pending-pets", getPendingPets);

// Completed Pets
router.get("/completed-pets", getCompletedPets);

// History
router.get("/history", getHistory);

// Edit Button
router.get("/patient/:id", getPatient);

// Save Complete Form
router.put("/patient/:id", updatePatient);
router.get("/report/lab/:id", getLabReportByVisit);
router.get("/report/pre-consultation/:id", getPreConsultationByVisit);

router.get("/lab-pets", getLabPets);

router.post("/patient", createPatient);

module.exports = router;