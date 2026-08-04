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
        // tokenNumber is a String on the model (reception's own token
        // generator writes "TK-116"-style values there) - parse defensively
        // instead of `+ 1`, which would silently string-concatenate onto a
        // non-numeric last token (e.g. "TK-1161") rather than increment it.
        const lastVisit = await Visit.findOne({ clinicId: req.user.clinicId })
            .sort({ createdAt: -1 });

        const lastTokenNum = parseInt(lastVisit?.tokenNumber, 10);
        const tokenNumber = String(Number.isFinite(lastTokenNum) ? lastTokenNum + 1 : 1);

        // ✅ Stage logic
        let nextStage = "PRE_CONSULTATION";

       

        // ✅ Create visit
     const visit = await Visit.create({
    ...req.body,
    clinicId: req.user.clinicId,
    receptionistId: req.user._id,

    tokenNumber,
    currentStage: nextStage,   // ✅ PRE_CONSULTATION
    status: "WAITING",

    workflow: {
        receptionCompleted: true,
        preConsultationCompleted: false,
        doctorCompleted: false,
        labCompleted: false
    }
});
console.log("===== VISIT CREATED =====");
console.log(visit);
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