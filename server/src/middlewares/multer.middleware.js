import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure the upload directory exists
const tempDir = path.join(process.cwd(), "./Public/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Prevent overwrites
  },
});

export const upload = multer({ storage });
