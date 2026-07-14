// seedClinic.js


const path = require("path");

const mongoose = require("mongoose");

require("dotenv").config({
    path: path.resolve(__dirname, "../../.env"),
});
const bcrypt = require("bcryptjs");

const Clinic = require("../models/Clinic");
const ClinicAdmin = require("../models/ClinicAdmin");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        process.exit(1);
    }
};

const seedClinic = async () => {
    try {
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await ClinicAdmin.findOne({
            email: "ankitt16kr@gmail.com",
        });

        if (existingAdmin) {
            console.log("⚠️ Clinic Admin already exists.");
            process.exit(0);
        }

        // Create Clinic
        const clinic = await Clinic.create({
            name: "PetCare Veterinary Clinic",
            address: "Ranchi",
            contactEmail: "ankitt16kr@gmail.com",
            // contactPhone: "6299742423", // Add this field in schema if required

            subscriptionType: "6_MONTHS",
            subscriptionStatus: "EXPIRED",

            licenseLimits: {
                maxDoctors: 5,
                maxStaff: 10,
            },

            addressDetails: {
                addressLine1: "Main Road",
                addressLine2: "",
                city: "Ranchi",
                district: "Ranchi",
                state: "sgnw",
                pincode: "834001",
                serviceArea: "Ranchi",
            },

            servicesOffered: [
                "General Consultation",
                "Vaccination",
                "Surgery",
                "Grooming",
            ],

            legalDocuments: {
                clinicLogoUrl: "",
                vetCouncilCertificateUrl: "",
                tradeLicenseUrl: "",
                cancelledChequeUrl: "",
                adminProfileUrl: "",
            },

            verificationStatus: "APPROVED",
        });

        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        // Create Clinic Admin
        await ClinicAdmin.create({
            clinicId: clinic._id,
            email: "ankitt16kr@gmail.com",
            password: hashedPassword,
            role: "CLINIC_ADMIN",
            forcePasswordReset: false,
        });

        console.log("🎉 Clinic & Clinic Admin Seeded Successfully!");
        console.log("------------------------------------------");
        console.log("Clinic ID :", clinic._id);
        console.log("Email     : ankitt16kr@gmail.com");
        console.log("Password  : Admin@123");
        console.log("------------------------------------------");

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedClinic();