const PreConsultation = require("../models/PreConsultation");

exports.createPreConsultation = async (req, res) => {
  try {
    const preConsultation = await PreConsultation.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Pre Consultation Created Successfully",
      data: preConsultation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPendingPets = async (req, res) => {
  try {
    const pets = await PreConsultation.find({
      status: "PENDING",
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: pets.length,
      data: pets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCompletedPets = async (req, res) => {
  try {
    const pets = await PreConsultation.find({
      status: "COMPLETED",
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: pets.length,
      data: pets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const totalPatients =
      await PreConsultation.countDocuments();

    const pendingPatients =
      await PreConsultation.countDocuments({
        status: "PENDING",
      });

    const completedPatients =
      await PreConsultation.countDocuments({
        status: "COMPLETED",
      });

    const observationPatients =
      await PreConsultation.countDocuments({
        severity: "Severe",
      });

    return res.status(200).json({
      success: true,
      data: {
        totalPatients,
        pendingPatients,
        completedPatients,
        observationPatients,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePreConsultation = async (req, res) => {
  try {
    const preConsultation =
      await PreConsultation.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!preConsultation) {
      return res.status(404).json({
        success: false,
        message: "Record Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: preConsultation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSinglePreConsultation = async (req, res) => {
  try {
    const record =
      await PreConsultation.findById(
        req.params.id
      );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePreConsultation = async (req, res) => {
  try {
    const record =
      await PreConsultation.findByIdAndDelete(
        req.params.id
      );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};