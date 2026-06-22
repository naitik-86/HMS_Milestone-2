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

module.exports = {
    createRegistration,
    searchCustomer,
    getOwnerDetails,
    addPet,
    addVisit,
    getPetHistory,
};