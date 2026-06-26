const LabReport = require("../models/LabReport");
exports.getDashboardStats = async (req, res) => {
    try {
        const totalReports = await LabReport.countDocuments();

        const pendingUploads = await LabReport.countDocuments({
            status: "Pending",
        });
        const criticalCases = await LabReport.countDocuments({
            status: "Critical",
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayReports = await LabReport.countDocuments({
            createdAt: { $gte: today },
        });

        res.status(200).json({
            success: true,
            data: {
                totalReports,
                pendingUploads,
                criticalCases,
                todayReports,
            },
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Recent Activities
exports.getRecentActivities = async (req, res) => {
    try {
        const activities = await LabReport.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select(
                "reportId petName ownerName reportType status createdAt"
            );

        res.status(200).json({
            success: true,
            data: activities,
        });
    } catch (error) {
        console.error("Recent Activity Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Pending Reports Summary
exports.getPendingSummary = async (req, res) => {
    try {
        const summary = await LabReport.aggregate([
            {
                $match: {
                    status: "Pending",
                },
            },
            {
                $group: {
                    _id: "$reportType",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: summary,
        });
    } catch (error) {
        console.error("Pending Summary Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*  ==================
  |   Create Report   |
  | =================== */

exports.createReport = async (req, res) => {
    try {
        const {
            reportId,
            petName,
            ownerName,
            reportType,
            status,
            remarks,
        } = req.body;

        const report = await LabReport.create({
            reportId,
            petName,
            ownerName,
            reportType,
            status,
            remarks,
            reportFile: req.file ? req.file.path : "",
            uploadedBy: req.user?.id,
        });

        res.status(201).json({
            success: true,
            message: "Report uploaded successfully",
            data: report,
        });
    } catch (error) {
        console.error("Create Report Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await LabReport.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports,
        });
    } catch (error) {
        console.error("Get Reports Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Single Report
exports.getSingleReport = async (req, res) => {
    try {
        const report = await LabReport.findById(
            req.params.id
        );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        console.error("Get Single Report Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Report
exports.updateReport = async (req, res) => {
    try {
        const report = await LabReport.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Report updated successfully",
            data: report,
        });
    } catch (error) {
        console.error("Update Report Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Report
exports.deleteReport = async (req, res) => {
    try {
        const report = await LabReport.findByIdAndDelete(
            req.params.id
        );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Report deleted successfully",
        });
    } catch (error) {
        console.error("Delete Report Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};