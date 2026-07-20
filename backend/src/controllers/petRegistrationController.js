const PetRegistration = require("../models/PetRegistration");
const { generateOTP } = require("../utils/otpService");

const normalizeSpecies = (species = "") => {
    const value = species.toString().trim().toUpperCase();
    return value === "RABBIT" || value === "BIRD" || value === "CAT" || value === "DOG"
        ? value
        : "OTHER";
};


const sendRegistrationOtp = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        if (!/^[6-9]\d{9}$/.test(mobileNumber || "")) {
            return res.status(400).json({
                success: false,
                message: "Valid 10 digit mobile number is required",
            });
        }

        const otp = generateOTP();
        console.log(`[New Registration OTP] Mobile: ${mobileNumber}, OTP: ${otp}`);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: { otp },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const createRegistration = async (req, res) => {

    try {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++")
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

        console.log(req.body);

        const clinicId = req.user.clinicId;


        let owner = await PetRegistration.findOne({
            clinicId,
            mobileNumber,
        });

        if (owner) {
            return res.status(409).json({
                success: false,
                message: "This mobile number is already registered",
                data: owner,
            });
        }

        const uniquePetId = `PET-${Date.now()}`;

        const tokenNumber = `TK-${Date.now()}`;

        const petData = {
            ...pet,
            name: pet?.name || pet?.petName,
            petName: pet?.petName || pet?.name,
            species: normalizeSpecies(pet?.species),
            isSterilised: pet?.sterilized === true,
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

        // New Owner
        owner = new PetRegistration({
            clinicId,
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
            pets: [],
        });

        petData.ownerId = owner._id;
        owner.pets.push(petData);
        await owner.save();

        console.log("submitted");

        console.log(owner);


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
}
const searchCustomer = async (req, res) => {
    try {
        const { mobileNumber } = req.params;
        const clinicId = req.user.clinicId;

        const customer = await PetRegistration.findOne({
            clinicId,
            mobileNumber
        });

        if (customer) {
            customer.isMobileVerified = true;
            await customer.save();
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
        const clinicId = req.user.clinicId;

        const owner = await PetRegistration.findOne({
            _id: req.params.ownerId,
            clinicId,
        });

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

const updateOwner = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;
        const allowedFields = [
            "ownerName",
            "visitType",
            "ownerIdType",
            "email",
            "address",
            "state",
            "city",
            "district",
            "pincode",
        ];
        const updateData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const owner = await PetRegistration.findOneAndUpdate(
            { _id: req.params.ownerId, clinicId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner Not Found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Owner Updated Successfully",
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
        const clinicId = req.user.clinicId;

        const owner = await PetRegistration.findOne({
            _id: req.params.ownerId,
            clinicId,
        });

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner Not Found",
            });
        }

        owner.pets.push({
            ...req.body,
            name: req.body.name || req.body.petName,
            petName: req.body.petName || req.body.name,
            species: normalizeSpecies(req.body.species),
            ownerId: owner._id,
            isSterilised: req.body.sterilized === true || req.body.sterilized === "Yes",
            sterilized: req.body.sterilized === true || req.body.sterilized === "Yes",
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

const updatePet = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;
        const { ownerId, petId } = req.params;

        const owner = await PetRegistration.findOne({
            _id: ownerId,
            clinicId,
        });

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

        const allowedFields = [
            "petName",
            "name",
            "species",
            "breed",
            "dob",
            "age",
            "gender",
            "color",
            "identificationArea",
            "identificationMarks",
            "rfid",
            "rfidTag",
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                pet[field] = field === "species" ? normalizeSpecies(req.body[field]) : req.body[field];
            }
        });

        if (req.body.petName || req.body.name) {
            pet.name = req.body.name || req.body.petName;
            pet.petName = req.body.petName || req.body.name;
        }

        if (req.body.sterilized !== undefined) {
            const sterilized = req.body.sterilized === true || req.body.sterilized === "Yes";
            pet.sterilized = sterilized;
            pet.isSterilised = sterilized;
        }

        await owner.save();

        return res.status(200).json({
            success: true,
            message: "Pet Updated Successfully",
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

        const clinicId = req.user.clinicId;

        const owner = await PetRegistration.findOne({
            _id: ownerId,
            clinicId,
        });

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

// Get Pet History by Id
const getPetHistoryByID = async (req, res) => {
    try {
        console.log("---------------------------------------------------------")
        const { ownerId, petId } = req.params;

        const clinicId = req.user.clinicId;

        await PetRegistration.findOne({
            _id: ownerId,
            clinicId,
        });

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

const getPetHistory = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;

        const owners = await PetRegistration.find({
            clinicId,
        });
        const history = [];

        owners.forEach((owner) => {
            owner.pets.forEach((pet) => {

                // No visits at all
                if (!pet.visits || pet.visits.length === 0) {
                    history.push({
                        ownerId: owner._id,
                        petId: pet._id,
                        petName: pet.petName || "-",
                        owner: owner.ownerName || "-",
                        reason: "-",
                        doctor: "-",
                        status: "-",
                        age: pet.age || "-",
                        date: owner.createdAt,
                        formattedDate: owner.createdAt
                            ? new Date(owner.createdAt).toLocaleDateString()
                            : "-"
                    });

                    return;
                }

                pet.visits.forEach((visit) => {
                    const hasRealVisitData =
                        visit.primaryReason ||
                        visit.assignedDoctor ||
                        visit.appointmentDate ||
                        visit.complaint;

                    history.push({
                        ownerId: owner._id,
                        petId: pet._id,
                        petName: pet.petName || "-",
                        owner: owner.ownerName || "-",

                        reason: hasRealVisitData ? visit.primaryReason || "-" : "-",
                        doctor: hasRealVisitData ? visit.assignedDoctor || "-" : "-",
                        status: visit.status || "Pending",

                        age: pet.age || "-",
                        bill: "-",

                        date: hasRealVisitData
                            ? visit.appointmentDate || owner.createdAt
                            : owner.createdAt,

                        formattedDate: hasRealVisitData
                            ? new Date(
                                visit.appointmentDate || owner.createdAt
                            ).toLocaleDateString()
                            : new Date(owner.createdAt).toLocaleDateString(),

                        tokenNumber: visit.tokenNumber || "-",
                        appointmentTime: visit.appointmentTime || "-",
                        complaint: visit.complaint || "-",
                    });
                });
            });
        });

        history.sort((a, b) => new Date(b.date) - new Date(a.date));

        return res.status(200).json({
            success: true,
            count: history.length,
            data: history,
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
        const clinicId = req.user.clinicId;

        const owners = await PetRegistration.find({ clinicId });

        let result = [];

        [...owners].reverse().forEach((owner) => {
            [...owner.pets].reverse().forEach((pet) => {
                if (search) {
                    const value = search.toLowerCase();

                    if (
                        !owner.ownerName.toLowerCase().includes(value) &&
                        !pet.petName.toLowerCase().includes(value) &&
                        !(pet.uniquePetId || "").toLowerCase().includes(value)
                    ) {
                        return;
                    }
                }

                result.push({
                    owner,
                    pet,
                });
            });
        });

        res.status(200).json({
            success: true,
            count: result.length,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getPetDetails = async (req, res) => {
    try {

        const { ownerId, petId } = req.params;

        const clinicId = req.user.clinicId;

        const owner = await PetRegistration.findOne({
            _id: ownerId,
            clinicId,
        });

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
        const clinicId = req.user.clinicId;

        const owners = await PetRegistration.find({
            clinicId,
        });

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
module.exports = {
    sendRegistrationOtp,
    createRegistration,
    searchCustomer,
    getOwnerDetails,
    updateOwner,
    addPet,
    updatePet,
    addVisit,
    getPetHistory,
    getPetHistoryByID,
    getDashboardStats,
    getPetDetails,
    getExistingCustomers
};
