const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'PetRegistration' },
  name: { type: String, required: true },
  petName: { type: String },
  uniquePetId: { type: String },
  species: { type: String, enum: ['DOG', 'CAT', 'BIRD', 'OTHER', 'RABBIT'], required: true },
  breed: { type: String },
  dob: { type: Date },
  age: { type: Number },
  gender: { type: String },
  color: { type: String },
  identificationMarks: { type: String },
  identificationArea: { type: String },
  photoUrl: { type: String },
  isSterilised: { type: Boolean, default: false },
  sterilized: { type: Boolean, default: false },
  weightTracker: [{
    weight: Number,
    date: { type: Date, default: Date.now }
  }],
  allergies: [{ type: String }],
  rfidTag: { type: String },
  rfid: { type: String },
  history: {
    vaccinations: [{ name: String, date: Date }],
    dewormings: [{ product: String, date: Date }],
    surgeries: [{ procedure: String, date: Date }],
    treatments: [{ details: String, date: Date }],
    allergies: String,
    currentMedications: String
  },
  visits: [{
    primaryReason: String,
    assignedDoctor: String,
    complaint: String,
    tokenNumber: String,
    appointmentDate: Date,
    appointmentTime: String,
    status: { type: String, default: "Pending" }
  }]
}, { timestamps: true });


const Pet = mongoose.model("Pet", petSchema);

module.exports = {
  Pet,
  petSchema,
};
