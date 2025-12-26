import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./auth.services";

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const decoded = verifyToken(token);

    // Attach user info to request
    (req as any).user = decoded;

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: {
        message: error.message || "Invalid or expired token",
      },
    });
  }
};

/**
 * Middleware to check if user has specific role
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

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

