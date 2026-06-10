import { body } from "express-validator";

export const createStaffValidation = [
    body("personalInfo.fullName")
        .notEmpty()
        .withMessage("Name required"),

    body("personalInfo.email")
        .isEmail()
        .withMessage("Invalid email"),

    body("roleInfo.role")
        .notEmpty()
        .withMessage("Role required"),
];