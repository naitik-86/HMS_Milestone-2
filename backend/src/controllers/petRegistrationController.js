const PetRegistration = require("../models/PetRegistration");
const Visit = require("../models/visitModel");
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
        const cleanMobile = String(mobileNumber || "").replace(/\D/g, "").slice(-10);

        if (!cleanMobile || cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
            return res.status(400).json({
                success: false,
                message: "Valid 10 digit Indian mobile number starting with 6-9 is required",
            });
        }

        const otp = generateOTP();
        console.log(`[New Registration OTP] Mobile: ${cleanMobile}, OTP: ${otp}`);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: { otp },
        });
    } catch (error) {
        console.error("sendRegistrationOtp Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to send OTP",
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

        const petsInput = Array.isArray(req.body.pets) && req.body.pets.length > 0
            ? req.body.pets
            : pet ? [pet] : [];

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

        for (let i = 0; i < petsInput.length; i++) {
            const currentPet = petsInput[i];
            const uniquePetId = `PET-${Date.now()}-${i}`;
            const tokenNumber = `TK-${Date.now()}-${i}`;

            const petData = {
                ...currentPet,
                name: currentPet?.name || currentPet?.petName || "Unnamed Pet",
                petName: currentPet?.petName || currentPet?.name || "Unnamed Pet",
                species: normalizeSpecies(currentPet?.species),
                isSterilised: currentPet?.sterilized === true || currentPet?.sterilized === "Yes",
                sterilized: currentPet?.sterilized === true || currentPet?.sterilized === "Yes",
                uniquePetId,
                ownerId: owner._id,
                history: {
                    vaccinations: currentPet?.history?.vaccinations || history?.vaccinations || [],
                    dewormings: currentPet?.history?.dewormings || history?.dewormings || [],
                    surgeries: currentPet?.history?.surgeries || history?.surgeries || [],
                    treatments: currentPet?.history?.treatments || history?.treatments || [],
                    allergies: currentPet?.history?.allergies || history?.allergies || "",
                    currentMedications: currentPet?.history?.currentMedications || history?.currentMedications || "",
                },
                visits: [
                    {
                        ...(currentPet?.visit || visit),
                        tokenNumber,
                    },
                ],
            };
            owner.pets.push(petData);
        }

        await owner.save();

        // Automatically create a Visit entry for each registered pet
        for (let i = 0; i < owner.pets.length; i++) {
            const createdPet = owner.pets[i];
            const petVisitInfo = petsInput[i]?.visit || visit || {};
            try {
                const lastVisit = await Visit.findOne({ clinicId }).sort({ createdAt: -1 });
                const tokenNum = lastVisit && typeof lastVisit.tokenNumber === "number" ? lastVisit.tokenNumber + 1 : (i + 1);

                await Visit.create({
                    clinicId,
                    ownerId: owner._id,
                    petId: createdPet._id,
                    receptionistId: req.user?._id,
                    tokenNumber: tokenNum,
                    chiefComplaint: petVisitInfo?.complaint || petVisitInfo?.primaryReason || "New Patient Intake Assessment",
                    notes: petVisitInfo?.notes || "",
                    currentStage: "PRE_CONSULTATION",
                    status: "WAITING",
                    workflow: {
                        receptionCompleted: true,
                        preConsultationCompleted: false,
                        doctorCompleted: false,
                        labCompleted: false
                    }
                });
            } catch (visitErr) {
                console.error("Failed to auto-create visit for new registration pet:", visitErr);
            }
        }

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
        const clinicId = req.user?.clinicId || req.user?.clinic;

        const cleanDigits = String(mobileNumber || "").replace(/\D/g, "").slice(-10);

        if (!cleanDigits || cleanDigits.length !== 10) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "Please enter a valid 10-digit mobile number."
            });
        }

        const filter = {
            mobileNumber: { $regex: cleanDigits + "$" }
        };

        if (clinicId) {
            filter.clinicId = clinicId;
        }

        const customer = await PetRegistration.findOne(filter);

        if (customer) {
            customer.isMobileVerified = true;
            await customer.save();
        }

        return res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        console.error("searchCustomer Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error searching customer mobile number.",
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

        // Create Visit document for Pre-Consultation / Doctor workflow
        try {
            const lastVisit = await Visit.findOne({ clinicId }).sort({ createdAt: -1 });
            const tokenNum = lastVisit && typeof lastVisit.tokenNumber === "number" ? lastVisit.tokenNumber + 1 : 1;

            await Visit.create({
                clinicId,
                ownerId: owner._id,
                petId: pet._id,
                receptionistId: req.user?._id,
                tokenNumber: tokenNum,
                chiefComplaint: req.body.complaint || req.body.primaryReason || "Patient Intake Assessment",
                notes: req.body.notes || "",
                currentStage: "PRE_CONSULTATION",
                status: "WAITING",
                workflow: {
                    receptionCompleted: true,
                    preConsultationCompleted: false,
                    doctorCompleted: false,
                    labCompleted: false
                }
            });
        } catch (vErr) {
            console.error("Error creating Visit model entry in addVisit:", vErr);
        }

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
