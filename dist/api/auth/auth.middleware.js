"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticate = void 0;
const auth_services_1 = require("./auth.services");
/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                error: {
                    message: "No token provided. Please include 'Authorization: Bearer <token>' header",
                },
            });
            return;
        }
        const token = authHeader.substring(7); // Remove "Bearer " prefix
        // Verify token
        const decoded = (0, auth_services_1.verifyToken)(token);
        // Attach user info to request
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: {
                message: error.message || "Invalid or expired token",
            },
        });
    }
};
exports.authenticate = authenticate;
/**
 * Middleware to check if user has specific role
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                error: {
                    message: "Unauthorized",
                },
            });
            return;
        }
        if (!allowedRoles.includes(user.type)) {
            res.status(403).json({
                success: false,
                error: {
                    message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
                },
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
