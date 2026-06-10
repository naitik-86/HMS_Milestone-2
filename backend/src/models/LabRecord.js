const mongoose = require('mongoose');

const labRecordSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Requisition (Filled by Doctor during Consultation)
  requisition: {
    testsRequired: [String],
    sampleType: [String],
    specialInstructions: String
  },
  
  // Results (Filled by Lab Tech or Owner via App)
  results: {
    testsCompleted: [String],
    reportFiles: [String], // Array of secure URLs (e.g., AWS S3 links)
    sampleCollectedAt: Date,
    reportDate: Date,
    externalLabName: String,
    criticalValuesFlag: Boolean,
    criticalNotes: String,
    remarks: String,
    uploadedByRole: { type: String, enum: ['LAB_TECH', 'OWNER'], required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('LabRecord', labRecordSchema);