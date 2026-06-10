const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  name: { type: String, required: true },
  species: { type: String, enum: ['DOG', 'CAT', 'BIRD', 'OTHER', 'RABBIT'], required: true },
  breed: { type: String },
  dob: { type: Date },
  gender: { type: String },
  color: { type: String },
  identificationMarks: { type: String }, 
  photoUrl: { type: String }, 
  isSterilised: { type: Boolean, default: false }, 
  weightTracker: [{ 
    weight: Number, 
    date: { type: Date, default: Date.now } 
  }],
  allergies: [{ type: String }],
  rfidTag: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);