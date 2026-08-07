const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

// Mirrors uploadClinicDocuments.js - the veterinarian create/update routes
// previously used the plain multer.memoryStorage() upload from
// middlewares/uploads.js, which never persists the uploaded bytes anywhere.
// Only file.originalname (e.g. "main-app.pdf") survived into the saved
// record, so profile photo / government ID / degree certificates / vet
// council registration certificate had no real file to link to - the
// Veterinarian Profile "view" links had nothing to open. Using the same
// S3-backed storage as Clinic documents gives each upload a real, unique,
// publicly-fetchable URL (file.location) instead.
let upload;

if (process.env.S3_BUCKET) {
  const multerS3 = require("multer-s3");
  const { S3Client } = require("@aws-sdk/client-s3");
  const s3 = new S3Client({ region: process.env.AWS_REGION });
  const storage = multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `hms-veterinarians/${Date.now()}-${crypto.randomUUID()}${ext}`);
    },
  });
  upload = multer({ storage });
} else {
  upload = multer({ storage: multer.memoryStorage() });
}

module.exports = upload;
