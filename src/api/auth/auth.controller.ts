import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.services";
import { uploadToCloudinary, uploadFileToCloudinary } from "../../lib/cloudinary";

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

    // Handle image upload if provided
    let image_url: string | undefined = req.body.image_url; // Fallback to URL if provided
    
    if ((req as any).file) {
      try {
        image_url = await uploadToCloudinary((req as any).file, 'partyfud/users');
      } catch (uploadError: any) {
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

/**
 * Create caterer info controller
 * POST /api/auth/caterer-info
 * Requires authentication - used after caterer signup
 */
export const catererInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get user from authenticated request
    const userId = (req as any).user?.userId;
    const userType = (req as any).user?.type;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized. Please authenticate first.",
        },
      });
      return;
    }

    // Verify user is a caterer
    if (userType !== "CATERER") {
      res.status(403).json({
        success: false,
        error: {
          message: "Only caterers can create caterer info",
        },
      });
      return;
    }

    const {
      business_name,
      business_type,
      business_description,
      service_area,
      minimum_guests,
      maximum_guests,
      cuisine_types,
      region,
      delivery_only,
      delivery_plus_setup,
      full_service,
      staff,
      servers,
    } = req.body;

    // Handle file uploads for food_license and Registration
    const foodLicenseUrls: string[] = [];
    const registrationUrls: string[] = [];

    const files = (req as any).files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    // Upload food_license files if any
    if (files?.food_license && Array.isArray(files.food_license)) {
      try {
        for (const file of files.food_license) {
          const url = await uploadFileToCloudinary(file, 'partyfud/caterer-documents/food-license');
          foodLicenseUrls.push(url);
        }
      } catch (uploadError: any) {
        res.status(400).json({
          success: false,
          error: {
            message: `Food license file upload failed: ${uploadError.message}`,
          },
        });
        return;
      }
    }

    // Upload Registration files if any
    if (files?.Registration && Array.isArray(files.Registration)) {
      try {
        for (const file of files.Registration) {
          const url = await uploadFileToCloudinary(file, 'partyfud/caterer-documents/registration');
          registrationUrls.push(url);
        }
      } catch (uploadError: any) {
        res.status(400).json({
          success: false,
          error: {
            message: `Registration file upload failed: ${uploadError.message}`,
          },
        });
        return;
      }
    }

    // Validate required fields
    if (!business_name || !business_type) {
      res.status(400).json({
        success: false,
        error: {
          message: "business_name and business_type are required",
        },
      });
      return;
    }

    // Validate cuisine_types is an array
    if (!Array.isArray(cuisine_types)) {
      res.status(400).json({
        success: false,
        error: {
          message: "cuisine_types must be an array",
        },
      });
      return;
    }

    // Validate numeric fields if provided
    if (minimum_guests !== undefined && (isNaN(Number(minimum_guests)) || Number(minimum_guests) < 0)) {
      res.status(400).json({
        success: false,
        error: {
          message: "minimum_guests must be a positive number",
        },
      });
      return;
    }

    if (maximum_guests !== undefined && (isNaN(Number(maximum_guests)) || Number(maximum_guests) < 0)) {
      res.status(400).json({
        success: false,
        error: {
          message: "maximum_guests must be a positive number",
        },
      });
      return;
    }

    if (minimum_guests && maximum_guests && Number(minimum_guests) > Number(maximum_guests)) {
      res.status(400).json({
        success: false,
        error: {
          message: "minimum_guests cannot be greater than maximum_guests",
        },
      });
      return;
    }

    if (staff !== undefined && (isNaN(Number(staff)) || Number(staff) < 0)) {
      res.status(400).json({
        success: false,
        error: {
          message: "staff must be a positive number",
        },
      });
      return;
    }

    if (servers !== undefined && (isNaN(Number(servers)) || Number(servers) < 0)) {
      res.status(400).json({
        success: false,
        error: {
          message: "servers must be a positive number",
        },
      });
      return;
    }

    const result = await authService.createCatererInfo({
      business_name,
      business_type,
      business_description,
      service_area,
      minimum_guests: minimum_guests ? Number(minimum_guests) : undefined,
      maximum_guests: maximum_guests ? Number(maximum_guests) : undefined,
      cuisine_types,
      region,
      delivery_only: delivery_only !== undefined ? delivery_only === true || delivery_only === "true" : undefined,
      delivery_plus_setup: delivery_plus_setup !== undefined ? delivery_plus_setup === "true" || delivery_plus_setup === true : undefined,
      full_service: full_service !== undefined ? full_service === true || full_service === "true" : undefined,
      staff: staff ? Number(staff) : undefined,
      servers: servers ? Number(servers) : undefined,
      food_license: foodLicenseUrls,
      Registration: registrationUrls,
      caterer_id: userId,
    });

    res.status(201).json({
      success: true,
      data: result,
      message: "Caterer info created successfully",
    });
  } catch (error: any) {
    if (
      error.message === "User not found" ||
      error.message === "Only caterers can create caterer info" ||
      error.message === "Caterer info already exists. Use update endpoint instead."
    ) {
      res.status(400).json({
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

