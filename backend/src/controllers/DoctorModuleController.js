const Doctor = require("../models/DoctorModuleModel");

// ==========================
// Dashboard
// ==========================
exports.getDashboard = async (req, res) => {
    try {

        const totalPets = await Doctor.countDocuments();

        const pendingPets = await Doctor.countDocuments({
            status: "PENDING"
        });

        const completedCases = await Doctor.countDocuments({
            status: "COMPLETED"
        });

        const todaysVisits = await Doctor.countDocuments({
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lte: new Date(new Date().setHours(23, 59, 59, 999))
            }
        });

        const recentActivity = await Doctor.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select(
                "petId ownerId doctorId status createdAt"
            );

        return res.status(200).json({
            success: true,
            message: "Doctor Dashboard Loaded Successfully",
            data: {
                totalPets,
                pendingPets,
                completedCases,
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

// ==========================
// Pending Pets
// ==========================
exports.getPendingPets = async (req, res) => {

    try {

        const pets = await Doctor.find({
            status: "PENDING"
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            data: pets
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Completed Pets
// ==========================
exports.getCompletedPets = async (req, res) => {

    try {

        const pets = await Doctor.find({
            status: "COMPLETED"
        }).sort({
            updatedAt: -1
        });

        return res.status(200).json({
            success: true,
            data: pets
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// History
// ==========================
exports.getHistory = async (req, res) => {

    try {

        const history = await Doctor.find()
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            data: history
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Get Single Patient
// ==========================
exports.getPatient = async (req, res) => {

    try {

        const patient = await Doctor.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: patient
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Create Consultation
// ==========================
exports.createConsultation = async (req, res) => {

    try {

        const consultation = await Doctor.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Consultation Created Successfully",
            data: consultation
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Update Consultation
// ==========================
exports.updateConsultation = async (req, res) => {

    try {

        const consultation = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message: "Consultation not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Updated Successfully",
            data: consultation
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================
// Delete Consultation
// ==========================
exports.deleteConsultation = async (req, res) => {

    try {

        const consultation = await Doctor.findByIdAndDelete(req.params.id);

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message: "Consultation not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Deleted Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};