import { Router } from 'express';
import multer, { StorageEngine } from 'multer';
import { uploadFile, getFileById } from '../controllers/fileController';
import path from 'path';

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files to the 'uploads' folder
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Rename file to ensure uniqueness
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage });

const router: Router = Router();

// Upload a File
router.post('/upload', upload.single('file'), uploadFile);

// Get a File by ID
router.get('/file/:id', getFileById);

export default router;
