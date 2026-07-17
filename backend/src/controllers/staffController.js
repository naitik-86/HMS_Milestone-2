const bcrypt = require("bcrypt");
const Staff = require("../models/Staff.js");

const generateStaffId = require("../utils/generateStaffId.js");
const generateUsername = require("../utils/generateUsername.js");
const generatePassword = require("../utils/generatePassword.js");
const sendEmail = require("../utils/emailService.js");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createStaff = async (req, res) => {

    console.log("****** -> createstaff");
    console.log(req.body);

    try {
        if (!req.user?.clinicId) {
            return res.status(400).json({
                success: false,
                message: "Clinic context is missing for staff creation",
            });
        }

        const personalInfo = req.body.personalInfo
            ? JSON.parse(req.body.personalInfo)
            : {};

        const employmentInfo = req.body.employmentInfo
            ? JSON.parse(req.body.employmentInfo)
            : {};

        const accountInfo = req.body.accountInfo
            ? JSON.parse(req.body.accountInfo)
            : {};

        const bankDetails = req.body.bankDetails
            ? JSON.parse(req.body.bankDetails)
            : {};

        const moduleAccess = req.body.moduleAccess
            ? JSON.parse(req.body.moduleAccess)
            : {};

        if (!personalInfo.fullName || !personalInfo.email || !personalInfo.mobileNumber || !personalInfo.dateOfBirth) {
            return res.status(400).json({
                success: false,
                message: "Full name, email, mobile number, and date of birth are required",
            });
        }

        if (!employmentInfo.role) {
            return res.status(400).json({
                success: false,
                message: "Staff role is required",
            });
        }

        const normalizedEmail = typeof personalInfo.email === "string"
            ? personalInfo.email.trim().toLowerCase()
            : "";

        if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "A valid staff email is required",
            });
        }

        personalInfo.email = normalizedEmail;

        const existingEmail = await Staff.findOne({
            "personalInfo.email": {
                $regex: `^${escapeRegExp(normalizedEmail)}$`,
                $options: 'i',
            },
        });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const staffId = await generateStaffId();

        const username = await generateUsername(
            personalInfo.fullName
        );

        const temporaryPassword = generatePassword();

        const hashedPassword = await bcrypt.hash(
            temporaryPassword,
            10
        );

        const newStaff = await Staff.create({
            clinicId: req.user.clinicId,
            personalInfo: {
                ...personalInfo,
                profilePhoto: req.file?.path || "",
            },

            employmentInfo: {
                ...employmentInfo,
                staffId,
            },

            moduleAccess,
            bankDetails,

            accountInfo: {
                ...accountInfo,
                username,
                temporaryPassword,
                password: hashedPassword,
            },
        });

        const staffResponse = newStaff.toObject();

        delete staffResponse.accountInfo.password;

        let emailWarning = null;

        // Send credentials to staff email
        try {
            await sendEmail({
                email: normalizedEmail,
                subject: "Your HMS staff login credentials",
                message: `Hello ${personalInfo.fullName},\n\nYour HMS account has been created by the clinic admin.\n\nStaff ID: ${staffId}\nUsername: ${username}\nTemporary Password: ${temporaryPassword}\n\nFirst login steps:\n1) Change your password\n\nPlease keep this information secure.`,
            });
        } catch (emailErr) {
            // Don’t fail staff creation if email fails, but record the warning
            console.error("STAFF CREDENTIAL EMAIL ERROR:", emailErr.message);
            emailWarning = {
                message: 'Staff created, but email failed',
                reason: emailErr.message,
            };
        }

        res.status(201).json({
            success: true,
            message: emailWarning ? (typeof emailWarning === 'string' ? emailWarning : 'Staff created, but email failed') : "Staff created successfully",
            emailWarning,
            username,
            temporaryPassword,
            data: staffResponse,
        });
    } catch (error) {
        console.error(
            "CREATE STAFF ERROR:",
            error.message
        );

        if (error?.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern || {})[0];

            if (duplicateField === "personalInfo.email") {
                return res.status(409).json({
                    success: false,
                    message: "This email is already used by another staff member",
                });
            }

            if (duplicateField === "employmentInfo.staffId") {
                return res.status(409).json({
                    success: false,
                    message: "Staff ID already exists. Please try again.",
                });
            }

            if (duplicateField === "accountInfo.username") {
                return res.status(409).json({
                    success: false,
                    message: "Username already exists. Please try again.",
                });
            }
        }

        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

