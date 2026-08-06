const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            default: "SUPER_ADMIN",
        },
        // Every account in this collection logs in and is authorized
        // identically (see authOtpController.verifySuperAdminOtp, which
        // always issues role: 'SUPER_ADMIN' regardless of this field) - all
        // super admins have equal access by design. createdBy exists only
        // to show who set up which account, not to gate anything.
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SuperAdmin",
            default: null,
        },
        failedPasswordAttempts: { type: Number, default: 0 },
        passwordLockUntil: { type: Date, default: null },
        failedOtpAttempts: { type: Number, default: 0 },
        otpLockUntil: { type: Date, default: null },
        lastLoginAt: { type: Date, default: null },
        lastLoginIp: { type: String, default: null },
        lastLoginDevice: { type: String, default: null },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("SuperAdmin", superAdminSchema);