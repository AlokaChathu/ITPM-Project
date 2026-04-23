import express from 'express';
import multer from 'multer';
import userAuth from '../middleware/userAuth.js';
import {
  uploadReport,
  updateReport,
  deleteReport,
  getAllReports,
  getStudentReport,
  downloadReport,
  updateReportGrade
} from '../controllers/reportController.js';

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Middleware to handle file upload
const handleUpload = (req, res, next) => {
  upload.single('report')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File size exceeds 10MB limit' });
      }
      if (err.message === 'Only PDF files are allowed') {
        return res.status(400).json({ success: false, message: 'Only PDF files are allowed' });
      }
      return res.status(500).json({ success: false, message: 'File upload error' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    next();
  });
};

// Routes
router.post('/upload', userAuth, handleUpload, uploadReport);
router.put('/update/:id', userAuth, handleUpload, updateReport);
router.delete('/:id', userAuth, deleteReport);
router.get('/all', getAllReports);
router.get('/student', userAuth, getStudentReport);
router.get('/download/:id', downloadReport);
router.put('/grade/:id', updateReportGrade);

export default router;
