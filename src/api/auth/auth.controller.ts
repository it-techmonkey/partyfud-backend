import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.services";

/**
 * Signup controller
 * POST /api/auth/signup
 */
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      first_name,
      last_name,
      phone,
      email,
      password,
      company_name,
      type,
    } = req.body;

    // Validate required fields
    if (
      !first_name ||
      !last_name ||
      !phone ||
      !email ||
      !password ||
      !type
    ) {
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

    const result = await authService.signup({
      first_name,
      last_name,
      phone,
      email,
      password,
      company_name,
      type,
    });

    res.status(201).json({
      success: true,
      data: result,
      message: "User registered successfully",
    });
  } catch (error: any) {
    if (error.message === "User with this email already exists") {
      res.status(409).json({
        success: false,
        error: {
          message: error.message,
        },
      });
    } else {
      next(error);
    }
  }
};

/**
 * Login controller
 * POST /api/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
  } catch (error: any) {
    if (
      error.message === "Invalid email or password" ||
      error.message === "User not found"
    ) {
      res.status(401).json({
        success: false,
        error: {
          message: "Invalid email or password",
        },
      });
    } else {
      next(error);
    }
  }
};

/**
 * Logout controller
 * POST /api/auth/logout
 * Note: With JWT, logout is typically handled client-side by removing the token
 * This endpoint can be used for logging/logging out activity
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // With JWT tokens, logout is typically handled client-side
    // by removing the token from storage. However, we can log the logout event
    // or implement token blacklisting if needed in the future.

    res.status(200).json({
      success: true,
      message: "Logout successful. Please remove the token from client storage.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user (me)
 * GET /api/auth/me
 * Requires authentication middleware
 */
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // This will be populated by auth middleware
    const userId = (req as any).user?.userId;

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
  } catch (error: any) {
    if (error.message === "User not found") {
      res.status(404).json({
        success: false,
        error: {
          message: error.message,
        },
      });
    } else {
      next(error);
    }
  }
};

