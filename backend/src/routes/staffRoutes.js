import express from "express";

import {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
    getManagers,
} from "../controllers/staffController.js";

import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/* dropdown */

router.get(
    "/managers",
    getManagers
);

/* crud */

router.post(
    "/",
    upload.single("profilePhoto"),
    createStaff
);

router.get("/", getAllStaff);

router.get("/:id", getStaffById);

router.put("/:id", updateStaff);

router.delete("/:id", deleteStaff);

export default router;