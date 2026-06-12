const express = require('express');
const router = express.Router();

const {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
    getManagers,
} = require("../controllers/staffController");

const {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
} = require("../controllers/doctorDetailController");

const {
    createLabTechnician,
    getAllLabTechnicians,
    getSingleLabTechnician,
    updateLabTechnician,
    deleteLabTechnician,
} = require("../controllers/labTechnicianController");

const { upload } = require("../middlewares/uploadMiddleware");

/* =========================
   STAFF ROUTES
========================= */

router.get("/managers", getManagers);

router.post(
    "/staff",
    upload.single("profilePhoto"),
    createStaff
);

router.get("/staff", getAllStaff);
router.get("/staff/:id", getStaffById);
router.put("/staff/:id", updateStaff);
router.delete("/staff/:id", deleteStaff);

/* =========================
   DOCTOR ROUTES
========================= */

router.post(
    "/doctors/create",
    upload.fields([
        {
            name: "degreeCertificates",
            maxCount: 10,
        },
        {
            name: "registrationCertificate",
            maxCount: 1,
        },
        {
            name: "digitalSignature",
            maxCount: 1,
        },
        {
            name: "doctorLetterhead",
            maxCount: 1,
        },
    ]),
    createDoctor
);

router.get("/doctors", getAllDoctors);
router.get("/doctors/:id", getDoctorById);
router.put("/doctors/:id", updateDoctor);
router.delete("/doctors/:id", deleteDoctor);

/* =========================
   LAB TECHNICIAN ROUTES
========================= */

router.post(
    "/lab-technicians/create",
    upload.fields([
        {
            name: "certificate",
            maxCount: 1,
        },
        {
            name: "idProof",
            maxCount: 1,
        },
    ]),
    createLabTechnician
);

router.get("/lab-technicians", getAllLabTechnicians);
router.get("/lab-technicians/:id", getSingleLabTechnician);
router.put("/lab-technicians/:id", updateLabTechnician);
router.delete("/lab-technicians/:id", deleteLabTechnician);

module.exports = router;