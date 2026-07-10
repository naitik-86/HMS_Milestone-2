const LabTechnician = require("../models/LabTechnician");
const cloudinary = require("../config/cloudinary");
const Visit = require("../models/visitModel");
const PetRegistration = require("../models/PetRegistration");
const DoctorConsultation = require("../models/DoctorConsultationModdel");
const LabReport = require("../models/LabReport");

const uploadToCloudinary = async (file, folder) => {
    const result = await cloudinary.uploader.upload(
        file.path,
        {
            folder,
        }
    );

    return {
        public_id: result.public_id,
        url: result.secure_url,
    };
};


exports.getAllPatientReports = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;

        // Get all reports
        const labReports = await LabReport.find({ clinicId })
            .sort({ createdAt: -1 });

        if (!labReports.length) {
            return res.status(200).json({
                success: true,
                totalReports: 0,
                todayReports: 0,
                completedReports: 0,
                criticalReports: 0,
                data: [],
            });
        }

        // Find owners containing these pets
        const owners = await PetRegistration.find({
            clinicId,
            "pets._id": {
                $in: labReports.map(report => report.petId),
            },
        });

        // petId -> owner + pet
        const petMap = {};

        owners.forEach(owner => {
            owner.pets.forEach(pet => {
                petMap[pet._id.toString()] = {
                    owner,
                    pet,
                };
            });
        });

        // Attach owner and pet
        const data = labReports.map(report => {
            const details = petMap[report.petId.toString()] || {};

            return {
                _id: report._id,
                clinicId: report.clinicId,
                petId: report.petId,
                visitId: report.visitId,
                consultationId: report.consultationId,
                reports: report.reports,
                status: report.status,
                remarks: report.remarks,
                createdAt: report.createdAt,
                updatedAt: report.updatedAt,

                owner: details.owner || null,
                pet: details.pet || null,
            };
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        res.status(200).json({
            success: true,
            totalReports: data.length,
            todayReports: data.filter(
                r => new Date(r.createdAt) >= today
            ).length,
            completedReports: data.filter(
                r => r.status === "Completed"
            ).length,
            criticalReports: data.filter(
                r => r.status === "Critical"
            ).length,
            data,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.uploadLabReports = async (req, res) => {
    try {
        const { petId, visitId } = req.body;

        const files = req.files;

        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        let reportsArray = [];

        // 🔥 Convert files into structured array
        Object.keys(files).forEach((testName) => {
            const file = files[testName][0];

            reportsArray.push({
                testName,
                fileUrl: file.path,
                fileName: file.originalname,
            });
        });

        // 🔥 Create Lab Report
        const labReport = await LabReport.create({
            clinicId: req.user.clinicId,
            petId,
            visitId,
            reports: reportsArray,
            status: "Completed",

        });


        await Visit.findByIdAndUpdate(visitId, {
            currentStage: "DOCTOR",

            status: "WAITING",

            "workflow.labCompleted": true,

            labTechnicianId: req.user._id
        });

        await DoctorConsultation.findOneAndUpdate(
            { visitId },
            {
                $push: { labReports: labReport._id }
            }
        );

        res.status(200).json({
            message: "Lab reports uploaded successfully",
            data: labReport,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed" });
    }
};

exports.getLabPendingPets = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;

        const visits = await Visit.find({
            clinicId,
            currentStage: "LAB",
            status: "WAITING",
        })
            .populate("doctorId") // contains labRequisition
            .sort({ createdAt: -1 });

        // get owners with pets
        const owners = await PetRegistration.find({
            "pets._id": {
                $in: visits.map(v => v.petId),
            },
        });

        // map petId → owner + pet
        const ownerPetMap = {};

        owners.forEach(owner => {
            owner.pets.forEach(pet => {
                ownerPetMap[pet._id.toString()] = {
                    owner,
                    pet,
                };
            });
        });

        // attach data
        const data = visits.map(visit => {
            const details = ownerPetMap[visit.petId.toString()];

            return {
                ...visit.toObject(),
                owner: details?.owner || null,
                pet: details?.pet || null,
                labRequisition: visit.doctorId?.labRequisition || null,
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

exports.updateLabResults = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;
        const { id } = req.params;

        const visit = await Visit.findOne({
            _id: id,
            clinicId,
        });

        if (!visit) {
            return res.status(404).json({
                success: false,
                message: "Visit not found",
            });
        }

        // get consultation
        const consultation = await DoctorConsultation.findOne({
            _id: visit.doctorId,
            clinicId,
        });

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message: "Consultation not found",
            });
        }

        // ==========================================
        // UPDATE LAB DATA
        // ==========================================

        consultation.labRequisition.results = req.body.results;
        consultation.labRequisition.remarks = req.body.remarks;
        consultation.labRequisition.status = "COMPLETED";

        await consultation.save();

        // ==========================================
        // MOVE WORKFLOW
        // ==========================================

        visit.currentStage = "DOCTOR"; // back to doctor
        visit.status = "WAITING";

        await visit.save();

        return res.status(200).json({
            success: true,
            message: "Lab results submitted successfully",
            data: consultation,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getRequiredLabTests = async (req, res) => {
    try {
        const { petId, visitId } = req.query;

        // 🔴 validation
        if (!petId || !visitId) {
            return res.status(400).json({
                success: false,
                message: "petId and visitId are required",
            });
        }

        // 🔍 find consultation
        const consultation = await DoctorConsultation.findOne({
            petId,
            visitId,
        });

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message: "No consultation found",
            });
        }

        // ❗ check if lab was even raised
        if (!consultation.diagnosis?.raiseLab) {
            return res.status(200).json({
                success: true,
                data: [],
                message: "No lab tests required",
            });
        }

        // 🧪 extract tests
        const tests = consultation.labRequisition?.tests || [];

        return res.status(200).json({
            success: true,
            data: tests,
            status: consultation.labRequisition?.status
        });

    } catch (error) {
        console.error("Error in getRequiredLabTests:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.getCompletedLabPets = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;

        const visits = await Visit.find({
            clinicId,
            currentStage: "DOCTOR",
            status: "WAITING",
        })
            .populate("doctorId")
            .sort({ updatedAt: -1 });

        const data = visits.filter(
            v => v.doctorId?.labRequisition?.status === "COMPLETED"
        );

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

exports.createLabTechnician = async (
    req,
    res
) => {
    try {
        let certificate = null;
        let idProof = null;

        if (
            req.files &&
            req.files.certificate
        ) {
            certificate =
                await uploadToCloudinary(
                    req.files.certificate[0],
                    "lab-technicians/certificates"
                );
        }

        if (
            req.files &&
            req.files.idProof
        ) {
            idProof =
                await uploadToCloudinary(
                    req.files.idProof[0],
                    "lab-technicians/id-proofs"
                );
        }
        const clinicId = req.user.clinicId;

        const technician =
            await LabTechnician.create({
                clinicId,
                employeeId:
                    req.body.employeeId,

                qualification:
                    req.body.qualification,

                diploma:
                    req.body.diploma,

                licenseNumber:
                    req.body.licenseNumber,

                experience:
                    req.body.experience,

                certificate,

                idProof,

                previousInstitution:
                    req.body.previousInstitution,

                dateOfJoining:
                    req.body.dateOfJoining,

                specializedTests:
                    JSON.parse(
                        req.body.specializedTests ||
                        "[]"
                    ),

                shift: req.body.shift,

                shiftStart:
                    req.body.shiftStart,

                shiftEnd:
                    req.body.shiftEnd,

                weeklyDays:
                    req.body.weeklyDays,

                onCall:
                    req.body.onCall,

                instruments:
                    req.body.instruments,

                lims: req.body.lims,

                status:
                    req.body.status,

                department:
                    req.body.department,

                supervisor:
                    req.body.supervisor,

                notes:
                    req.body.notes,
            });

        res.status(201).json({
            success: true,
            data: technician,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAllLabTechnicians =
    async (req, res) => {
        try {
            const clinicId = req.user.clinicId;

            const technicians = await LabTechnician.find({
                clinicId,
            }).sort({
                createdAt: -1,
            });

            res.status(200).json({
                success: true,
                count:
                    technicians.length,
                data: technicians,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };

exports.getSingleLabTechnician =
    async (req, res) => {
        try {
            const clinicId = req.user.clinicId;

            const technician =
                await LabTechnician.findOne({
                    _id: req.params.id,
                    clinicId,
                });

            if (!technician) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Lab Technician not found",
                });
            }

            res.status(200).json({
                success: true,
                data: technician,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    }

exports.updateLabTechnician =
    async (req, res) => {
        try {
            const clinicId = req.user.clinicId;

            const technician =
                await LabTechnician.findOneAndUpdate(
                    {
                        _id: req.params.id,
                        clinicId,
                    },
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            res.status(200).json({
                success: true,
                data: technician,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };
exports.deleteLabTechnician =
    async (req, res) => {
        try {
            const clinicId = req.user.clinicId;

            await LabTechnician.findOneAndDelete({
                _id: req.params.id,
                clinicId,
            });

            res.status(200).json({
                success: true,
                message:
                    "Lab Technician deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };

// ============================
// Lab workflow endpoints
// ============================
const Appointment = require('../models/Appointment');
const LabRecord = require('../models/LabRecord');

// GET /api/lab/queue-pending
// Lists appointments waiting for lab results.
exports.getLabPendingQueue = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;
        const pending = await Appointment.find({
            clinicId,
            status: 'LAB_PENDING'
        }).populate('petId ownerId doctorId');

        res.status(200).json({ success: true, count: pending.length, data: pending });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/lab/records/:appointmentId/results
// Saves lab results in LabRecord and moves appointment back to doctor.
exports.uploadLabResults = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const clinicId = req.user.clinicId;

        const appointment = await Appointment.findOne({ _id: appointmentId, clinicId });
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        if (appointment.status !== 'LAB_PENDING') {
            return res.status(400).json({ success: false, message: 'Appointment is not waiting for lab' });
        }

        const { testsCompleted, reportFiles, sampleCollectedAt, reportDate, externalLabName, criticalValuesFlag, criticalNotes, remarks, uploadedByRole } = req.body;

        const up = await LabRecord.findOneAndUpdate(
            { appointmentId, clinicId, },
            {
                results: {
                    testsCompleted: testsCompleted || [],
                    reportFiles: reportFiles || [],
                    sampleCollectedAt,
                    reportDate,
                    externalLabName,
                    criticalValuesFlag,
                    criticalNotes,
                    remarks,
                    uploadedByRole: uploadedByRole || 'LAB_TECH'
                }
            },
            { new: true, upsert: true, runValidators: true }
        );

        await Appointment.findByIdAndUpdate(appointmentId, { status: 'LAB_COMPLETED' });

        res.status(200).json({ success: true, labRecord: up });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
