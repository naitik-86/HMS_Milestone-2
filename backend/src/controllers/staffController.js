const bcrypt = require("bcrypt");
const Staff = require("../models/Staff.js");

const generateStaffId = require("../utils/generateStaffId.js");
const generateUsername = require("../utils/generateUsername.js");
const generatePassword = require("../utils/generatePassword.js");

const createStaff = async (req, res) => {
    try {
        const personalInfo = req.body.personalInfo
            ? JSON.parse(req.body.personalInfo)
            : {};

        const employmentInfo = req.body.employmentInfo
            ? JSON.parse(req.body.employmentInfo)
            : {};

        const moduleAccess = req.body.moduleAccess
            ? JSON.parse(req.body.moduleAccess)
            : {};

        const accountInfo = req.body.accountInfo
            ? JSON.parse(req.body.accountInfo)
            : {};

        const existingEmail = await Staff.findOne({
            "personalInfo.email": personalInfo.email,
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
            personalInfo: {
                ...personalInfo,
                profilePhoto: req.file?.path || "",
            },

            employmentInfo: {
                ...employmentInfo,
                staffId,
            },

            moduleAccess,

            accountInfo: {
                ...accountInfo,
                username,
                temporaryPassword,
                password: hashedPassword,
            },
        });

        const staffResponse = newStaff.toObject();

        delete staffResponse.accountInfo.password;

        res.status(201).json({
            success: true,
            message: "Staff created successfully",
            username,
            temporaryPassword,
            data: staffResponse,
        });
    } catch (error) {
        console.error(
            "CREATE STAFF ERROR:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
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
            .populate(
                "employmentInfo.reportingTo",
                "personalInfo.fullName"
            )
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
        const staff =
            await Staff.findById(
                req.params.id
            ).populate(
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

const updateStaff = async (
    req,
    res
) => {
    try {
        const updatedStaff =
            await Staff.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                }
            );

        res.status(200).json({
            success: true,
            data: updatedStaff,
        });
    } catch (error) {
        console.error(
            "UPDATE STAFF ERROR:",
            error.message
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
        await Staff.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true,
            }
        );

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
                    isDeleted: false,
                },
                {
                    "personalInfo.fullName": 1,
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

exports.createStaff = createStaff;
exports.getAllStaff = getAllStaff;
exports.getStaffById = getStaffById;
exports.updateStaff = updateStaff;
exports.deleteStaff = deleteStaff;
exports.getManagers = getManagers;