const express = require('express');
const router = express.Router();
const { authorize } = require('../middlewares/auth');
const upload = require('../middlewares/uploadMiddleware');
const labController = require('../controllers/labTechnicianController');

router.use(authorize("LAB_TECHNICIAN", "CLINIC_ADMIN"));

router.post('/create', upload.fields([
    { name: "certificate", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
]), labController.createLabTechnician);

router.get('/', labController.getAllLabTechnicians);
router.get("/:id", labController.getSingleLabTechnician)
router.put("/:id", labController.updateLabTechnician);
router.delete("/:id", labController.deleteLabTechnician);

module.exports = router;