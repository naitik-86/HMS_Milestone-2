const mongoose = require("mongoose");

const preConsultationSchema = new mongoose.Schema(
  {

        // ======================================================
    // APPOINTMENT INFORMATION
    // ======================================================

    appointmentId: {
  type: String,
  required: true,
  trim: true,
},
    // ======================================================
    // PET INFORMATION
    // ======================================================

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PetRegistration",
      required: true,
    },
    uniquePetId: {
      type: String,
      required: true,
      trim: true,
    },

    tokenNumber: {
      type: String,
      required: true,
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
      required: true,
    },

    recordedBy: {
      type: String,
      required: true,
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
        required: true,
      },

      unit: {
        type: String,
        enum: ["Days", "Weeks", "Months", "Years"],
        required: true,
      },
    },

    onset: {
      type: String,
      enum: ["Sudden", "Gradual"],
      required: true,
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
      required: true,
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
      required: true,
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
      required: true,
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