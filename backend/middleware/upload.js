const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-")
      .toLowerCase();
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const imageFilter = (req, file, cb) => {
  if (/^image\/(jpeg|png|webp|gif|bmp)$/.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const limits = { fileSize: 5 * 1024 * 1024 };

const uploader = multer({ storage, fileFilter: imageFilter, limits });

function single(fieldName = "image") {
  return uploader.single(fieldName);
}

function array(fieldName = "images", maxCount = 5) {
  return uploader.array(fieldName, maxCount);
}

function fields(fieldsArray = []) {
  return uploader.fields(fieldsArray);
}

module.exports = { uploader, single, array, fields, UPLOAD_DIR };
