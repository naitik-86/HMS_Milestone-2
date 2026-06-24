const express = require("express");
const router = express.Router();

const {
  createPreConsultation,
  getDashboard,
  getPendingPets,
  getCompletedPets,
  updatePreConsultation,
} = require("../controllers/preConsultationController");

router.get("/dashboard", getDashboard);

router.get("/pending", getPendingPets);

router.get("/completed", getCompletedPets);

router.post("/", createPreConsultation);

router.put("/:id", updatePreConsultation);

module.exports = router;