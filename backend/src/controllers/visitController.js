const Visit = require("../models/visitModel");


exports.createVisit = async (req, res) => {
    try {

        // ✅ Validation
        if (!req.body.petId || !req.body.ownerId) {
            return res.status(400).json({
                success: false,
                message: "Pet and Owner are required"
            });
        }

        // ✅ Token generation
        const lastVisit = await Visit.findOne({ clinicId: req.user.clinicId })
            .sort({ createdAt: -1 });

        const tokenNumber = lastVisit ? lastVisit.tokenNumber + 1 : 1;

        // ✅ Stage logic
        let nextStage = "PRE_CONSULTATION";

        if (req.body.visitType === "GROOMING") nextStage = "GROOMER";
        if (req.body.visitType === "KENNEL") nextStage = "KENNEL";
        if (req.body.visitType === "EMERGENCY") nextStage = "DOCTOR";

        // ✅ Create visit
        const visit = await Visit.create({
            ...req.body,
            clinicId: req.user.clinicId,
            receptionistId: req.user._id,

            tokenNumber,
            currentStage: nextStage,
            status: "WAITING",

            workflow: {
                receptionCompleted: true
            }
        });

        res.status(201).json({
            success: true,
            data: visit
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create visit"
        });
    }
};