const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.js");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {

        // file type detect
        let resourceType = "auto";

        if (file.mimetype.startsWith("image/")) {
            resourceType = "image";
        } else {
            resourceType = "raw"; // pdf, doc, excel
        }

        return {
            folder: "hms-staff",
            resource_type: resourceType,
            format: undefined, // let cloudinary decide
        };
    },
});

const upload = multer({ storage });

module.exports = upload;