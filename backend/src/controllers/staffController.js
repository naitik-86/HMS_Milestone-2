const bcrypt = require("bcrypt");
const Staff = require("../models/Staff.js");

const generateStaffId = require("../utils/generateStaffId.js");
const generateUsername = require("../utils/generateUsername.js");
const generatePassword = require("../utils/generatePassword.js");
const sendEmail = require("../utils/emailService.js");
const { credentialEmail } = require("../utils/emailTemplates.js");
const ClinicAdmin = require("../models/ClinicAdmin.js");
const Clinic = require("../models/Clinic.js");
const User = require("../models/User.js");
const DoctorDetails = require("../models/DoctorDetails.js");
const LabTechnician = require("../models/LabTechnician.js");
const GroomerModel = require("../models/GroomerModel.js");
const KennelModel = require("../models/KennelModel.js");
const LoginOtp = require("../models/LoginOtp.js");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeRoles = (roles, fallbackRole = '') => [...new Set(
    (Array.isArray(roles) ? roles : [roles, fallbackRole])
        .filter(Boolean)
        .map((role) => String(role).trim())
        .filter(Boolean)
)];

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

        const clinicForLimit = await Clinic.findById(req.user.clinicId).select("licenseLimits");
        const maxStaff = clinicForLimit?.licenseLimits?.maxStaff;
        if (Number.isFinite(maxStaff)) {
            const currentStaffCount = await Staff.countDocuments({ clinicId: req.user.clinicId });
            if (currentStaffCount >= maxStaff) {
                return res.status(403).json({
                    success: false,
                    message: `This clinic's plan allows a maximum of ${maxStaff} staff member(s). Upgrade the plan to add more.`,
                });
            }
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

        // "Reporting To" is optional - an empty string from the form can't be
        // cast to an ObjectId, so it must become null rather than being sent
        // to Staff.create() as-is. Mirrors the same normalization already
        // done in updateStaff.
        if (!employmentInfo.reportingTo || employmentInfo.reportingTo.trim() === "") {
            employmentInfo.reportingTo = null;
        } else {
            const reportingStaff = await Staff.findOne({
                _id: employmentInfo.reportingTo,
                clinicId: req.user.clinicId,
            });

            if (!reportingStaff) {
                employmentInfo.reportingTo = null;
            }
        }

        if (!personalInfo.fullName || !personalInfo.email || !personalInfo.mobileNumber || !personalInfo.dateOfBirth) {
            return res.status(400).json({
                success: false,
                message: "Full name, email, mobile number, and date of birth are required",
            });
        }

        const assignedRoles = normalizeRoles(employmentInfo.roles, employmentInfo.role);

        if (!assignedRoles.length) {
            return res.status(400).json({
                success: false,
                message: "Staff role is required",
            });
        }

        employmentInfo.roles = assignedRoles;
        employmentInfo.role = assignedRoles[0];

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
        personalInfo.mobileNumber = String(personalInfo.mobileNumber || '').replace(/\D/g, '').slice(0, 10);

        if (!phoneRegex.test(personalInfo.mobileNumber)) {
            return res.status(400).json({ success: false, message: "A valid 10-digit staff mobile number is required" });
        }

        const [emailInUse, phoneInUse] = await Promise.all([
            Promise.all([
                Clinic.findOne({ $or: [{ email: normalizedEmail }, { contactEmail: normalizedEmail }, { 'adminDetails.adminEmail': normalizedEmail }] }),
                ClinicAdmin.findOne({ email: normalizedEmail }),
                User.findOne({ email: normalizedEmail }),
            ]).then((matches) => matches.some(Boolean)),
            Promise.all([
                Clinic.findOne({ $or: [{ phone: personalInfo.mobileNumber }, { altPhone: personalInfo.mobileNumber }, { 'adminDetails.adminPhone': personalInfo.mobileNumber }] }),
                User.findOne({ mobile: personalInfo.mobileNumber }),
                Staff.findOne({ 'personalInfo.mobileNumber': personalInfo.mobileNumber }),
            ]).then((matches) => matches.some(Boolean)),
        ]);

        if (emailInUse) return res.status(409).json({ success: false, field: 'email', message: 'This email is already being used.' });
        if (phoneInUse) return res.status(409).json({ success: false, field: 'mobileNumber', message: 'This phone number is already being used.' });

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
                ...credentialEmail({
                    name: personalInfo.fullName,
                    email: normalizedEmail,
                    password: temporaryPassword,
                    accountLabel: `staff account (Staff ID: ${staffId}, Username: ${username})`,
                }),
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
            // Same primary-role-only gap as getDoctorStaff above - match
            // against the full multi-role array too, so filtering by e.g.
            // "Doctor" also surfaces a staff member whose Doctor role isn't
            // first in their assigned roles list.
            query.$or = [
                { "employmentInfo.roles": role },
                { "employmentInfo.role": role },
            ];
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
            .populate({
                path: "employmentInfo.reportingTo",
                select: "personalInfo.fullName employmentInfo.staffId",
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        console.log(staff);


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

        if (employmentInfo.roles !== undefined || employmentInfo.role !== undefined) {
            const assignedRoles = normalizeRoles(
                employmentInfo.roles,
                employmentInfo.role || existingStaff.employmentInfo.role
            );

            if (!assignedRoles.length) {
                return res.status(400).json({ success: false, message: "At least one staff role is required" });
            }

            employmentInfo.roles = assignedRoles;
            employmentInfo.role = assignedRoles[0];
        }

        if (!employmentInfo.reportingTo || employmentInfo.reportingTo.trim() === "") {
            employmentInfo.reportingTo = null;
        } else {
            const reportingStaff = await Staff.findOne({
                _id: employmentInfo.reportingTo,
                clinicId: req.user.clinicId,
            });

            if (!reportingStaff) {
                employmentInfo.reportingTo = null;
            }
        }

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

const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findOneAndDelete({
            _id: req.params.id,
            clinicId: req.user.clinicId,
        });

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found",
            });
        }

        // A staff member enrolled under a role-specific module (Doctor, Lab
        // Technician, Groomer, Kennel) has a linked detail record there -
        // deleting the staff account without also removing these left
        // orphaned entries behind in every one of those lists. DoctorDetails
        // and KennelModel link by the Staff ObjectId; LabTechnician and
        // GroomerModel only ever stored the human-readable staffId string
        // (e.g. "STF0001"), not a real reference, so those two match on
        // employmentInfo.staffId instead. LoginOtp challenges for this
        // account are also cleared so nothing tied to the deleted login
        // remains queryable anywhere.
        const staffCode = staff.employmentInfo?.staffId;

        await Promise.all([
            DoctorDetails.deleteOne({
                staff: staff._id,
                clinicId: req.user.clinicId,
            }),
            KennelModel.deleteOne({
                staffId: staff._id,
                clinicId: req.user.clinicId,
            }),
            staffCode
                ? LabTechnician.deleteOne({
                      employeeId: staffCode,
                      clinicId: req.user.clinicId,
                  })
                : Promise.resolve(),
            staffCode
                ? GroomerModel.deleteOne({
                      employeeId: staffCode,
                      clinicId: req.user.clinicId,
                  })
                : Promise.resolve(),
            LoginOtp.deleteMany({
                userType: "STAFF",
                userId: staff._id,
            }),
        ]);

        return res.status(200).json({
            success: true,
            message: "Staff deleted permanently",
        });
    } catch (error) {
        console.error("DELETE STAFF ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Deliberately its own tiny endpoint rather than routing an Active/Inactive
// toggle through updateStaff - that endpoint expects the full staff form
// payload (buildStaffFormData on the frontend always sends every section),
// so a bare {accountActive} call through it would blank out roles and
// module access by overwriting them with empty defaults. This only ever
// touches accountInfo.accountActive.
const toggleStaffStatus = async (req, res) => {
    try {
        const { accountActive } = req.body || {};

        if (typeof accountActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "accountActive (true/false) is required",
            });
        }

        const staff = await Staff.findOneAndUpdate(
            {
                _id: req.params.id,
                clinicId: req.user.clinicId,
            },
            { "accountInfo.accountActive": accountActive },
            { new: true }
        );

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: `Staff marked ${accountActive ? "Active" : "Inactive"}`,
            data: staff,
        });
    } catch (error) {
        console.error("TOGGLE STAFF STATUS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getManagers = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;

        const [managers, clinicAdmin, clinic] = await Promise.all([
            Staff.find(
                {
                    clinicId,
                    isDeleted: false,
                },
                {
                    "personalInfo.fullName": 1,
                    "employmentInfo.staffId": 1,
                    "employmentInfo.role": 1,
                }
            ),
            ClinicAdmin.findOne({ clinicId }).select("_id"),
            Clinic.findById(clinicId).select("adminDetails.adminName"),
        ]);

        const data = [...managers];

        if (clinicAdmin) {
            data.unshift({
                _id: clinicAdmin._id,
                personalInfo: {
                    fullName: clinic?.adminDetails?.adminName || "Clinic Admin",
                },
                employmentInfo: {
                    role: "CLINIC_ADMIN",
                },
            });
        }

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("GET MANAGERS ERROR:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.checkStaffContactAvailability = async (req, res) => {
    try {
        const normalizedEmail = typeof req.query?.email === "string"
            ? req.query.email.trim().toLowerCase()
            : "";
        const normalizedPhone = String(req.query?.phone || "").replace(/\D/g, "").slice(0, 10);

        if (!normalizedEmail && !normalizedPhone) {
            return res.status(400).json({ success: false, message: "Email or phone number is required." });
        }

        const field = normalizedEmail ? "email" : "mobileNumber";
        const label = normalizedEmail ? "email" : "phone number";

        const inUse = normalizedEmail
            ? await Promise.all([
                Clinic.findOne({ $or: [{ email: normalizedEmail }, { contactEmail: normalizedEmail }, { 'adminDetails.adminEmail': normalizedEmail }] }).select('_id'),
                ClinicAdmin.findOne({ email: normalizedEmail }).select('_id'),
                User.findOne({ email: normalizedEmail }).select('_id'),
                Staff.findOne({ 'personalInfo.email': normalizedEmail }).select('_id'),
            ]).then((matches) => matches.some(Boolean))
            : await Promise.all([
                Clinic.findOne({ $or: [{ phone: normalizedPhone }, { altPhone: normalizedPhone }, { 'adminDetails.adminPhone': normalizedPhone }] }).select('_id'),
                User.findOne({ mobile: normalizedPhone }).select('_id'),
                Staff.findOne({ 'personalInfo.mobileNumber': normalizedPhone }).select('_id'),
            ]).then((matches) => matches.some(Boolean));

        return res.json({
            success: true,
            field,
            available: !inUse,
            message: inUse
                ? `This ${label} is already being used.`
                : `${label[0].toUpperCase()}${label.slice(1)} is available.`,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Unable to check contact availability." });
    }
};

exports.getDoctorStaff = async (req, res) => {
    try {
        const clinicId = req.user.clinicId;
        const { excludeDoctorId } = req.query;

        const completedQuery = { clinicId };
        if (excludeDoctorId) {
            completedQuery._id = { $ne: excludeDoctorId };
        }
        const completedDoctors = await DoctorDetails.find(completedQuery).select("staff");
        const completedStaffIds = completedDoctors.map((d) => d.staff.toString());

        // employmentInfo.role only ever holds the FIRST of a staff member's
        // assigned roles (see normalizeRoles/assignedRoles[0] above) - a
        // staff member with multiple roles where "Doctor" isn't first
        // (e.g. Receptionist, Pre-consultation Staff, Doctor) was silently
        // excluded from this list. Match against the full roles array too,
        // falling back to the legacy singular field for older records that
        // predate it.
        const doctors = await Staff.find({
            clinicId,
            $or: [
                { "employmentInfo.roles": "Doctor" },
                { "employmentInfo.role": "Doctor" },
            ],
            _id: { $nin: completedStaffIds },
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
exports.toggleStaffStatus = toggleStaffStatus;
