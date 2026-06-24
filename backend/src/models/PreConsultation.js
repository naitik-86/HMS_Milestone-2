const mongoose = require("mongoose");

const preConsultationSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PetRegistration",
      required: true,
    },

    uniquePetId: {
      type: String,
      required: true,
    },

    tokenNumber: {
      type: String,
      required: true,
    },

    bodyTemperature: Number,
    heartRate: Number,
    respiratoryRate: Number,
    bloodPressure: String,
    spo2: Number,
    bodyWeight: Number,
    bcs: String,
    recordedBy: String,

    durationOfIllness: String,
    onset: String,
    progression: String,
    recentTravel: Boolean,
    animalContact: Boolean,
    previousEpisodes: String,

    primaryComplaint: String,
    associatedSymptoms: String,
    severity: String,

    generalDemeanour: String,
    gaitAndPosture: String,
    visibleLesions: String,
    eyesAbnormality: String,
    noseAbnormality: String,
    earAbnormality: String,
    skinCondition: String,
    staffNotes: String,

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PreConsultation",
  preConsultationSchema
);