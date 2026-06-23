import mongoose from "mongoose";
import dotenv from "dotenv";
import Clinic from "./src/models/Clinic.js"; // adjust path if needed

dotenv.config();

const emailsToDelete = [
    "ankitt16kr@gmail.com",
    "a95105147@gmail.com",
    "ak16012006@gmail.com"
];

const temp = "ankitt16kr@gmail.com";

const deleteClinics = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");
        // const result = await Clinic.findOne({
        //     temp
        // });
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