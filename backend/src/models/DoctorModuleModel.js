const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
{
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
    
    
        ref: "Appointment"
    },

    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet"
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner"
    },

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorDetails"
    },

    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic"
    },

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

    diagnosis: {
        provisionalDiagnosis: String,
        differentialDiagnosis: String,
        confirmedDiagnosis: String,
        icdCode: String,
        venomCode: String,
        raiseLab: {
            type: Boolean,
            default: false
        }
    },

    labRequisition: {
        labOrderId: String,
        tests: [String],
        sampleType: String,
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

    treatment: {
        medicines: [
            {
                medicineName: String,
                dosage: String,
                frequency: String,
                duration: String
            }
        ],

        procedures: [String],

        vaccinations: [String],

        deworming: [String],

        fluids: [String]
    },

    suggestion: {
        dietAdvice: String,
        activityRestriction: String,
        homeCare: String,
        preventiveCare: String,
        prognosis: String,
        followUpDate: Date,
        nextVaccination: Date
    },

    prescription: {
        prescriptionNo: String,
        pdfUrl: String,
        generatedAt: Date
    },

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
});

module.exports = mongoose.model("Doctor", doctorSchema);