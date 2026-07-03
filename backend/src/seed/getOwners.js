// getOwners.js

const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({
    path: path.resolve(__dirname, "../../.env"),
});

const Owner = require("../models/Owner");
const Preconsultation = require("../models/PreConsultation")
const PetRegistration = require("../models/PetRegistration")

const getOwners = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB.\n");

        const owners = await PetRegistration.find().select("_id name mobile email");

        if (owners.length === 0) {
            console.log("No owners found.");
            process.exit(0);
        }

        console.log("========== OWNERS ==========\n");

        owners.forEach((owner, index) => {
            console.log(`Owner ${index + 1}`);
            console.log(`ID     : ${owner._id}`);
            console.log(`Name   : ${owner.name}`);
            console.log(`Mobile : ${owner.mobile}`);
            console.log(`Email  : ${owner.email || "N/A"}`);
            console.log("----------------------------------");
        });

        const found = await PetRegistration.findOne({
            _id: "6a46a0b7e079bd5e161fcadc"
        })
        console.log("***************");

        console.log(found);


        process.exit(0);
    } catch (error) {
        console.error("Error fetching owners:", error);
        process.exit(1);
    }
};

getOwners();