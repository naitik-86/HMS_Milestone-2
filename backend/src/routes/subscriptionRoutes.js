const express = require("express");
const router = express.Router();

const { authorize } = require('../middlewares/auth');
const {

    getSubscriptionDetails,
} = require("../controllers/subscriptionPlanController");

// router.post(
//     "/create-subscription",
//     authorize(),
//     createSubscriptionPayment
// );

router.get(
    "/:clinicId",
    authorize(),
    getSubscriptionDetails
);

module.exports = router;