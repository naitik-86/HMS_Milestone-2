const Doctor = require("../models/DoctorDetails.js");

const generateDoctorId = require("../utils/generateDoctorId.js");

const createDoctor = async (req, res) => {
    try {

        const {
            experience,
            registrationNumber,
            stateVetCouncil,
            certificateValidityDate,
            renewalReminderDays,
            consultationFees,
            avgConsultationDuration,
            emergencyAvailability
        } = req.body;

        let degrees = [];
        let specializations = [];
        let prescriptionLanguages = [];

        if (req.body.degrees) {
            degrees = JSON.parse(req.body.degrees);
        }

        if (req.body.specializations) {
            specializations = JSON.parse(req.body.specializations);
        }

        if (req.body.prescriptionLanguages) {
            prescriptionLanguages = JSON.parse(
                req.body.prescriptionLanguages
            );
        }

        const existingDoctor = await Doctor.findOne({
            registrationNumber,
        });

        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message:
                    "Doctor with this registration number already exists",
            });
        }

        const doctorId = await generateDoctorId();

        const degreeFiles =
            req.files?.degreeCertificates || [];

        degrees = degrees.map((degree, index) => ({
            ...degree,
            degreeCertificate:
                degreeFiles[index]?.path || "",
        }));

        const doctor = await Doctor.create({
            doctorId,

            degrees,

            specializations,

            experience,

            registrationNumber,

            stateVetCouncil,

            registrationCertificate:
                req.files?.registrationCertificate?.[0]
                    ?.path || "",

            certificateValidityDate,

            renewalReminderDays,

            consultationFees,

            avgConsultationDuration,

            emergencyAvailability,

            digitalSignature:
                req.files?.digitalSignature?.[0]?.path ||
                "",

            doctorLetterhead:
                req.files?.doctorLetterhead?.[0]?.path ||
                "",

            prescriptionLanguages,
        });

        return res.status(201).json({
            success: true,
            message: "Doctor created successfully",
            doctor,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllDoctors = async (req, res) => {
    try {

        const doctors = await Doctor.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: doctors.length,
            doctors,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getDoctorById = async (req, res) => {
    try {

        const doctor = await Doctor.findById(
            req.params.id
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        return res.status(200).json({
            success: true,
            doctor,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const updateDoctor = async (req, res) => {
    try {

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Doctor updated successfully",
            doctor,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteDoctor = async (req, res) => {
    try {

        const doctor = await Doctor.findByIdAndDelete(
            req.params.id
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Doctor deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.createDoctor = createDoctor;
exports.getDoctorById = getDoctorById;
exports.getAllDoctors = getAllDoctors;
exports.updateDoctor = updateDoctor;
exports.deleteDoctor = deleteDoctor;
