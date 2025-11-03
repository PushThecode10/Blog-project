import multer from "multer";

// Memory storage (keeps file in buffer, useful for Cloudinary, etc.)
const storage = multer.memoryStorage();

// ✅ Allow all file types (no filtering)
const fileFilter = (req, file, cb) => {
  cb(null, true); // Accept any file
};

// Optional: Increase file size limit if you expect larger files
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max size
});

export default upload;
