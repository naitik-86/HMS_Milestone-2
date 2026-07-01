const express = require("express");

const router = express.Router();

const {
    getDashboard,
    getPendingPets,
    getCompletedPets,
    getHistory,
    getPatient,
    createConsultation,
    updateConsultation,
    deleteConsultation
} = require("../controllers/DoctorModuleController");

// ===============================
// Dashboard
// ===============================
router.get("/dashboard", getDashboard);

// ===============================
// Pending Pets
// ===============================
router.get("/pending-pets", getPendingPets);

// ===============================
// Completed Pets
// ===============================
router.get("/completed-pets", getCompletedPets);

// ===============================
// Consultation History
// ===============================
router.get("/history", getHistory);

// ===============================
// Get Single Patient
// ===============================
router.get("/patient/:id", getPatient);

// ===============================
// Create Consultation
// ===============================
router.post("/consultation", createConsultation);

// ===============================
// Update Consultation
// ===============================
router.put("/consultation/:id", updateConsultation);

// ===============================
// Delete Consultation
// ===============================
router.delete("/consultation/:id", deleteConsultation);

module.exports = router;