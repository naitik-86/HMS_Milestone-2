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

const pdfOnlyFields = new Set([
    "degreeCertificates",
    "registrationCertificate",
    "doctorLetterhead",
]);

const imageOnlyFields = new Set([
    "profilePhoto",
    "digitalSignature",
]);

const fileFilter = (req, file, cb) => {
    if (pdfOnlyFields.has(file.fieldname)) {
        if (file.mimetype === "application/pdf") {
            return cb(null, true);
        }

        return cb(new Error(`${file.fieldname} must be a PDF file`));
    }

    if (imageOnlyFields.has(file.fieldname)) {
        if (file.mimetype.startsWith("image/")) {
            return cb(null, true);
        }

        return cb(new Error(`${file.fieldname} must be an image file`));
    }

    return cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
