const DoctorConsultation = require("../models/DoctorConsultationModdel");
const Visit = require("../models/visitModel");
const LabReport = require("../models/LabReport")
const PreConsultation = require("../models/PreConsultation")
const PetRegistration = require("../models/PetRegistration")

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
        const clinicId = req.user.clinicId;

        const visits = await Visit.find({
            clinicId,
            currentStage: "DOCTOR",
            status: "WAITING",
        })
            .populate("preConsultationId")
            .sort({ createdAt: -1 });

        // Fetch all owners containing these pets
        const owners = await PetRegistration.find({
            "pets._id": {
                $in: visits.map((visit) => visit.petId),
            },
        });

        // Create a lookup map: petId -> { owner, pet }
        const ownerPetMap = {};

        owners.forEach((owner) => {
            owner.pets.forEach((pet) => {
                ownerPetMap[pet._id.toString()] = {
                    owner,
                    pet,
                };
            });
        });

        // Attach owner & pet to each visit
        const data = visits.map((visit) => {
            const details = ownerPetMap[visit.petId.toString()];

            return {
                ...visit.toObject(),
                owner: details?.owner || null,
                pet: details?.pet || null,
            };
        });

        return res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// Completed Pets
// ======================================================
exports.getCompletedPets = async (req, res) => {

    try {
        const clinicId = req.user.clinicId;

        const visits = await Visit.find({
            clinicId,
            "workflow.doctorCompleted": true
        })
            .populate("ownerId petId doctorId")
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            count: visits.length,
            data: visits
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

        const clinicId = req.user.clinicId;
        const { id } = req.params;

        // ==========================================
        // Find Visit
        // ==========================================

        const visit = await Visit.findOne({
            _id: id,
            clinicId
        });

        if (!visit) {
            return res.status(404).json({
                success: false,
                message: "Visit not found"
            });
        }

        const raiseLab = req.body.diagnosis?.raiseLab === true;

        // ==========================================
        // Create / Update Doctor Consultation
        // ==========================================

        let consultation;

        const consultationData = {
            ...req.body,

            clinicId,
            visitId: visit._id,
            petId: visit.petId,
            ownerId: visit.ownerId,

            status: raiseLab
                ? "LAB_PENDING"
                : "COMPLETED"
        };

        if (!visit.doctorId) {

            consultation = await DoctorConsultation.create(consultationData);

            visit.doctorId = consultation._id;

        } else {

            consultation = await DoctorConsultation.findOneAndUpdate(
                {
                    _id: visit.doctorId,
                    clinicId
                },
                consultationData,
                {
                    new: true,
                    runValidators: true
                }
            );

        }

        // ==========================================
        // Update Lab Status
        // ==========================================

        if (raiseLab) {

            consultation.labRequisition.status = "PENDING";

        } else {

            consultation.labRequisition.status = "COMPLETED";

        }

        await consultation.save();

        // ==========================================
        // Update Visit Workflow
        // ==========================================

        visit.workflow.doctorCompleted = true;

        if (raiseLab) {

            visit.currentStage = "LAB";
            visit.status = "WAITING";

        } else {

            visit.currentStage = "COMPLETED";
            visit.status = "COMPLETED";

        }

        await visit.save();

        return res.status(200).json({
            success: true,
            message: raiseLab
                ? "Patient referred to Lab successfully."
                : "Doctor consultation completed successfully.",
            data: consultation
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getLabReportByVisit = async (req, res) => {
    try {

        const { id } = req.params;
        const clinicId = req.user.clinicId;

        const labReport = await LabReport.findOne({
            visitId: id,
            clinicId,
        }).populate({
            path: "petId",
            select: "name species breed ownerId",
            populate: {
                path: "ownerId",
                select: "ownerName"
            }
        })
            .populate({
                path: "visitId",
                select: "tokenNumber"
            });
        if (!labReport) {
            return res.status(404).json({
                success: false,
                message: "Lab report not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lab report fetched successfully.",
            data: labReport,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.getPreConsultationByVisit = async (req, res) => {
    try {

        const { id } = req.params;
        const clinicId = req.user.clinicId;

        const preConsultation = await PreConsultation.findOne({
            visitId: id,
            clinicId,
        }).populate({
            path: "petId",
            select: "name species breed"
        })
            .populate({
                path: "visitId",
                select: "tokenNumber"
            })
            .populate({
                path: "ownerId",
                select: "ownerName"
            });

        if (!preConsultation) {
            return res.status(404).json({
                success: false,
                message: "Pre-consultation report not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Pre-consultation report fetched successfully.",
            data: preConsultation,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.getLabPets = async (req, res) => {
    try {

        const labPets = await Doctor.find({
            status: "LAB_PENDING"
        }).sort({
            updatedAt: -1
        });

        return res.status(200).json({
            success: true,
            total: labPets.length,
            data: labPets
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
