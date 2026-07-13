const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactEmail: { type: String, lowercase: true, trim: true },
  subscriptionType: { 
    type: String, 
    enum: ['6_MONTHS', '12_MONTHS', 'FREE_TIER'], 
    required: true 
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
  addressDetails: {
    addressLine1: String,
    addressLine2: String,
    city: String,
    district: String,
    state: String,
    pincode: String,
    serviceArea: String
  },
  servicesOffered: [{ type: String }],
  
  // ==========================================
  // NEW: ONBOARDING VERIFICATION & DOCUMENTS
  // ==========================================
  legalDocuments: {
    clinicLogoUrl: String,
    vetCouncilCertificateUrl: String,
    tradeLicenseUrl: String,
    cancelledChequeUrl: String,
    adminProfileUrl: String,
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
