const express = require("express");

const {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
    getManagers,
} = require("../controllers/staffController.js");

const { upload } = require("../middlewares/uploadMiddleware.js");

const router = express.Router();

// Staff Management

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

module.exports = router;