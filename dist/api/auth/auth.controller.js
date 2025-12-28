"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logout = exports.login = exports.signup = void 0;
const authService = __importStar(require("./auth.services"));
const cloudinary_1 = require("../../lib/cloudinary");
/**
 * Signup controller
 * POST /api/auth/signup
 */
const signup = async (req, res, next) => {
    try {
        const { first_name, last_name, phone, email, password, company_name, type, } = req.body;
        // Validate required fields
        if (!first_name ||
            !last_name ||
            !phone ||
            !email ||
            !password ||
            !type) {
            res.status(400).json({
                success: false,
                error: {
                    message: "Missing required fields",
                },
            });
            return;
        }
        // Validate user type
        if (!["USER", "ADMIN", "CATERER"].includes(type)) {
            res.status(400).json({
                success: false,
                error: {
                    message: "Invalid user type. Must be USER, ADMIN, or CATERER",
                },
            });
            return;
        }
        // Validate password length
        if (password.length < 6) {
            res.status(400).json({
                success: false,
                error: {
                    message: "Password must be at least 6 characters long",
                },
            });
            return;
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                success: false,
                error: {
                    message: "Invalid email format",
                },
            });
            return;
        }
        // Company name is required for CATERER
        if (type === "CATERER" && !company_name) {
            res.status(400).json({
                success: false,
                error: {
                    message: "Company name is required for caterer accounts",
                },
            });
            return;
        }
        // Handle image upload if provided
        let image_url = req.body.image_url; // Fallback to URL if provided
        if (req.file) {
            try {
                image_url = await (0, cloudinary_1.uploadToCloudinary)(req.file, 'partyfud/users');
            }
            catch (uploadError) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: `Image upload failed: ${uploadError.message}`,
                    },
                });
                return;
            }
        }
        const result = await authService.signup({
            first_name,
            last_name,
            phone,
            email,
            password,
            company_name,
            type,
            image_url,
        });
        res.status(201).json({
            success: true,
            data: result,
            message: "User registered successfully",
        });
    }
    catch (error) {
        if (error.message === "User with this email already exists") {
            res.status(409).json({
                success: false,
                error: {
                    message: error.message,
                },
            });
        }
        else {
            next(error);
        }
    }
};
exports.signup = signup;
/**
 * Login controller
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: {
                    message: "Email and password are required",
                },
            });
            return;
        }
        const result = await authService.login({ email, password });
        res.status(200).json({
            success: true,
            data: result,
            message: "Login successful",
        });
    }
    catch (error) {
        if (error.message === "Invalid email or password" ||
            error.message === "User not found") {
            res.status(401).json({
                success: false,
                error: {
                    message: "Invalid email or password",
                },
            });
        }
        else {
            next(error);
        }
    }
};
exports.login = login;
/**
 * Logout controller
 * POST /api/auth/logout
 * Note: With JWT, logout is typically handled client-side by removing the token
 * This endpoint can be used for logging/logging out activity
 */
const logout = async (req, res, next) => {
    try {
        // With JWT tokens, logout is typically handled client-side
        // by removing the token from storage. However, we can log the logout event
        // or implement token blacklisting if needed in the future.
        res.status(200).json({
            success: true,
            message: "Logout successful. Please remove the token from client storage.",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
/**
 * Get current user (me)
 * GET /api/auth/me
 * Requires authentication middleware
 */
const getCurrentUser = async (req, res, next) => {
    try {
        // This will be populated by auth middleware
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                error: {
                    message: "Unauthorized",
                },
            });
            return;
        }
        const user = await authService.getUserById(userId);
        res.status(200).json({
            success: true,
            data: { user },
        });
    }
    catch (error) {
        if (error.message === "User not found") {
            res.status(404).json({
                success: false,
                error: {
                    message: error.message,
                },
            });
        }
        else {
            next(error);
        }
    }
};
exports.getCurrentUser = getCurrentUser;
