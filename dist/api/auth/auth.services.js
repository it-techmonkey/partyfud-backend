"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.verifyToken = exports.generateToken = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
/**
 * Sign up a new user
 */
const signup = async (data) => {
    // Check if user already exists
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    // Hash password
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    // Create user
    const user = await prisma_1.default.user.create({
        data: {
            ...data,
            password: hashedPassword,
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            company_name: true,
            type: true,
            created_at: true,
        },
    });
    // Generate JWT token
    const token = (0, exports.generateToken)({
        userId: user.id,
        email: user.email,
        type: user.type,
    });
    return {
        user,
        token,
    };
};
exports.signup = signup;
/**
 * Login user
 */
const login = async (data) => {
    // Find user by email
    const user = await prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    // Verify password
    const isPasswordValid = await bcrypt_1.default.compare(data.password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    // Generate JWT token
    const token = (0, exports.generateToken)({
        userId: user.id,
        email: user.email,
        type: user.type,
    });
    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        token,
    };
};
exports.login = login;
/**
 * Generate JWT token
 */
const generateToken = (payload) => {
    // Type assertion needed due to jsonwebtoken type definitions
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};
exports.generateToken = generateToken;
/**
 * Verify JWT token
 */
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error("Invalid or expired token");
    }
};
exports.verifyToken = verifyToken;
/**
 * Get user by ID
 */
const getUserById = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            company_name: true,
            image_url: true,
            type: true,
            created_at: true,
            updated_at: true,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
exports.getUserById = getUserById;
