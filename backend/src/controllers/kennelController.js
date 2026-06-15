const Kennel = require("../models/KennelModel");
exports.createKennel = async (req, res) => {
    try {
        const {
            staffId,
            experience,
            shift,
            firstAidCertified,
            canAdministerMedication,
            speciesComfortableWith,
        } = req.body;

        const existingKennel = await Kennel.findOne({ staffId });

        if (existingKennel) {
            return res.status(400).json({
                success: false,
                message: "Kennel details already exist for this staff member",
            });
        }

        let firstAidCertificate = {};

        if (
            req.files &&
            req.files.firstAidCertificate &&
            req.files.firstAidCertificate.length > 0
        ) {
            firstAidCertificate = {
                secure_url:
                    req.files.firstAidCertificate[0].path ||
                    req.files.firstAidCertificate[0].secure_url,
                public_id:
                    req.files.firstAidCertificate[0].filename ||
                    req.files.firstAidCertificate[0].public_id,
            };
        }

        const kennel = await Kennel.create({
            staffId,
            experience,
            shift,
            firstAidCertified,
            canAdministerMedication,
            speciesComfortableWith,
            firstAidCertificate,
        });

        res.status(201).json({
            success: true,
            message: "Kennel details created successfully",
            data: kennel,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAllKennels = async (req, res) => {
    try {
        const kennels = await Kennel.find()
            .populate("staffId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: kennels.length,
            data: kennels,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getKennelById = async (req, res) => {
    try {
        const kennel = await Kennel.findById(req.params.id).populate("staffId");

        if (!kennel) {
            return res.status(404).json({
                success: false,
                message: "Kennel details not found",
            });
        }

        res.status(200).json({
            success: true,
            data: kennel,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateKennel = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (
            req.files &&
            req.files.firstAidCertificate &&
            req.files.firstAidCertificate.length > 0
        ) {
            updateData.firstAidCertificate = {
                secure_url:
                    req.files.firstAidCertificate[0].path ||
                    req.files.firstAidCertificate[0].secure_url,
                public_id:
                    req.files.firstAidCertificate[0].filename ||
                    req.files.firstAidCertificate[0].public_id,
            };
        }

        const kennel = await Kennel.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!kennel) {
            return res.status(404).json({
                success: false,
                message: "Kennel details not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Kennel details updated successfully",
            data: kennel,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteKennel = async (req, res) => {
    try {
        const kennel = await Kennel.findByIdAndDelete(req.params.id);

        if (!kennel) {
            return res.status(404).json({
                success: false,
                message: "Kennel details not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Kennel details deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.toggleKennelStatus = async (req, res) => {
    try {
        const kennel = await Kennel.findById(req.params.id);

        if (!kennel) {
            return res.status(404).json({
                success: false,
                message: "Kennel details not found",
            });
        }

        kennel.status =
            kennel.status === "Active" ? "Inactive" : "Active";

        await kennel.save();

        res.status(200).json({
            success: true,
            message: `Status changed to ${kennel.status}`,
            data: kennel,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};