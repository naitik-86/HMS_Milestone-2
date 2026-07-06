const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema({
    vaccineName: String,
    vaccinationDate: Date,
    batchNumber: String,
    clinicName: String
});

const dewormingSchema = new mongoose.Schema({
    product: String,
    dewormingDate: Date,
    dose: String
});

const surgerySchema = new mongoose.Schema({
    procedure: String,
    surgeryDate: Date,
    hospital: String
});

const treatmentSchema = new mongoose.Schema({
    condition: String,
    treatment: String,
    treatmentDate: Date
});

const visitSchema = new mongoose.Schema({
    primaryReason: {
        type: String,
        enum: ["Treatment", "Vaccination", "Checkup", "Certificate"]
    },

    assignedDoctor: String,
    complaint: String,
    tokenNumber: String,
    appointmentDate: Date,
    appointmentTime: String,
    status: {
        type: String,
        default: "Pending"
    }
});


const petSchema = new mongoose.Schema({
    petName: {
        type: String,
    },
    species: String,
    breed: String,
    gender: String,
    dob: Date,
    age: Number,
    color: String,
    rfid: String,
    identificationArea: String,
    petPhoto: String,

    sterilized: {
        type: Boolean,
        default: false
    },

    uniquePetId: {
        type: String,
        required: true
    },

    history: {
        vaccinations: [vaccinationSchema],
        dewormings: [dewormingSchema],
        surgeries: [surgerySchema],
        treatments: [treatmentSchema],
        allergies: String,
        currentMedications: String
    },

    visits: [visitSchema]
});

const ownerSchema = new mongoose.Schema(
    {
        mobileNumber: {
            type: String,
            required: true,
            unique: true,
            match: /^[6-9]\d{9}$/
        },
        isMobileVerified: {
            type: Boolean,
            default: false
        },

        ownerName: {
            type: String,
            required: true
        },

        visitType: {
            type: String,
            enum: ["New", "Follow-up"]
        },

        ownerIdType: String,
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        address: String,
        state: String,
        city: String,
        district: String,
        pincode: String,

        pets: [petSchema]
    },
    {
        timestamps: true
    });

module.exports = mongoose.model(
    "PetRegistration",
    ownerSchema
);