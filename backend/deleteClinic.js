import mongoose from "mongoose";
import dotenv from "dotenv";
import Clinic from "./src/models/Clinic.js"; // adjust path if needed

// Load env file
dotenv.config();

// Emails to delete
const emailsToDelete = [
    "ankitt16kr@gmail.com",
    "a95105147@gmail.com",
    "ak16012006@gmail.com"
];

const deleteClinics = async () => {
    try {
        // Connect MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // Delete all clinics whose email is in array
        const result = await Clinic.deleteMany({
            email: { $in: emailsToDelete },
        });

        console.log(`${result.deletedCount} clinics deleted`);

        process.exit(0);
    } catch (error) {
        console.error("Error deleting clinics:", error.message);
        process.exit(1);
    }
};

deleteClinics();