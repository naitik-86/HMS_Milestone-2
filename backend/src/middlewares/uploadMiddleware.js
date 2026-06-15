const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.js");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "hms-staff",
        allowed_formats: [
            // Images
            "jpg",
            "jpeg",
            "png",

            // Documents
            "pdf",
            "doc",
            "docx",

            // Excel
            "xls",
            "xlsx",
        ],
    }),
});

const upload = multer({ storage });

module.exports = {
    upload,
};