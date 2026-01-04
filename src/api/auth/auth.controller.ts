import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.services";
import { uploadToCloudinary, uploadFileToCloudinary } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";

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
 * Create caterer info
 * POST /api/auth/caterer-info
 * Requires authentication middleware
 * Returns error if caterer info already exists
 */
export const createCatererInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log('🔵 [CREATE CATERER INFO] Request received');
  console.log('🔵 [CREATE CATERER INFO] Method:', req.method);
  console.log('🔵 [CREATE CATERER INFO] Headers:', JSON.stringify(req.headers, null, 2));
  
  try {
    // Get caterer_id from decoded token
    const catererId = (req as any).user?.userId;
    console.log('🔵 [CREATE CATERER INFO] Caterer ID from token:', catererId);

    if (!catererId) {
      console.log('❌ [CREATE CATERER INFO] No caterer ID found - Unauthorized');
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
      return;
    }

    // Verify user is a caterer
    console.log('🔵 [CREATE CATERER INFO] Fetching user by ID...');
    const user = await authService.getUserById(catererId);
    console.log('🔵 [CREATE CATERER INFO] User type:', user.type);
    
    if (user.type !== "CATERER") {
      console.log('❌ [CREATE CATERER INFO] User is not a caterer - Forbidden');
      res.status(403).json({
        success: false,
        error: {
          message: "Only caterers can create caterer info",
        },
      });
      return;
    }

    // Check if caterer info already exists
    console.log('🔵 [CREATE CATERER INFO] Checking if caterer info already exists...');
    const existingCatererInfo = await authService.getCatererInfo(catererId);
    console.log('🔵 [CREATE CATERER INFO] Existing caterer info:', existingCatererInfo ? 'Found' : 'Not found');
    
    if (existingCatererInfo) {
      console.log('⚠️ [CREATE CATERER INFO] Caterer info already exists - Returning 409');
      res.status(409).json({
        success: false,
        error: {
          message: "Caterer info already exists. Use PUT /api/auth/caterer-info to update.",
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
      region,
      delivery_only,
      delivery_plus_setup,
      full_service,
      staff,
      servers,
      commission_rate,
    } = req.body;

    console.log('🔵 [CREATE CATERER INFO] Request body fields:', {
      business_name: !!business_name,
      business_type: !!business_type,
      business_description: !!business_description,
      service_area: !!service_area,
      minimum_guests,
      maximum_guests,
      region: !!region,
      delivery_only,
      delivery_plus_setup,
      full_service,
      staff,
      servers,
      commission_rate,
    });

    // Validate required fields
    if (!business_name || !business_type) {
      console.log('❌ [CREATE CATERER INFO] Validation failed - missing business_name or business_type');
      res.status(400).json({
        success: false,
        error: {
          message: "business_name and business_type are required",
        },
      });
      return;
    }

    // Handle file uploads and existing URLs for food_license (single string, not array)
    let foodLicenseUrl: string | undefined = undefined;
    const files = (req as any).files;
    console.log('🔵 [CREATE CATERER INFO] Files received:', files ? Object.keys(files) : 'No files');
    
    // Add existing URL from request body if provided
    if (req.body.food_license && typeof req.body.food_license === "string") {
      console.log('🔵 [CREATE CATERER INFO] Using existing food_license URL from body');
      foodLicenseUrl = req.body.food_license;
    }
    
    // Upload new file if provided (only one file allowed per field)
    if (files?.food_license) {
      console.log('🔵 [CREATE CATERER INFO] Processing food_license file upload...');
      // Handle both single file and array (multer returns array even for maxCount: 1)
      const fileArray = Array.isArray(files.food_license) ? files.food_license : [files.food_license];
      if (fileArray.length > 0) {
        // Only process the first file (maxCount: 1 ensures only one file)
        const file = fileArray[0];
        console.log('🔵 [CREATE CATERER INFO] Food license file:', file.originalname, file.size, 'bytes');
        try {
          const url = await uploadFileToCloudinary(file, "partyfud/caterer-documents/food-license");
          foodLicenseUrl = url;
          console.log('✅ [CREATE CATERER INFO] Food license uploaded successfully:', url);
        } catch (uploadError: any) {
          console.log('❌ [CREATE CATERER INFO] Food license upload failed:', uploadError.message);
          res.status(400).json({
            success: false,
            error: {
              message: `Food license upload failed: ${uploadError.message}`,
            },
          });
          return;
        }
      }
    }

    // Handle file uploads and existing URLs for Registration (single string, not array)
    let registrationUrl: string | undefined = undefined;
    
    // Add existing URL from request body if provided
    if (req.body.Registration && typeof req.body.Registration === "string") {
      console.log('🔵 [CREATE CATERER INFO] Using existing Registration URL from body');
      registrationUrl = req.body.Registration;
    }
    
    // Upload new file if provided (only one file allowed per field)
    if (files?.Registration) {
      console.log('🔵 [CREATE CATERER INFO] Processing Registration file upload...');
      // Handle both single file and array (multer returns array even for maxCount: 1)
      const fileArray = Array.isArray(files.Registration) ? files.Registration : [files.Registration];
      if (fileArray.length > 0) {
        // Only process the first file (maxCount: 1 ensures only one file)
        const file = fileArray[0];
        console.log('🔵 [CREATE CATERER INFO] Registration file:', file.originalname, file.size, 'bytes');
        try {
          const url = await uploadFileToCloudinary(file, "partyfud/caterer-documents/registration");
          registrationUrl = url;
          console.log('✅ [CREATE CATERER INFO] Registration uploaded successfully:', url);
        } catch (uploadError: any) {
          console.log('❌ [CREATE CATERER INFO] Registration upload failed:', uploadError.message);
          res.status(400).json({
            success: false,
            error: {
              message: `Registration document upload failed: ${uploadError.message}`,
            },
          });
          return;
        }
      }
    }

    console.log('🔵 [CREATE CATERER INFO] Creating caterer info in database...');
    // Create caterer info
    const catererInfo = await authService.createCatererInfo({
      business_name,
      business_type,
      business_description,
      service_area,
      minimum_guests: minimum_guests ? parseInt(minimum_guests) : undefined,
      maximum_guests: maximum_guests ? parseInt(maximum_guests) : undefined,
      region,
      delivery_only: delivery_only !== undefined ? delivery_only === "true" || delivery_only === true : undefined,
      delivery_plus_setup: delivery_plus_setup !== undefined ? delivery_plus_setup === "true" || delivery_plus_setup === true : undefined,
      full_service: full_service !== undefined ? full_service === "true" || full_service === true : undefined,
      staff: staff ? parseInt(staff) : undefined,
      servers: servers ? parseInt(servers) : undefined,
      commission_rate: commission_rate ? parseInt(commission_rate) : undefined,
      food_license: foodLicenseUrl,
      Registration: registrationUrl,
      caterer_id: catererId,
    });

    console.log('✅ [CREATE CATERER INFO] Caterer info created:', catererInfo.id);

    // Update user profile_completed and verified status
    console.log('🔵 [CREATE CATERER INFO] Updating user profile_completed and verified to true...');
    await prisma.user.update({
      where: { id: catererId },
      data: { 
        profile_completed: true,
        verified: true,
      },
    });
    console.log('✅ [CREATE CATERER INFO] User profile_completed and verified updated');

    console.log('✅ [CREATE CATERER INFO] Success - Returning 201');
    res.status(201).json({
      success: true,
      data: catererInfo,
      message: "Caterer info created successfully",
    });
  } catch (error: any) {
    console.log('❌ [CREATE CATERER INFO] Error occurred:', error.message);
    console.log('❌ [CREATE CATERER INFO] Error stack:', error.stack);
    if (error.message && error.message.includes("already exists")) {
      res.status(409).json({
        success: false,
        error: {
          message: error.message,
        },
      });
      return;
    }
    next(error);
  }
};

/**
 * Update caterer info
 * PUT /api/auth/caterer-info
 * Requires authentication middleware
 * Returns error if caterer info doesn't exist
 */
export const updateCatererInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log('🟡 [UPDATE CATERER INFO] Request received');
  console.log('🟡 [UPDATE CATERER INFO] Method:', req.method);
  console.log('🟡 [UPDATE CATERER INFO] Headers:', JSON.stringify(req.headers, null, 2));
  
  try {
    // Get caterer_id from decoded token
    const catererId = (req as any).user?.userId;
    console.log('🟡 [UPDATE CATERER INFO] Caterer ID from token:', catererId);

    if (!catererId) {
      console.log('❌ [UPDATE CATERER INFO] No caterer ID found - Unauthorized');
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
      return;
    }

    // Verify user is a caterer
    console.log('🟡 [UPDATE CATERER INFO] Fetching user by ID...');
    const user = await authService.getUserById(catererId);
    console.log('🟡 [UPDATE CATERER INFO] User type:', user.type);
    
    if (user.type !== "CATERER") {
      console.log('❌ [UPDATE CATERER INFO] User is not a caterer - Forbidden');
      res.status(403).json({
        success: false,
        error: {
          message: "Only caterers can update caterer info",
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
      region,
      delivery_only,
      delivery_plus_setup,
      full_service,
      staff,
      servers,
      commission_rate,
    } = req.body;

    console.log('🟡 [UPDATE CATERER INFO] Request body fields:', {
      business_name: !!business_name,
      business_type: !!business_type,
      business_description: !!business_description,
      service_area: !!service_area,
      minimum_guests,
      maximum_guests,
      region: !!region,
      delivery_only,
      delivery_plus_setup,
      full_service,
      staff,
      servers,
      commission_rate,
    });

    // Validate required fields
    if (!business_name || !business_type) {
      console.log('❌ [UPDATE CATERER INFO] Validation failed - missing business_name or business_type');
      res.status(400).json({
        success: false,
        error: {
          message: "business_name and business_type are required",
        },
      });
      return;
    }

    // Get existing caterer info to preserve file URLs if not updated
    console.log('🟡 [UPDATE CATERER INFO] Checking if caterer info exists...');
    const existingCatererInfo = await authService.getCatererInfo(catererId);
    console.log('🟡 [UPDATE CATERER INFO] Existing caterer info:', existingCatererInfo ? 'Found' : 'Not found');
    
    if (!existingCatererInfo) {
      console.log('❌ [UPDATE CATERER INFO] Caterer info not found - Returning 404');
      res.status(404).json({
        success: false,
        error: {
          message: "Caterer info not found. Use POST /api/auth/caterer-info to create.",
        },
      });
      return;
    }

    // Handle file uploads and existing URLs for food_license (single string, not array)
    let foodLicenseUrl: string | undefined = undefined;
    const files = (req as any).files;
    console.log('🟡 [UPDATE CATERER INFO] Files received:', files ? Object.keys(files) : 'No files');
    
    // Upload new file if provided (only one file allowed per field)
    if (files?.food_license) {
      console.log('🟡 [UPDATE CATERER INFO] Processing food_license file upload...');
      // Handle both single file and array (multer returns array even for maxCount: 1)
      const fileArray = Array.isArray(files.food_license) ? files.food_license : [files.food_license];
      if (fileArray.length > 0) {
        // Only process the first file (maxCount: 1 ensures only one file)
        const file = fileArray[0];
        console.log('🟡 [UPDATE CATERER INFO] Food license file:', file.originalname, file.size, 'bytes');
        try {
          const url = await uploadFileToCloudinary(file, "partyfud/caterer-documents/food-license");
          foodLicenseUrl = url;
          console.log('✅ [UPDATE CATERER INFO] Food license uploaded successfully:', url);
        } catch (uploadError: any) {
          console.log('❌ [UPDATE CATERER INFO] Food license upload failed:', uploadError.message);
          res.status(400).json({
            success: false,
            error: {
              message: `Food license upload failed: ${uploadError.message}`,
            },
          });
          return;
        }
      }
    } else if (req.body.food_license && typeof req.body.food_license === "string") {
      // Use existing URL from request body if provided
      console.log('🟡 [UPDATE CATERER INFO] Using food_license URL from body');
      foodLicenseUrl = req.body.food_license;
    } else {
      // Preserve existing file URL if not provided
      console.log('🟡 [UPDATE CATERER INFO] Preserving existing food_license URL');
      foodLicenseUrl = existingCatererInfo.food_license || undefined;
    }

    // Handle file uploads and existing URLs for Registration (single string, not array)
    let registrationUrl: string | undefined = undefined;
    
    // Upload new file if provided (only one file allowed per field)
    if (files?.Registration) {
      console.log('🟡 [UPDATE CATERER INFO] Processing Registration file upload...');
      // Handle both single file and array (multer returns array even for maxCount: 1)
      const fileArray = Array.isArray(files.Registration) ? files.Registration : [files.Registration];
      if (fileArray.length > 0) {
        // Only process the first file (maxCount: 1 ensures only one file)
        const file = fileArray[0];
        console.log('🟡 [UPDATE CATERER INFO] Registration file:', file.originalname, file.size, 'bytes');
        try {
          const url = await uploadFileToCloudinary(file, "partyfud/caterer-documents/registration");
          registrationUrl = url;
          console.log('✅ [UPDATE CATERER INFO] Registration uploaded successfully:', url);
        } catch (uploadError: any) {
          console.log('❌ [UPDATE CATERER INFO] Registration upload failed:', uploadError.message);
          res.status(400).json({
            success: false,
            error: {
              message: `Registration document upload failed: ${uploadError.message}`,
            },
          });
          return;
        }
      }
    } else if (req.body.Registration && typeof req.body.Registration === "string") {
      // Use existing URL from request body if provided
      console.log('🟡 [UPDATE CATERER INFO] Using Registration URL from body');
      registrationUrl = req.body.Registration;
    } else {
      // Preserve existing file URL if not provided
      console.log('🟡 [UPDATE CATERER INFO] Preserving existing Registration URL');
      registrationUrl = existingCatererInfo.Registration || undefined;
    }

    console.log('🟡 [UPDATE CATERER INFO] Updating caterer info in database...');
    // Update caterer info
    const catererInfo = await authService.updateCatererInfo({
      business_name,
      business_type,
      business_description,
      service_area,
      minimum_guests: minimum_guests ? parseInt(minimum_guests) : undefined,
      maximum_guests: maximum_guests ? parseInt(maximum_guests) : undefined,
      region,
      delivery_only: delivery_only !== undefined ? delivery_only === "true" || delivery_only === true : undefined,
      delivery_plus_setup: delivery_plus_setup !== undefined ? delivery_plus_setup === "true" || delivery_plus_setup === true : undefined,
      full_service: full_service !== undefined ? full_service === "true" || full_service === true : undefined,
      staff: staff ? parseInt(staff) : undefined,
      servers: servers ? parseInt(servers) : undefined,
      commission_rate: commission_rate ? parseInt(commission_rate) : undefined,
      food_license: foodLicenseUrl,
      Registration: registrationUrl,
      caterer_id: catererId,
    });

    console.log('✅ [UPDATE CATERER INFO] Caterer info updated:', catererInfo.id);

    // Update user profile_completed and verified status
    console.log('🔵 [UPDATE CATERER INFO] Updating user profile_completed and verified to true...');
    await prisma.user.update({
      where: { id: catererId },
      data: { 
        profile_completed: true,
        verified: true,
      },
    });
    console.log('✅ [UPDATE CATERER INFO] User profile_completed and verified updated');

    console.log('✅ [UPDATE CATERER INFO] Success - Returning 200');
    
    res.status(200).json({
      success: true,
      data: catererInfo,
      message: "Caterer info updated successfully",
    });
  } catch (error: any) {
    console.log('❌ [UPDATE CATERER INFO] Error occurred:', error.message);
    console.log('❌ [UPDATE CATERER INFO] Error stack:', error.stack);
    if (error.message && error.message.includes("not found")) {
      res.status(404).json({
        success: false,
        error: {
          message: error.message,
        },
      });
      return;
    }
    next(error);
  }
};


