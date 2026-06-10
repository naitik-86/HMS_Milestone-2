import bcrypt from "bcryptjs";
import Staff from "../models/Staff.js";

import generateStaffId from "../utils/generateStaffId.js";
import generateUsername from "../utils/generateUsername.js";
import generatePassword from "../utils/generatePassword.js";

export const createStaff = async (req, res) => {
    try {
        const {
            personalInfo,
            employmentInfo,
            moduleAccess,
            accountInfo,
        } = req.body;

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

        const temporaryPassword =
            generatePassword();

        const hashedPassword =
            await bcrypt.hash(
                temporaryPassword,
                10
            );

        const newStaff = await Staff.create({
            personalInfo: {
                ...personalInfo,
                profilePhoto:
                    req.file?.path || "",
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

        res.status(201).json({
            success: true,
            message:
                "Staff created successfully",
            username,
            temporaryPassword,
            data: newStaff,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllStaff = async (
    req,
    res
) => {
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
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getStaffById = async (
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
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateStaff = async (
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
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteStaff = async (
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
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getManagers = async (
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
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};