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
        // Delete ALL Clinics & Clinic Admins
        // -----------------------------
        // await Clinic.deleteMany({});
        // await ClinicAdmin.deleteMany({});

        console.log("✅ Existing Clinics and Clinic Admins deleted.");

        // -----------------------------
        // Create Clinic
        // -----------------------------
        const clinic = await Clinic.create({
            name: "Veterinary Clinic",
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

        // -----------------------------
        // Create Clinic Admin
        // -----------------------------
        const plainPassword = "Admin@123";

        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const clinicAdmin = await ClinicAdmin.create({
            clinicId: clinic._id,
            email: "admin@democlinic.com",
            password: hashedPassword,
        });

        console.log("✅ Clinic Admin Created");

        console.log("\n========================================");
        console.log("      DEMO CLINIC LOGIN DETAILS");
        console.log("========================================");
        console.log("Clinic Name :", clinic.name);
        console.log("Clinic ID   :", clinic._id);
        console.log("Email       :", clinicAdmin.email);
        console.log("Password    :", plainPassword);
        console.log("========================================");

        await mongoose.disconnect();
        console.log("✅ MongoDB Disconnected");

        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err);

        await mongoose.disconnect();
        process.exit(1);
    }
};

seed();


