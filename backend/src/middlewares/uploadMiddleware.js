const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.js");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "hms-staff",
        allowed_formats: ["jpg", "jpeg", "png"],
    }),
});

const upload = multer({ storage });

module.exports = {
    upload,
};