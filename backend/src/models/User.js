const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Removed `required: true` to support Solo Practitioners (Doctors not attached to a hospital)
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true }, 
  role: { 
    type: String, 
    enum: ['CLINIC_ADMIN', 'DOCTOR', 'PARA_MEDICAL', 'RECEPTIONIST'], 
    required: true 
  },
  isActive: { type: Boolean, default: true },
  specialization: { type: String }, // Only populated if role is DOCTOR
  
  // ==========================================
  // NEW: SOLO PRACTITIONER DETAILS
  // ==========================================
  practiceType: { 
    type: String, 
    enum: ['HOSPITAL', 'SOLO_TELEMEDICINE', 'SOLO_HOME_VISIT'] 
  },
  consultationFee: { type: Number }
}, { timestamps: true });

userSchema.index({ clinicId: 1, role: 1 });
module.exports = mongoose.model('User', userSchema);