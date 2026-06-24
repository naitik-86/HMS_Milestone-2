const PetRegistration = require("../models/PetRegistration");

// Create Registration
const createRegistration = async (req, res) => {
    try {
        const {
            mobileNumber,
            ownerName,
            visitType,
            ownerIdType,
            email,
            address,
            state,
            city,
            district,
            pincode,
            pet,
            history,
            visit,
        } = req.body;

        let owner = await PetRegistration.findOne({
            mobileNumber,
        });

        const uniquePetId = `PET-${Date.now()}`;

        const tokenNumber = `TK-${Date.now()}`;

        const petData = {
            ...pet,
            uniquePetId,

            history: {
                vaccinations: history?.vaccinations || [],
                dewormings: history?.dewormings || [],
                surgeries: history?.surgeries || [],
                treatments: history?.treatments || [],
                allergies: history?.allergies || "",
                currentMedications:
                    history?.currentMedications || "",
            },

            visits: [
                {
                    ...visit,
                    tokenNumber,
                },
            ],
        };

        // Existing Owner
        if (owner) {
            owner.pets.push(petData);

            await owner.save();

            return res.status(200).json({
                success: true,
                message: "Pet Added Successfully",
                data: owner,
            });
        }

        // New Owner
        owner = await PetRegistration.create({
            mobileNumber,
            ownerName,
            visitType,
            ownerIdType,
            email,
            address,
            state,
            city,
            district,
            pincode,
            pets: [petData],
        });

        return res.status(201).json({
            success: true,
            message: "Registration Created Successfully",
            data: owner,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Search Existing Customer
const searchCustomer = async (req, res) => {
    try {
        const { mobileNumber } = req.params;

        const customer =
            await PetRegistration.findOne({
                mobileNumber,
            });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer Not Found",
            });
        }

        return res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Owner Details
const getOwnerDetails = async (req, res) => {
    try {
        const owner =
            await PetRegistration.findById(
                req.params.ownerId
            );

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner Not Found",
            });
        }

        return res.status(200).json({
            success: true,
            data: owner,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Add New Pet
const addPet = async (req, res) => {
    try {
        const owner =
            await PetRegistration.findById(
                req.params.ownerId
            );

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner Not Found",
            });
        }

        owner.pets.push({
            ...req.body,
            uniquePetId: `PET-${Date.now()}`,
        });

        await owner.save();

        return res.status(200).json({
            success: true,
            message: "Pet Added Successfully",
            data: owner,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Add Visit
const addVisit = async (req, res) => {
    try {
        const { ownerId, petId } = req.params;

        const owner =
            await PetRegistration.findById(ownerId);

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner Not Found",
            });
        }

        const pet = owner.pets.id(petId);

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "Pet Not Found",
            });
        }

        pet.visits.push({
            ...req.body,
            tokenNumber: `TK-${Date.now()}`,
        });

        await owner.save();

        return res.status(200).json({
            success: true,
            message: "Visit Added Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Pet History
const getPetHistory = async (req, res) => {
    try {
        const { ownerId, petId } = req.params;

        const owner =
            await PetRegistration.findById(ownerId);

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner Not Found",
            });
        }

        const pet = owner.pets.id(petId);

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "Pet Not Found",
            });
        }

        return res.status(200).json({
            success: true,
            data: pet.history,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



const getExistingCustomers = async (req, res) => {
    try {
        const { search } = req.query;

        const owners = await PetRegistration.find();

        let result = [];

        owners.forEach(owner => {

            owner.pets.forEach(pet => {

                const latestVisit =
                    pet.visits?.[pet.visits.length - 1] || {};

                result.push({
                    ownerId: owner._id,
                    petId: pet._id,
                    petUniqueId: pet.uniquePetId,
                    ownerName: owner.ownerName,
                    petName: pet.petName,
                    reason: latestVisit.primaryReason || "-",
                    status: latestVisit.status || "Pending"
                });

            });

        });

        if (search) {
            const value = search.toLowerCase();

            result = result.filter(item =>
                item.ownerName.toLowerCase().includes(value) ||
                item.petName.toLowerCase().includes(value) ||
                (item.petUniqueId || "").toLowerCase().includes(value)
            );
        }

        res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getPetDetails = async (req, res) => {
    try {

        const { ownerId, petId } = req.params;

        const owner = await PetRegistration.findById(ownerId);

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner not found"
            });
        }

        const pet = owner.pets.id(petId);

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: "Pet not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                owner,
                pet
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const owners = await PetRegistration.find();

        let totalPets = 0;
        let activeVisits = 0;
        let pendingVisits = 0;

        owners.forEach(owner => {
            totalPets += owner.pets.length;

            owner.pets.forEach(pet => {
                const visits = pet.visits || [];

                visits.forEach(v => {
                    if (v.status === "In Progress") activeVisits++;
                    if (v.status === "Pending") pendingVisits++;
                });
            });
        });

        res.status(200).json({
            success: true,
            data: {
                totalPets,
                activeVisits,
                pendingVisits
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// // GET all
// exports.getAll = async (req, res) => {
//   try {
//     const data = await Registration.find().sort({ createdAt: -1 });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // CREATE
// exports.create = async (req, res) => {
//   try {
//     const newReg = await Registration.create(req.body);
//     res.status(201).json(newReg);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // UPDATE (Edit)
// exports.update = async (req, res) => {
//   try {
//     const updated = await Registration.findOneAndUpdate(
//       { token: req.params.token },
//       req.body,
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // DELETE (optional)
// exports.remove = async (req, res) => {
//   try {
//     await Registration.findOneAndDelete({ token: req.params.token });
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // STATS (for your dashboard cards)
// exports.getStats = async (req, res) => {
//   try {
//     const total = await Registration.countDocuments();
//     const pending = await Registration.countDocuments({ status: "Pending" });
//     const completed = await Registration.countDocuments({ status: "Completed" });

//     res.json({
//       todayVisits: 124,
//       newPets: total,
//       appointments: 32,
//       pending,
//       completed,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

module.exports = {
    createRegistration,
    searchCustomer,
    getOwnerDetails,
    addPet,
    addVisit,
    getPetHistory,
    getDashboardStats,
    getPetDetails,
    getExistingCustomers
};