const path = require('path');
// Load environment variables (same path used by app.js)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


// Basic sanity check for required env vars (don't print secrets)
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
  console.warn('Warning: Cloudinary environment variables are not fully set. CLOUDINARY_CLOUD_NAME/CLOUDINARY_KEY/CLOUDINARY_SECRET are required for uploads.');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'wanderlust_dev',
    allowed_formats: ['jpeg', 'png', 'jpg', 'gif']
  }
});

const fs = require('fs');
// If Cloudinary env vars are missing, fall back to local disk storage so uploads still work in dev
let upload;
// Allow configurable max upload size (bytes) via env; default to 20 MB
const MAX_UPLOAD_SIZE_BYTES = parseInt(process.env.MAX_UPLOAD_SIZE_BYTES, 10) || 20 * 1024 * 1024;

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
  console.warn('Cloudinary not configured — falling back to local disk storage (uploads/).');
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
      cb(null, uniqueSuffix + '-' + safeName);
    }
  });
  upload = multer({ storage: diskStorage, limits: { fileSize: MAX_UPLOAD_SIZE_BYTES } });
} else {
  upload = multer({ storage, limits: { fileSize: MAX_UPLOAD_SIZE_BYTES } });
}

module.exports = { cloudinary, storage, upload };
