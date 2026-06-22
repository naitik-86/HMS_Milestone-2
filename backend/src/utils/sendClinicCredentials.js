const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendClinicCredentials = async ({
    clinicName,
    email,
    password,
    planType,
    planPrice,
}) => {

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your HMS Clinic Account",

        html: `
            <h2>Welcome to HMS</h2>

            <p>Your clinic has been created successfully.</p>

            <p><strong>Clinic Name:</strong> ${clinicName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>

            <hr />

            <p><strong>Plan:</strong> ${planType}</p>
            <p><strong>Amount:</strong> ₹${planPrice}</p>

            <p>
                Please login and complete payment
                to activate your clinic account.
            </p>
        `,
    });
};

module.exports = sendClinicCredentials;