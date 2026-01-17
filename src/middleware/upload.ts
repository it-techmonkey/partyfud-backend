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

// Create a dedicated multer instance for caterer documents to avoid conflicts
const catererDocumentsUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
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

// Multiple fields with single file per field middleware
// Handles food_license and Registration fields, each can have only ONE file
// IMPORTANT: upload.fields() MUST receive an array, not an object
// This is the CORRECT way - Multer internally does fields.map(), so it MUST be an array
export const uploadCatererDocuments = (req: Request, res: Response, next: NextFunction): void => {
  // Define fields as an array - this is CRITICAL for Multer to work
  // DO NOT use an object like { food_license: 1, Registration: 1 } - that will cause "e.map is not a function"
  // maxCount: 1 means only ONE file can be uploaded per field
  // gallery_images can have multiple files (max 10)
  const fieldsArray = [
    { name: 'food_license', maxCount: 1 },
    { name: 'Registration', maxCount: 1 },
    { name: 'gallery_images', maxCount: 10 },
  ];
  
  // Create the middleware using fields() with the array
  const uploadMiddleware = catererDocumentsUpload.fields(fieldsArray);
  
  // Execute the middleware
  uploadMiddleware(req, res, (err) => {
    if (err) {
      handleMulterError(err, req, res, next);
      return;
    }
    
    // Ensure files object exists (multer creates it, but safety check)
    if (!(req as any).files) {
      (req as any).files = {};
    }
    
    // Debug: Log files structure (can be removed in production)
    if (process.env.NODE_ENV !== 'production') {
      const foodLicenseCount = Array.isArray((req as any).files?.food_license) 
        ? (req as any).files.food_license.length 
        : ((req as any).files?.food_license ? 1 : 0);
      const registrationCount = Array.isArray((req as any).files?.Registration) 
        ? (req as any).files.Registration.length 
        : ((req as any).files?.Registration ? 1 : 0);
      console.log('Uploaded files structure:', {
        food_license: foodLicenseCount,
        Registration: registrationCount,
      });
    }
    
    next();
  });
};

