const express = require('express');
const router = express.Router();
const {
    protect,
    authorize
} = require("../middlewares/auth");
const upload = require('../middlewares/uploadMiddleware');
const staffController = require('../controllers/staffController');

router.get(
    "/",
    protect,
    authorize("CLINIC_ADMIN"),
    staffController.getAllStaff
);

router.get(
    "/doctor-list",
    authorize("CLINIC_ADMIN"),
    staffController.getDoctorStaff
);

router.post(
    "/",
    upload.single("profilePhoto"),
    staffController.createStaff
);

router.get("/", staffController.getAllStaff);

router.get("/managers", staffController.getManagers);
router.get("/:id", staffController.getStaffById);

router.put("/:id", staffController.updateStaff);

router.delete("/:id", staffController.deleteStaff);

module.exports = router;
