"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = exports.handleMulterError = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Store files in memory
const storage = multer_1.default.memoryStorage();
// Configure multer
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit (increased from 5MB)
    },
    fileFilter: (req, file, cb) => {
        // Check if file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    },
});
// Error handling wrapper for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'File too large. Maximum file size is 10MB.',
                },
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Too many files uploaded.',
                },
            });
        }
        return res.status(400).json({
            success: false,
            error: {
                message: `Upload error: ${err.message}`,
            },
        });
    }
    if (err) {
        // Handle other errors (like fileFilter errors)
        return res.status(400).json({
            success: false,
            error: {
                message: err.message || 'File upload error',
            },
        });
    }
    next();
};
exports.handleMulterError = handleMulterError;
// Single file upload middleware with error handling
const uploadSingle = (req, res, next) => {
    const uploadMiddleware = exports.upload.single('image');
    uploadMiddleware(req, res, (err) => {
        if (err) {
            return (0, exports.handleMulterError)(err, req, res, next);
        }
        next();
    });
};
exports.uploadSingle = uploadSingle;
// Multiple files upload middleware (for future use)
exports.uploadMultiple = exports.upload.array('images', 10);
