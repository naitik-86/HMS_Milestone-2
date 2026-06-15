const LabTechnician = require("../models/LabTechnician");
const cloudinary = require("../config/cloudinary");

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

        const technician =
            await LabTechnician.create({
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
            const technicians =
                await LabTechnician.find()
                    .sort({
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
            const technician =
                await LabTechnician.findById(
                    req.params.id
                );

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
    };

exports.updateLabTechnician =
    async (req, res) => {
        try {
            const technician =
                await LabTechnician.findByIdAndUpdate(
                    req.params.id,
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
            await LabTechnician.findByIdAndDelete(
                req.params.id
            );

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