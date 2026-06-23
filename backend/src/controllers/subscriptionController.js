const crypto = require("crypto");
const Clinic = require("../models/Clinic");

exports.createSubscriptionPayment = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);


        console.log("clinic route hit **********");
        const clinic = await Clinic.findOne({ email });


        if (!clinic) {
            return res.status(404).json({
                success: false,
                message: "Clinic not found"
            });
        }
        console.log(clinic);


        const subscriptionType = clinic.subscriptionType || "6 Months";
        const amount = clinic.subscriptionPrice || 1000;

        const key = process.env.PAYU_KEY;
        const salt = process.env.PAYU_SALT;

        const txnid = `SUB_${Date.now()}`;
        const productinfo = `${subscriptionType} Subscription`;

        const surl = "http://localhost:5000/api/v1/payment/success";
        const furl = "http://localhost:5000/api/v1/payment/failure";

        const hashString =
            `${key}|${txnid}|${amount}|${productinfo}|${clinic.name}|${clinic.email}|||||||||||${salt}`;

        const hash = crypto
            .createHash("sha512")
            .update(hashString)
            .digest("hex");

        res.status(200).json({
            success: true,

            paymentData: {
                key,
                txnid,
                amount,
                productinfo,
                firstname: clinic.name,
                email: clinic.email,
                phone: clinic.phone,
                surl,
                furl,
                hash
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};