const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  subscriptionType: {
    type: String,
    enum: ['6_MONTHS', '12_MONTHS', 'FREE_TIER'],
    required: true
  },
  subscriptionPrice: {
    type: Number,
    default: 0
  },
  subscriptionStatus: {
    type: String,
    enum: ['ACTIVE', 'SUSPENDED', 'EXPIRED'],
    default: 'ACTIVE'
  },
  expiryDate: { type: Date },
  licenseLimits: {
    maxDoctors: { type: Number, default: 5 },
    maxStaff: { type: Number, default: 10 }
  },
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] }
  },
  servicesOffered: [{ type: String }],

  paymentCompleted: {
    type: Boolean,
    default: false
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  // ==========================================
  // NEW: ONBOARDING VERIFICATION & DOCUMENTS
  // ==========================================
  legalDocuments: {
    vetCouncilCertificateUrl: String,
    tradeLicenseUrl: String,
    cancelledChequeUrl: String,
  },
  verificationStatus: {
    type: String,
    enum: ['SUBMITTED', 'UNDER_REVIEW', 'DOCS_VERIFIED', 'APPROVED', 'REJECTED'],
    default: 'SUBMITTED'
  },
  rejectionReason: { type: String }
}, { timestamps: true });

clinicSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Clinic', clinicSchema);