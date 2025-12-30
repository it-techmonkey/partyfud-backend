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
    // Allow images, PDFs, and common document types
    const allowedMimeTypes = [
      'image/',           // All image types (jpg, png, gif, webp, etc.)
      'application/pdf',  // PDF files
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/plain',      // .txt
      'text/csv',        // .csv
    ];
    
    const isAllowed = allowedMimeTypes.some(type => 
      file.mimetype.startsWith(type) || file.mimetype === type
    );
    
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed. Allowed types: images, PDF, Word, Excel, text files`));
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

// Multiple fields with multiple files middleware
// Handles food_license and Registration fields, each can have multiple files
export const uploadCatererDocuments = (req: Request, res: Response, next: NextFunction): void => {
  const uploadMiddleware = upload.fields([
    { name: 'food_license', maxCount: 10 },
    { name: 'Registration', maxCount: 10 },
  ]);
  uploadMiddleware(req, res, (err) => {
    if (err) {
      handleMulterError(err, req, res, next);
      return;
    }
    next();
  });
};

