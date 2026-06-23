const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const superAdminRoutes = require('./superAdminRoutes');
const clinicAdminRoutes = require('./clinicAdminRoutes');
const doctorRoutes = require('./doctorRoutes');
const receptionRoutes = require('./receptionRoutes');
const subscriptionRoutes = require('./subscriptionRoutes')
const { protect } = require('../middlewares/auth');



// Public routes
router.use('/auth', authRoutes);
// Protected role-based modules
router.use('/super-admin', protect, superAdminRoutes);
router.use('/clinic-admin', protect, clinicAdminRoutes);
router.use('/doctor', protect, doctorRoutes);
router.use('/reception', protect, receptionRoutes);
router.use('/subscription', subscriptionRoutes);

// the payment type (success, failure) is here for testing, and needs to be moved to its own file 
router.post("/payment/success", async (req, res) => {

    const data = {
        mihpayid: req.body.mihpayid,
        txnid: req.body.txnid,
        amount: req.body.amount,
        status: req.body.status,
        mode: req.body.mode,
        productinfo: req.body.productinfo,
        firstname: req.body.firstname,
        email: req.body.email,
        addedon: req.body.addedon,
        bank_ref_num: req.body.bank_ref_num,
        error_Message: req.body.error_Message
    };

    const query = new URLSearchParams(data).toString();

    res.redirect(
        `http://localhost:5173/payment-success?${query}`
    );
    console.log("PayU Success:", req.body);
});

router.post("/payment/failure", async (req, res) => {
    console.log("PayU Failure:", req.body);

    res.redirect("http://localhost:5173/payment-failure");
});
module.exports = router;