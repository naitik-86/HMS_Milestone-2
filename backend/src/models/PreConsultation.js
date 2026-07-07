const mongoose = require("mongoose");

const preConsultationSchema = new mongoose.Schema(
  {

    // ======================================================
    // APPOINTMENT INFORMATION
    // ======================================================

    // appointmentId: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },


    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true
    },
    // ======================================================
    // PET INFORMATION
    // ======================================================

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PetRegistration",

    },
    uniquePetId: {
      type: String,

      trim: true,
    },

    tokenNumber: {
      type: String,

      trim: true,
    },

    // ======================================================
    // STEP 1 : VITALS & INITIAL ASSESSMENT
    // ======================================================

    bodyTemperature: {
      type: Number,
      required: true,
    },

    heartRate: {
      type: Number,
      required: true,
    },

    respiratoryRate: {
      type: Number,
      required: true,
    },

    bloodPressure: {
      type: String,
      enum: ["Low", "Normal", "High"],
      required: true,
    },

    spo2: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    bodyWeight: {
      type: Number,
      required: true,
    },

    bcs: {
      type: Number,
      min: 1,
      max: 5,

    },

    recordedBy: {
      type: String,

      trim: true,
    },

    vitalsRecordedAt: {
      type: Date,
      default: Date.now,
    },

    // ======================================================
    // STEP 2 : BRIEF HISTORY OF PROBLEM
    // ======================================================

    durationOfIllness: {
      value: {
        type: Number,

      },

      unit: {
        type: String,
        enum: ["Days", "Weeks", "Months", "Years"],

      },
    },

    onset: {
      type: String,
      enum: ["Sudden", "Gradual"],

    },

    progression: {
      type: String,
      enum: ["Improving", "Worsening", "Stable"],
      required: true,
    },

    previousEpisodes: {
      hasPreviousEpisodes: {
        type: Boolean,
        default: false,
      },

      description: {
        type: String,
        trim: true,
        default: "",
      },
    },

    recentTravel: {
      type: Boolean,
      default: false,
    },

    animalContact: {
      type: Boolean,
      default: false,
    },

    // ======================================================
    // STEP 3 : PROBLEM DESCRIPTION
    // ======================================================

    primaryComplaint: {
      type: String,

      trim: true,
    },

    associatedSymptoms: [
      {
        type: String,
        enum: [
          "Vomiting",
          "Diarrhea",
          "Lethargy",
          "Coughing",
          "Sneezing",
          "Discharge",
          "Skin Lesion",
          "Lameness",
          "Other",
        ],
      },
    ],

    severity: {
      type: String,
      enum: ["Mild", "Moderate", "Severe"],

    },

    // ======================================================
    // STEP 4 : OBSERVATION
    // ======================================================

    generalDemeanour: {
      type: String,
      enum: [
        "Alert",
        "Depressed",
        "Anxious",
        "Unconscious",
      ],

    },

    gaitAndPosture: {
      type: String,
      trim: true,
      default: "",
    },

    visibleLesions: {
      type: String,
      trim: true,
      default: "",
    },

    eyesAbnormality: {
      type: String,
      trim: true,
      default: "",
    },

    noseAbnormality: {
      type: String,
      trim: true,
      default: "",
    },

    earAbnormality: {
      type: String,
      trim: true,
      default: "",
    },

    skinCondition: {
      type: String,
      trim: true,
      default: "",
    },

    staffNotes: {
      type: String,
      trim: true,
      default: "",
    },

    // ======================================================
    // WORKFLOW STATUS
    // ======================================================

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PreConsultation",
  preConsultationSchema
);