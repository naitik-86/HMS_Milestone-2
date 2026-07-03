const Doctor = require("../models/DoctorModuleModel");

// ======================================================
// Dashboard
// ======================================================
exports.getDashboard = async (req, res) => {
    try {

        const totalPets = await Doctor.countDocuments();

        const pendingPets = await Doctor.countDocuments({
            status: "PENDING"
        });

        const completedPets = await Doctor.countDocuments({
            status: "COMPLETED"
        });

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const todaysVisits = await Doctor.countDocuments({
            createdAt: {
                $gte: today
            }
        });

        const recentActivity = await Doctor.find()
            .sort({
                updatedAt: -1
            })
            .limit(5);

        return res.status(200).json({
            success: true,
            dashboard: {
                totalPets,
                pendingPets,
                completedPets,
                todaysVisits,
                recentActivity
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ======================================================
// Pending Pets
// ======================================================
exports.getPendingPets = async (req, res) => {

    try {

        const pendingPets = await Doctor.find({
            status: "PENDING"
        })
        .sort({
            createdAt: -1
        });

        return res.status(200).json({

            success: true,

            total: pendingPets.length,

            data: pendingPets

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// Completed Pets
// ======================================================
exports.getCompletedPets = async (req, res) => {

    try {

        const completedPets = await Doctor.find({
            status: "COMPLETED"
        })
        .sort({
            updatedAt: -1
        });

        return res.status(200).json({

            success: true,

            total: completedPets.length,

            data: completedPets

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// History
// ======================================================
exports.getHistory = async (req, res) => {

    try {

        const history = await Doctor.find().sort({
            updatedAt: -1
        });

        const vaccinations = history.filter(
            item =>
                item.treatment?.vaccinations &&
                item.treatment.vaccinations.trim() !== ""
        ).length;

        const treatments = history.filter(
            item =>
                item.treatment?.medicines &&
                item.treatment.medicines.trim() !== ""
        ).length;

        return res.status(200).json({

            success: true,

            total: history.length,

            vaccinations,

            treatments,

            data: history

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Single Patient
// ======================================================
exports.getPatient = async (req, res) => {

    try {

        const { id } = req.params;

        const patient = await Doctor.findById(id);

        if (!patient) {

            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });

        }

        return res.status(200).json({

            success: true,

            message: "Patient fetched successfully",

            data: patient

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Update Patient (Part-1)
// ======================================================
exports.updatePatient = async (req, res) => {

    try {

        const patient = await Doctor.findById(req.params.id);

        if (!patient) {

            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });

        }

        // ===========================================
        // History
        // ===========================================

        patient.history.dietType =
            req.body.history?.dietType || patient.history.dietType;

        patient.history.dietFrequency =
            req.body.history?.dietFrequency || patient.history.dietFrequency;

        patient.history.waterIntake =
            req.body.history?.waterIntake || patient.history.waterIntake;

        patient.history.behaviour =
            req.body.history?.behaviour || patient.history.behaviour;

        patient.history.exercise =
            req.body.history?.exercise || patient.history.exercise;

        patient.history.currentMedication =
            req.body.history?.currentMedication || patient.history.currentMedication;

        patient.history.vaccinationStatus =
            req.body.history?.vaccinationStatus || patient.history.vaccinationStatus;

        patient.history.allergies =
            req.body.history?.allergies || patient.history.allergies;


        // ===========================================
        // Clinical Observation
        // ===========================================

        patient.clinicalObservation.cardiovascular =
            req.body.clinicalObservation?.cardiovascular || patient.clinicalObservation.cardiovascular;

        patient.clinicalObservation.respiratory =
            req.body.clinicalObservation?.respiratory || patient.clinicalObservation.respiratory;

        patient.clinicalObservation.digestive =
            req.body.clinicalObservation?.digestive || patient.clinicalObservation.digestive;

        patient.clinicalObservation.musculoskeletal =
            req.body.clinicalObservation?.musculoskeletal || patient.clinicalObservation.musculoskeletal;

        patient.clinicalObservation.neurological =
            req.body.clinicalObservation?.neurological || patient.clinicalObservation.neurological;

        patient.clinicalObservation.urogenital =
            req.body.clinicalObservation?.urogenital || patient.clinicalObservation.urogenital;

        patient.clinicalObservation.skin =
            req.body.clinicalObservation?.skin || patient.clinicalObservation.skin;

        patient.clinicalObservation.eyes =
            req.body.clinicalObservation?.eyes || patient.clinicalObservation.eyes;

        patient.clinicalObservation.ears =
            req.body.clinicalObservation?.ears || patient.clinicalObservation.ears;

        patient.clinicalObservation.nose =
            req.body.clinicalObservation?.nose || patient.clinicalObservation.nose;

        patient.clinicalObservation.throat =
            req.body.clinicalObservation?.throat || patient.clinicalObservation.throat;

        patient.clinicalObservation.lymphNodes =
            req.body.clinicalObservation?.lymphNodes || patient.clinicalObservation.lymphNodes;

        patient.clinicalObservation.doctorNotes =
            req.body.clinicalObservation?.doctorNotes || patient.clinicalObservation.doctorNotes;
                   // ===========================================
        // Diagnosis
        // ===========================================

        patient.diagnosis.provisionalDiagnosis =
            req.body.diagnosis?.provisionalDiagnosis ||
            patient.diagnosis.provisionalDiagnosis;

        patient.diagnosis.differentialDiagnosis =
            req.body.diagnosis?.differentialDiagnosis ||
            patient.diagnosis.differentialDiagnosis;

        patient.diagnosis.confirmedDiagnosis =
            req.body.diagnosis?.confirmedDiagnosis ||
            patient.diagnosis.confirmedDiagnosis;

        patient.diagnosis.icdCode =
            req.body.diagnosis?.icdCode ||
            patient.diagnosis.icdCode;

        patient.diagnosis.venomCode =
            req.body.diagnosis?.venomCode ||
            patient.diagnosis.venomCode;

        patient.diagnosis.raiseLab =
            req.body.diagnosis?.raiseLab ??
            patient.diagnosis.raiseLab;


        // ===========================================
        // Lab Requisition
        // ===========================================

        patient.labRequisition.labOrderId =
            req.body.labRequisition?.labOrderId ||
            patient.labRequisition.labOrderId;

        patient.labRequisition.tests =
            req.body.labRequisition?.tests ||
            patient.labRequisition.tests;

        patient.labRequisition.sampleType =
            req.body.labRequisition?.sampleType ||
            patient.labRequisition.sampleType;

        patient.labRequisition.instructions =
            req.body.labRequisition?.instructions ||
            patient.labRequisition.instructions;

        patient.labRequisition.status =
            req.body.labRequisition?.status ||
            patient.labRequisition.status; 
                    // ===========================================
        // Treatment
        // ===========================================

        patient.treatment.medicines =
            req.body.treatment?.medicines ||
            patient.treatment.medicines;

        patient.treatment.procedures =
            req.body.treatment?.procedures ||
            patient.treatment.procedures;

        patient.treatment.vaccinations =
            req.body.treatment?.vaccinations ||
            patient.treatment.vaccinations;

        patient.treatment.deworming =
            req.body.treatment?.deworming ||
            patient.treatment.deworming;

        patient.treatment.fluids =
            req.body.treatment?.fluids ||
            patient.treatment.fluids;

        patient.treatment.followUp =
        req.body.treatment?.followUp ||
        patient.treatment.followUp;

        patient.treatment.treatmentNotes =
    req.body.treatment?.treatmentNotes ||
    patient.treatment.treatmentNotes;
        // ===========================================
        // Suggestion & Plans
        // ===========================================

        patient.suggestion.dietAdvice =
            req.body.suggestion?.dietAdvice ||
            patient.suggestion.dietAdvice;

        patient.suggestion.activityRestriction =
            req.body.suggestion?.activityRestriction ||
            patient.suggestion.activityRestriction;

        patient.suggestion.homeCare =
            req.body.suggestion?.homeCare ||
            patient.suggestion.homeCare;

        patient.suggestion.preventiveCare =
            req.body.suggestion?.preventiveCare ||
            patient.suggestion.preventiveCare;

        patient.suggestion.prognosis =
            req.body.suggestion?.prognosis ||
            patient.suggestion.prognosis;

        patient.suggestion.followUpDate =
            req.body.suggestion?.followUpDate ||
            patient.suggestion.followUpDate;

  

        patient.suggestion.finalNotes =
    req.body.suggestion?.finalNotes ||
    patient.suggestion.finalNotes;
        // ===========================================
        // Status
        // ===========================================

        patient.status =
            req.body.status || "COMPLETED";


        // ===========================================
        // Save
        // ===========================================

        await patient.save();

        return res.status(200).json({

            success: true,

            message: "Doctor Consultation Saved Successfully",

            data: patient

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



//  Delete after refrence will create
exports.createPatient = async (req, res) => {
    try {
        const patient = await Doctor.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Patient Created Successfully",
            data: patient
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};