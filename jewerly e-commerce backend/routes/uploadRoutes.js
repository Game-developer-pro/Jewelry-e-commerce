const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Allowed MIME types for jewelry product photos
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

// Multer storage — memory, with file type + size restrictions
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and AVIF images are allowed.'));
    }
  },
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary using upload_stream
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'jewelry-products' },
      (error, result) => {
        if (error) {
          console.error('Upload Error:', error);
          return res.status(500).json({ message: 'Upload failed', error: error.message });
        }
        res.status(200).json({
          message: 'Image uploaded successfully',
          url: result.secure_url,
        });
      }
    );
    
    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Server error during upload', error: error.message });
  }
});

// Multer error handler — returns JSON instead of crashing
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('Invalid file type')) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
