import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./auth.services";
import prisma from "../../lib/prisma";

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
 * Fetches the current user type from database to handle cases where
 * the user's role changed after the JWT was issued (e.g., after onboarding)
 */
export const requireRole = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    try {
      // Fetch the current user type from database
      // This handles cases where the user's type changed after the JWT was issued
      const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { type: true },
      });

      if (!dbUser) {
        res.status(401).json({
          success: false,
          error: {
            message: "User not found",
          },
        });
        return;
      }

      // Update the user object with the current type from database
      (req as any).user.type = dbUser.type;

      if (!allowedRoles.includes(dbUser.type)) {
        res.status(403).json({
          success: false,
          error: {
            message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
          },
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Error checking user role:", error);
      res.status(500).json({
        success: false,
        error: {
          message: "Internal server error",
        },
      });
    }
  };
};

