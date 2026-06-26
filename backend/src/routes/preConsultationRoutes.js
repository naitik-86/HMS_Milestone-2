const express = require("express");
const router = express.Router();

const {
  savePreConsultation,
  getDashboard,
  getPendingPets,
  getCompletedPets,
  getHistoryPets,
  getSinglePreConsultation,
  updatePreConsultation,
} = require("../controllers/preConsultationController");

// Dashboard
router.get("/dashboard", getDashboard);

// Pending Pets
router.get("/pending", getPendingPets);

// Completed Pets
router.get("/completed", getCompletedPets);

// History
router.get("/history", getHistoryPets);

// Get Single Record
router.get("/:id", getSinglePreConsultation);

// Save Pre Consultation
router.post("/", savePreConsultation);

// Update Pre Consultation
router.put("/:id", updatePreConsultation);

module.exports = router;