const getAllStaff = async (req, res) => {
    try {
        const page =
            Number(req.query.page) || 1;

        const limit =
            Number(req.query.limit) || 10;

        const search =
            req.query.search || "";

        const role =
            req.query.role || "";

        const department =
            req.query.department || "";

        const query = {
            clinicId: req.user.clinicId,
            isDeleted: false,
        };

        if (search) {
            query["personalInfo.fullName"] = {
                $regex: search,
                $options: "i",
            };
        }

        if (role) {
            query["employmentInfo.role"] =
                role;
        }

        if (department) {
            query[
                "employmentInfo.department"
            ] = department;
        }

        const total =
            await Staff.countDocuments(
                query
            );

        const staff = await Staff.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({
                createdAt: -1,
            });

        res.status(200).json({
            success: true,
            total,
            page,
            totalPages: Math.ceil(
                total / limit
            ),
            data: staff,
        });
    } catch (error) {
        console.error(
            "GET ALL STAFF ERROR:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getStaffById = async (
    req,
    res
) => {
    try {
        const staff = await Staff.findOne({

            _id: req.params.id,

            clinicId: req.user.clinicId

        }).populate(
            "employmentInfo.reportingTo",
            "personalInfo.fullName"
        );

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found",
            });
        }

        res.status(200).json({
            success: true,
            data: staff,
        });
    } catch (error) {
        console.error(
            "GET STAFF BY ID ERROR:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const updateStaff = async (req, res) => {
    try {


        console.log("Form data - >>>>", req.body);
        const existingStaff = await Staff.findOne({
            _id: req.params.id,
            clinicId: req.user.clinicId,
        });

        if (!existingStaff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found",
            });
        }

        const personalInfo = req.body.personalInfo
            ? JSON.parse(req.body.personalInfo)
            : {};

        const employmentInfo = req.body.employmentInfo
            ? JSON.parse(req.body.employmentInfo)
            : {};

        const accountInfo = req.body.accountInfo
            ? JSON.parse(req.body.accountInfo)
            : {};

        const bankDetails = req.body.bankDetails
            ? JSON.parse(req.body.bankDetails)
            : {};

        const moduleAccess = req.body.moduleAccess
            ? JSON.parse(req.body.moduleAccess)
            : {};

        if (personalInfo.email) {
            const normalizedEmail = personalInfo.email.trim().toLowerCase();

            if (!emailRegex.test(normalizedEmail)) {
                return res.status(400).json({
                    success: false,
                    message: "A valid staff email is required",
                });
            }

            personalInfo.email = normalizedEmail;
        }

        const updateData = {
            personalInfo: {
                ...existingStaff.personalInfo.toObject(),
                ...personalInfo,
            },

            employmentInfo: {
                ...existingStaff.employmentInfo.toObject(),
                ...employmentInfo,
            },

            accountInfo: {
                ...existingStaff.accountInfo.toObject(),
                ...accountInfo,
            },

            bankDetails: {
                ...existingStaff.bankDetails.toObject(),
                ...bankDetails,
            },

            moduleAccess: {
                ...existingStaff.moduleAccess.toObject(),
                ...moduleAccess,
            },
        };

        // Profile photo update (optional)
        if (req.file) {
            updateData.personalInfo.profilePhoto =
                req.file.path;
        }

        const updatedStaff = await Staff.findOneAndUpdate(
            {
                _id: req.params.id,
                clinicId: req.user.clinicId,
            },
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedStaff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Staff updated successfully",
            data: updatedStaff,
        });

    } catch (error) {

        console.error(
            "UPDATE STAFF ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const deleteStaff = async (
    req,
    res
) => {
    try {
        const staff = await Staff.findOneAndUpdate(

            {
                _id: req.params.id,
                clinicId: req.user.clinicId
            },
            {
                isDeleted: true
            }

        );

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            });

        }

        res.status(200).json({
            success: true,
            message:
                "Staff deleted successfully",
        });
    } catch (error) {
        console.error(
            "DELETE STAFF ERROR:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getManagers = async (
    req,
    res
) => {
    try {
        const managers =
            await Staff.find(
                {
                    clinicId: req.user.clinicId,
                    isDeleted: false,
                },
                {
                    "personalInfo.fullName": 1,
                    "employmentInfo.staffId": 1,
                    "employmentInfo.role": 1,
                }
            );

        res.status(200).json({
            success: true,
            data: managers,
        });
    } catch (error) {
        console.error(
            "GET MANAGERS ERROR:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.getDoctorStaff = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;

        const doctors = await Staff.find({
            "employmentInfo.role": "Doctor",
            clinicId,
        }).select(
            "personalInfo.fullName personalInfo.mobileNumber personalInfo.email employmentInfo.staffId"
        );

        return res.status(200).json({
            success: true,
            data: doctors,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.createStaff = createStaff;
exports.getAllStaff = getAllStaff;
exports.getStaffById = getStaffById;
exports.updateStaff = updateStaff;
exports.deleteStaff = deleteStaff;
exports.getManagers = getManagers;
