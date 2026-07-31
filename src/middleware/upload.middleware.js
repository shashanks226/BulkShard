import multer from "multer";

// Configureing local storage for uploaded files
const storage = multer.diskStorage({
  destination: "uploads/",
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Allowing only CSV files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel",
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only CSV files are allowed."));
  }
  cb(null, true);
};

// Configure upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});