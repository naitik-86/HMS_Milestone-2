const express = require('express');
const router = express.Router();

const {
    createSubscriptionPayment
} = require("../controllers/subscriptionController")

router.post('/create-subscription', createSubscriptionPayment);

module.exports = router;
