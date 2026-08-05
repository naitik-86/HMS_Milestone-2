const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(

    {

        petId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PetRegistration",
            required: true
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PetRegistration",
            required: true
        },

        // doctorId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Doctor"
        // },

        // clinicId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Clinic"
        // },

        visitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Visit",
            required: true
        },


        petName: String,
        petSpecies: String,
        petBreed: String,
        petAge: Number,
        petGender: String,
        petWeight: Number,


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
            allergies: String,

            // The "Current Medications Confirmed" multi-row UI
            // (PendingPets.jsx) reads/writes this as an array of
            // {drug, dose, frequency, since} - it was never declared here,
            // so Mongoose's default strict mode silently dropped it on
            // every save. Mixed (not a fixed sub-schema) so field-name
            // additions on the frontend don't need a matching model change.
            medicationsConfirmed: [mongoose.Schema.Types.Mixed]

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

            reportUrl: String,

            reportRemarks: String,

            reportUploadedAt: Date,

            status: {
                type: String,
                enum: [
                    "PENDING",
                    "REPORT_READY",
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

            treatmentNotes: String,

            // Same gap as history.medicationsConfirmed above - the
            // multi-row treatment UIs (PendingPets.jsx) read/write these
            // as arrays, but none were declared here, so every one of
            // them was silently dropped by Mongoose on save.
            medicationsList: [mongoose.Schema.Types.Mixed],
            proceduresList: [mongoose.Schema.Types.Mixed],
            vaccinationsList: [mongoose.Schema.Types.Mixed],
            dewormingList: [mongoose.Schema.Types.Mixed],
            fluidsList: [mongoose.Schema.Types.Mixed]

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

        labReports: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "LabReport",
            }
        ],

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
                "LAB_PENDING",
                "REPORT_READY",
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