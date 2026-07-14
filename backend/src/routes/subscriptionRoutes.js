
const express = require("express");
const router = express.Router();

const { authorize } = require('../middlewares/auth');
const {

    getSubscriptionDetails,
} = require("../controllers/subscriptionPlanController");

router.use(authorize('CLINIC_ADMIN'));

// router.post(
//     "/create-subscription",
//     createSubscriptionPayment
// );

router.get(
    "/:clinicId",
    getSubscriptionDetails
);

module.exports = router;