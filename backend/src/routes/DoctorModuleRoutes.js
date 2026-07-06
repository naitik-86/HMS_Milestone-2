const express = require("express");
const router = express.Router();

const {
    getDashboard,
    getPendingPets,
    getCompletedPets,
    getHistory,
    getPatient,
    getLabPets,
    updatePatient,
    createPatient
} = require("../controllers/DoctorModuleController");

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

router.get("/lab-pets", getLabPets);

router.post("/patient", createPatient);

module.exports = router;