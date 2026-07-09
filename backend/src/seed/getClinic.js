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

        // Delete existing data
        await ClinicAdmin.deleteMany({});
        console.log("🗑️ Deleted all ClinicAdmins");

        await Clinic.deleteMany({});
        console.log("🗑️ Deleted all Clinics");

        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        // =========================================
        // Clinic 1
        // =========================================
        const clinic1Id = new mongoose.Types.ObjectId(
            "6a4d02d322b758362ceda689"
        );

        await Clinic.create({
            _id: clinic1Id,
            name: "Demo Veterinary Clinic",
            address: "Ranchi, Jharkhand",
            subscriptionType: "FREE_TIER",
            subscriptionStatus: "ACTIVE",
        });

        await ClinicAdmin.create({
            clinicId: clinic1Id,
            email: "admin@clinic.com",
            password: hashedPassword,
        });

        // =========================================
        // Clinic 2
        // =========================================
        const clinic2Id = new mongoose.Types.ObjectId(
            "6a4be6cab60aa979643c0994"
        );

        await Clinic.create({
            _id: clinic2Id,
            name: "Demo Clinic",
            address: "Ranchi, Jharkhand",
            subscriptionType: "FREE_TIER",
            subscriptionStatus: "ACTIVE",
        });

        await ClinicAdmin.create({
            clinicId: clinic2Id,
            email: "admin@democlinic.com",
            password: hashedPassword,
        });

        console.log("\n========================================");
        console.log("Clinic Name : Demo Veterinary Clinic");
        console.log("Clinic ID   :", clinic1Id);
        console.log("Email       : admin@clinic.com");
        console.log("Password    : Admin@123");
        console.log("========================================");

        console.log("\n========================================");
        console.log("Clinic Name : Demo Clinic");
        console.log("Clinic ID   :", clinic2Id);
        console.log("Email       : admin@democlinic.com");
        console.log("Password    : Admin@123");
        console.log("========================================");

        await mongoose.disconnect();
        console.log("\n✅ Database seeded successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seed();