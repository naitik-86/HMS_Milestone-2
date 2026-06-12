const Groomer = require("../models/GroomerModel");

exports.createGroomer = async (req, res) => {
    try {
        const {
            employeeId,
            experience,
            previousSalon,
            licenseNumber,
            dateOfJoining,
            certified,
            shift,
            shiftStart,
            shiftEnd,
            weeklyDays,
            onCall,
            tools,
            specialBreeds,
            status,
            department,
            supervisor,
            notes,
        } = req.body;

        const existingGroomer = await Groomer.findOne({
            employeeId,
        });

        if (existingGroomer) {
            return res.status(400).json({
                success: false,
                message: "Employee ID already exists",
            });
        }

        const profilePhoto =
            req.files?.profilePhoto?.[0]?.path || "";

        const certificateDocument =
            req.files?.certificateDocument?.[0]?.path || "";

        const groomer = await Groomer.create({
            employeeId,
            experience,
            previousSalon,
            licenseNumber,
            dateOfJoining,
            certified,
            shift,
            shiftStart,
            shiftEnd,
            weeklyDays,
            onCall,
            tools,
            specialBreeds,
            status,
            department,
            supervisor,
            notes,

            profilePhoto,
            certificateDocument,

            certificates: req.body.certificates
                ? JSON.parse(req.body.certificates)
                : [],

            species: req.body.species
                ? JSON.parse(req.body.species)
                : [],

            services: req.body.services
                ? JSON.parse(req.body.services)
                : [],
        });

        return res.status(201).json({
            success: true,
            message: "Groomer created successfully",
            data: groomer,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get All Groomers
 */
exports.getAllGroomers = async (req, res) => {
    try {
        const groomers = await Groomer.find()
            .populate("supervisor")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: groomers.length,
            data: groomers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get Groomer By Id
 */
exports.getGroomerById = async (req, res) => {
    try {
        const groomer = await Groomer.findById(req.params.id)
            .populate("supervisor");

        if (!groomer) {
            return res.status(404).json({
                success: false,
                message: "Groomer not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: groomer,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateGroomer = async (req, res) => {
    try {

        const groomer = await Groomer.findById(req.params.id);

        if (!groomer) {
            return res.status(404).json({
                success: false,
                message: "Groomer not found",
            });
        }

        const updateData = {
            ...req.body,
        };

        if (req.files?.profilePhoto?.[0]) {
            updateData.profilePhoto =
                req.files.profilePhoto[0].path;
        }

        if (req.files?.certificateDocument?.[0]) {
            updateData.certificateDocument =
                req.files.certificateDocument[0].path;
        }

        if (req.body.certificates) {
            updateData.certificates =
                JSON.parse(req.body.certificates);
        }

        if (req.body.species) {
            updateData.species =
                JSON.parse(req.body.species);
        }

        if (req.body.services) {
            updateData.services =
                JSON.parse(req.body.services);
        }

        const updatedGroomer =
            await Groomer.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );

        return res.status(200).json({
            success: true,
            message: "Groomer updated successfully",
            data: updatedGroomer,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteGroomer = async (req, res) => {
    try {

        const groomer = await Groomer.findById(req.params.id);

        if (!groomer) {
            return res.status(404).json({
                success: false,
                message: "Groomer not found",
            });
        }

        await Groomer.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Groomer deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};