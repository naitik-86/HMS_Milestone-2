const express = require('express');
const router = express.Router();
const { authorize } = require('../middlewares/auth');
const upload = require('../middlewares/uploadMiddleware');
const staffController = require('../controllers/staffController');

router.use(authorize('CLINIC_ADMIN'));

router.get("/managers", staffController.getManagers);


router.post(
    "/",
    upload.single("profilePhoto"),
    staffController.createStaff
);

router.get("/", staffController.getAllStaff);

router.get("/:id", staffController.getStaffById);

router.put("/:id", staffController.updateStaff);

router.delete("/:id", staffController.deleteStaff);

module.exports = router;