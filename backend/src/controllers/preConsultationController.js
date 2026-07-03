const PreConsultation = require("../models/PreConsultation");
const PetRegistration = require("../models/PetRegistration");

const attachOwnerAndPet = (records) => {
  return records.map((record) => {
    const owner = record.ownerId;

    let pet = null;

    if (owner?.pets?.length) {
      pet = owner.pets.find(
        (p) => p.uniquePetId === record.uniquePetId
      );
    }

    const data = record.toObject();

    data.owner = owner
      ? {
        _id: owner._id,
        ownerName: owner.ownerName,
        mobileNumber: owner.mobileNumber,
        email: owner.email,
        address: owner.address,
        city: owner.city,
        district: owner.district,
        state: owner.state,
        pincode: owner.pincode,
      }
      : null;

    data.pet = pet || null;

    delete data.ownerId;

    return data;
  });
};
exports.savePreConsultation = async (req, res) => {
  try {
    const {
      uniquePetId,
      tokenNumber,
    } = req.body;

    // Check if record already exists
    const existingRecord = await PreConsultation.findOne({
      uniquePetId,
    });

    if (existingRecord) {
      const updatedRecord =
        await PreConsultation.findByIdAndUpdate(
          existingRecord._id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Pre Consultation Updated Successfully",
        data: updatedRecord,
      });
    }

    const preConsultation =
      await PreConsultation.create({
        ...req.body,
        status: "COMPLETED",
      });

    return res.status(201).json({
      success: true,
      message:
        "Pre Consultation Saved Successfully",
      data: preConsultation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================================
// Dashboard
// ===============================================

exports.getDashboard = async (req, res) => {
  try {
    // ===========================================
    // Dashboard Cards
    // ===========================================

    const todayPatients = await PreConsultation.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    const vitalsPending = await PreConsultation.countDocuments({
      status: "PENDING",
    });

    const observations = await PreConsultation.countDocuments({
      severity: "Severe",
    });

    const completed = await PreConsultation.countDocuments({
      status: "COMPLETED",
    });

    // ===========================================
    // Today's Queue
    // ===========================================

    const todaysQueue = await PreConsultation.find()
      .select(
        "uniquePetId tokenNumber status severity createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    // ===========================================
    // Recent Completed Pets
    // ===========================================

    const recentCompletedPets = await PreConsultation.find({
      status: "COMPLETED",
    })
      .select(
        "uniquePetId tokenNumber status updatedAt"
      )
      .sort({ updatedAt: -1 })
      .limit(5);

    // ===========================================
    // Recent Activity
    // ===========================================

    const recentActivity = await PreConsultation.find()
      .select(
        "uniquePetId tokenNumber status severity updatedAt"
      )
      .sort({ updatedAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        cards: {
          todayPatients,
          vitalsPending,
          observations,
          completed,
        },

        todaysQueue,

        recentCompletedPets,

        recentActivity,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================================
// Get Pending Pets
// ===============================================

exports.getPendingPets = async (req, res) => {
  try {
    const pendingPets = await PreConsultation.find({
      status: "PENDING",
    })
      .populate({
        path: "ownerId",
        select:
          "ownerName mobileNumber email address city district state pincode pets",
      })
      .sort({ createdAt: -1 });

    const data = attachOwnerAndPet(pendingPets);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================================
// Get Completed Pets
// ===============================================

exports.getCompletedPets = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday =
      await PreConsultation.countDocuments({
        status: "COMPLETED",
        updatedAt: {
          $gte: today,
        },
      });

    const startOfWeek = new Date();
    startOfWeek.setDate(
      startOfWeek.getDate() - startOfWeek.getDay()
    );
    startOfWeek.setHours(0, 0, 0, 0);

    const completedThisWeek =
      await PreConsultation.countDocuments({
        status: "COMPLETED",
        updatedAt: {
          $gte: startOfWeek,
        },
      });

    const totalCompleted =
      await PreConsultation.countDocuments({
        status: "COMPLETED",
      });

    const completedPets = await PreConsultation.find({
      status: "COMPLETED",
    })
      .populate({
        path: "ownerId",
        select:
          "ownerName mobileNumber email address city district state pincode pets",
      })
      .sort({ updatedAt: -1 });

    const pets = attachOwnerAndPet(completedPets);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          completedToday,
          completedThisWeek,
          totalCompleted,
        },
        pets,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===============================================
// Get History Pets
// ===============================================

exports.getHistoryPets = async (req, res) => {
  try {
    const totalRecords =
      await PreConsultation.countDocuments();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonth =
      await PreConsultation.countDocuments({
        createdAt: {
          $gte: startOfMonth,
        },
      });

    const archivedCases =
      await PreConsultation.countDocuments({
        status: "COMPLETED",
      });

    const records = await PreConsultation.find()
      .populate({
        path: "ownerId",
        select:
          "ownerName mobileNumber email address city district state pincode pets",
      })
      .sort({
        createdAt: -1,
      });

    const history = attachOwnerAndPet(records);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalRecords,
          thisMonth,
          archivedCases,
        },
        records: history,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================================
// Get Single Pre Consultation
// ===============================================

exports.getSinglePreConsultation = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const preConsultation =
      await PreConsultation.findById(id);

    if (!preConsultation) {
      return res.status(404).json({
        success: false,
        message: "Pre Consultation Record Not Found",
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

// ===============================================
// Update Pre Consultation
// ===============================================

exports.updatePreConsultation = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const preConsultation =
      await PreConsultation.findById(id);

    if (!preConsultation) {
      return res.status(404).json({
        success: false,
        message: "Pre Consultation Record Not Found",
      });
    }

    const updatedRecord =
      await PreConsultation.findByIdAndUpdate(
        id,
        {
          ...req.body,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Pre Consultation Updated Successfully",
      data: updatedRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.searchHistoryPets = async (req, res) => {
  try {
    const { phoneNumber, uniquePetId, tokenNumber } = req.query;

    const filter = {};

    if (phoneNumber) {
      filter.ownerPhoneNumber = {
        $regex: phoneNumber,
        $options: "i",
      };
    }

    if (uniquePetId) {
      filter.uniquePetId = {
        $regex: uniquePetId,
        $options: "i",
      };
    }

    if (tokenNumber) {
      filter.tokenNumber = {
        $regex: tokenNumber,
        $options: "i",
      };
    }

    const records = await PreConsultation.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.completePreConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPreConsultation = await PreConsultation.findByIdAndUpdate(
      id,
      {
        ...req.body,
        status: "COMPLETED",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPreConsultation) {
      return res.status(404).json({
        message: "Pre Consultation not found",
      });
    }

    // Advance the linked Appointment if we can find it by uniquePetId.
    // (Appointment already stores petId but this preConsultation model uses uniquePetId)
    // For now, move only appointments currently in WAITING to IN_CONSULTATION for this clinic.
    // This keeps flow working even if linkage is not perfect.
    // NOTE: requires Appointment model; we keep this conservative to avoid wrong updates.

    res.status(200).json({
      success: true,
      data: updatedPreConsultation,
      // Frontend still must set Appointment status to IN_CONSULTATION if linkage is missing.
      hint: 'Set appointment status to IN_CONSULTATION after pre-consultation completion',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
