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

        // Fixed Clinic ID
        // const clinicId = new mongoose.Types.ObjectId(
        //     "6a563353f8b2d9067b35bd28"
        // );

        // // Optional: Delete existing records
        // await ClinicAdmin.deleteMany({
        //     $or: [
        //         { email: "ankitt16kr@gmail.com" },
        //         { clinicId: clinicId },
        //     ],
        // });

        // await Clinic.findByIdAndDelete(clinicId);

        // Create Clinic
        const clinic = await Clinic.create({


            name: "Veterinary Clinic",
            address: "wefrefefs",
            contactEmail: "ankitkumar10728@gmail.com",

            subscriptionType: "6_MONTHS",

            licenseLimits: {
                maxDoctors: 5,
                maxStaff: 10,
            },

            addressDetails: {
                addressLine1: "Main Road",
                addressLine2: "",
                city: "Ranchi",
                district: "Ranchi",
                state: "Jharkhand",
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

        // Hash Password
        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        // Create Clinic Admin
        await ClinicAdmin.create({
            clinicId: clinic._id,
            email: "ankitkumar10728@gmail.com",
            password: hashedPassword,
            role: "CLINIC_ADMIN",
            forcePasswordReset: false,
        });

        console.log("\n🎉 Clinic & Clinic Admin Seeded Successfully!");
        console.log("------------------------------------------");
        console.log("Clinic ID :", clinic._id);
        console.log("Email     : ankitt16kr@gmail.com");
        console.log("Password  : Admin@123");
        console.log("------------------------------------------");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

seedClinic();