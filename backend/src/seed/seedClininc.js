const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

require("dotenv").config({
    path: path.resolve(__dirname, "../../.env"),
});

const Clinic = require("../models/Clinic");
const ClinicAdmin = require("../models/ClinicAdmin");

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");

        // -----------------------------
        // Delete existing records
        // -----------------------------

        await Clinic.deleteMany({
            name: "Demo Veterinary Clinic",
        });

        await ClinicAdmin.deleteMany({
            email: "admin@democlinic.com",
        });

        // -----------------------------
        // Create Clinic
        // -----------------------------
        const clinic = await Clinic.create({
            name: "Demo Veterinary Clinic",
            address: "Patna, Bihar",
            subscriptionType: "12_MONTHS",
            subscriptionStatus: "ACTIVE",
            expiryDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
            ),
            licenseLimits: {
                maxDoctors: 20,
                maxStaff: 50,
            },
            verificationStatus: "APPROVED",
        });

        console.log("✅ Clinic Created");
        console.log(clinic._id);

        // -----------------------------
        // Create Clinic Admin
        // -----------------------------
        const password = "Admin@123";

        const hashedPassword = await bcrypt.hash(password, 10);

        const clinicAdmin = await ClinicAdmin.create({
            clinicId: clinic._id,
            email: "admin@democlinic.com",
            password: hashedPassword,
        });

        console.log("✅ Clinic Admin Created");

        console.log("\n==============================");
        console.log("Login Credentials");
        console.log("==============================");
        console.log("Email    :", clinicAdmin.email);
        console.log("Password :", password);
        console.log("ClinicId :", clinic._id);
        console.log("==============================");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();