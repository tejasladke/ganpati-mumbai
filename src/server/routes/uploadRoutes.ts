import { Router } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert file buffer to base64 data URL
    const b64 = req.file.buffer.toString('base64');
    const mime = req.file.mimetype;
    const url = `data:${mime};base64,${b64}`;

    return res.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Failed to process image upload' });
  }
});

export default router;
