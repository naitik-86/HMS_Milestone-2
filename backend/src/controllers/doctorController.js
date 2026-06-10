const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');

// Doctor Dashboard: Get today's queue[cite: 2]
exports.getDoctorQueue = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const clinicId = req.user.clinicId;

    // Fetch appointments for this specific doctor and clinic[cite: 1]
    const queue = await Appointment.find({ 
      doctorId, 
      clinicId, 
      status: { $in: ['WAITING', 'IN_CONSULTATION'] } 
    }).populate('petId ownerId');

    res.status(200).json({ success: true, count: queue.length, data: queue });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Consultation Screen & Prescription[cite: 2]
exports.saveConsultation = async (req, res) => {
  try {
    const { recordId, diagnosisNotes, privateNotes, prescription, labTestsSuggested, followUpDate } = req.body;

    // Update the existing medical record with doctor's notes & prescription[cite: 1]
    const record = await MedicalRecord.findByIdAndUpdate(
      recordId,
      { diagnosisNotes, privateNotes, prescription, labTestsSuggested, followUpDate },
      { new: true }
    );

    // Mark appointment as completed
    await Appointment.findByIdAndUpdate(record.appointmentId, { status: 'COMPLETED' });

    // Note: PDF generation logic would trigger here for prescriptions[cite: 1, 2]

    res.status(200).json({ success: true, record });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};