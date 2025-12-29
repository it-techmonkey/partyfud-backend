import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Store files in memory
const storage = multer.memoryStorage();

// Configure multer
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (increased from 5MB)
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Error handling wrapper for multer
export const handleMulterError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        error: {
          message: 'File too large. Maximum file size is 10MB.',
        },
      });
      return;
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({
        success: false,
        error: {
          message: 'Too many files uploaded.',
        },
      });
      return;
    }
    res.status(400).json({
      success: false,
      error: {
        message: `Upload error: ${err.message}`,
      },
    });
    return;
  }
  if (err) {
    // Handle other errors (like fileFilter errors)
    res.status(400).json({
      success: false,
      error: {
        message: err.message || 'File upload error',
      },
    });
    return;
  }
  next();
};

// Single file upload middleware with error handling
export const uploadSingle = (req: Request, res: Response, next: NextFunction): void => {
  const uploadMiddleware = upload.single('image');
  uploadMiddleware(req, res, (err) => {
    if (err) {
      handleMulterError(err, req, res, next);
      return;
    }
    next();
  });
};

// Multiple files upload middleware (for future use)
export const uploadMultiple = upload.array('images', 10);

