const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(

{

    appointmentId: String,

    petId: String,
    petName: String,
    petSpecies: String,
    petBreed: String,
    petAge: Number,
    petGender: String,
    petWeight: Number,

    ownerId: String,
    ownerName: String,
    phone: String,
    email: String,
    address: String,

    doctorId: String,
    doctorName: String,

    clinicId: String,
    clinicName: String,

    // ===========================
    // History
    // ===========================
    history: {

        dietType: String,
        dietFrequency: String,
        waterIntake: String,
        behaviour: String,
        exercise: String,
        currentMedication: String,
        vaccinationStatus: String,
        allergies: String

    },

    // ===========================
    // Clinical Observation
    // ===========================
    clinicalObservation: {

        cardiovascular: String,
        respiratory: String,
        digestive: String,
        musculoskeletal: String,
        neurological: String,
        urogenital: String,
        skin: String,
        eyes: String,
        ears: String,
        nose: String,
        throat: String,
        lymphNodes: String,
        doctorNotes: String

    },

    // ===========================
    // Diagnosis
    // ===========================
    diagnosis: {

        provisionalDiagnosis: String,
        differentialDiagnosis: String,
        confirmedDiagnosis: String,

        raiseLab: {
            type: Boolean,
            default: false
        }

    },

    // ===========================
    // Lab Requisition
    // ===========================
    labRequisition: {

        labOrderId: String,

        tests: [String],

        sampleType: [String],

        instructions: String,

        status: {

            type: String,

            enum: [
                "PENDING",
                "IN_PROGRESS",
                "COMPLETED"
            ],

            default: "PENDING"

        }

    },

    // ===========================
    // Treatment
    // ===========================
    treatment: {

        medicines: String,

        procedures: String,

        vaccinations: String,

        deworming: String,

        fluids: String,

        followUp: String,

        treatmentNotes: String

    },

    // ===========================
    // Suggestions
    // ===========================
    suggestion: {

        dietAdvice: String,

        activityRestriction: String,

        homeCare: String,

        preventiveCare: String,

        prognosis: String,

        followUpDate: String,

        finalNotes: String

    },

    // ===========================
    // Prescription
    // ===========================
    prescription: {

        prescriptionNo: String,

        pdfUrl: String,

        generatedAt: Date

    },

    // ===========================
    // Status
    // ===========================
    status: {

        type: String,

        enum: [
            "PENDING",
            "IN_PROGRESS",
            "COMPLETED"
        ],

        default: "PENDING"

    }

},

{

    timestamps: true

}

);

module.exports = mongoose.model("DoctorModule", doctorSchema);