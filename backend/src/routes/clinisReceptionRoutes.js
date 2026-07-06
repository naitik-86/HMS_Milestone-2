const express = require('express');
const router = express.Router();
const { authorize } = require('../middlewares/auth');
const upload = require('../middlewares/uploadMiddleware');
const petRegistrationController = require("../controllers/petRegistrationController");

router.use(authorize("RECEPTION", "CLINIC_ADMIN"));

router.post("/new-registration", upload.single("petPhoto"), petRegistrationController.createRegistration);
router.get("/new-registration/mobile/:mobileNumber", petRegistrationController.searchCustomer);
router.get("/new-registration/owner/:ownerId", petRegistrationController.getOwnerDetails);
router.post("/new-registration/owner/:ownerId/pets", petRegistrationController.addPet);
router.post("/new-registration/owner/:ownerId/pets/:petId/visit", petRegistrationController.addVisit);
router.get("/petHistory", petRegistrationController.getPetHistory);


//clinic reception routes for checking history
router.get("/existing-customers/stats", petRegistrationController.getDashboardStats);
router.get("/existing-customers", petRegistrationController.getExistingCustomers);
router.get("/existing-customers/:ownerId/pets/:petId", petRegistrationController.getPetDetails);

module.exports = router;