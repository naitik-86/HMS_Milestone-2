// seedOwners.js
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({
    path: path.resolve(__dirname, "../../.env"),
});

const Owner = require("../models/Owner");

const seedOwners = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB.");

        const owners = [
            {
                name: "Rishi Kumar",
                mobile: "9876543210",
                alternateMobile: "9123456780",
                email: "rishi@example.com",
                govtId: "A123456789",
                address: "Patna, Bihar",
                location: {
                    type: "Point",
                    coordinates: [85.1376, 25.5941],
                },
            },
            {
                name: "Aman Singh",
                mobile: "9876543211",
                alternateMobile: "9123456781",
                email: "aman@example.com",
                govtId: "B987654321",
                address: "Ranchi, Jharkhand",
                location: {
                    type: "Point",
                    coordinates: [85.3096, 23.3441],
                },
            },
            {
                name: "Priya Sharma",
                mobile: "9876543212",
                alternateMobile: "9123456782",
                email: "priya@example.com",
                govtId: "C456789123",
                address: "Delhi",
                location: {
                    type: "Point",
                    coordinates: [77.1025, 28.7041],
                },
            },
        ];

        // Uncomment if you want a fresh start every time
        // await Owner.deleteMany({});

        await Owner.insertMany(owners);

        console.log(`${owners.length} owners created successfully.`);
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

seedOwners();