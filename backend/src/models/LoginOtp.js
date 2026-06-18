const mongoose = require('mongoose');

const loginOtpSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'USER'],
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: false,
      index: true,
      trim: true,
    },
    otpEmail: {
      type: String,
      required: true,
    },
    otpMobile: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    isConsumed: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// TTL index so expired docs are auto removed
loginOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('LoginOtp', loginOtpSchema);

