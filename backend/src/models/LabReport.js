// const mongoose = require("mongoose");

// const labReportSchema = new mongoose.Schema(
//     {
//         reportId: {
//             type: String,
//             required: true,
//             unique: true,
//         },

//         petName: {
//             type: String,
//             required: true,
//             trim: true,
//         },

//         ownerName: {
//             type: String,
//             required: true,
//             trim: true,
//         },

//         reportType: {
//             type: String,
//             enum: [
//                 "Blood Test",
//                 "CBC Report",
//                 "Urine Test",
//                 "X-Ray",
//                 "Ultrasound",
//             ],
//             required: true,
//         },

//         status: {
//             type: String,
//             enum: ["Pending", "Completed", "Critical"],
//             default: "Pending",
//         },

//         remarks: {
//             type: String,
//             default: "",
//         },

//         reportFile: {
//             type: String,
//             default: "",
//         },

//         uploadedBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// module.exports = mongoose.model("LabReport", labReportSchema);