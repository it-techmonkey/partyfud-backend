import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.services";
import { uploadToCloudinary, uploadFileToCloudinary } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";

/**
 * Signup controller
 * POST /api/auth/signups
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
  try {
    const catererId = (req as any).user?.userId;

    if (!catererId) {
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
      return;
    }

    const user = await authService.getUserById(catererId);
    
    if (user.type !== "CATERER") {
      res.status(403).json({
        success: false,
        error: {
          message: "Only caterers can create caterer info",
        },
      });
      return;
    }

    const existingCatererInfo = await authService.getCatererInfo(catererId);
    
    if (existingCatererInfo) {
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
      preparation_time,
      region,
      delivery_only,
      delivery_plus_setup,
      full_service,
      staff,
      servers,
      commission_rate,
    } = req.body;

    if (!business_name || !business_type) {
      res.status(400).json({
        success: false,
        error: {
          message: "business_name and business_type are required",
        },
      });
      return;
    }

    // Handle file uploads and existing URLs for food_license
    let foodLicenseUrl: string | undefined = undefined;
    const files = (req as any).files;
    
    if (req.body.food_license && typeof req.body.food_license === "string") {
      foodLicenseUrl = req.body.food_license;
    }
    
    if (files?.food_license) {
      const fileArray = Array.isArray(files.food_license) ? files.food_license : [files.food_license];
      if (fileArray.length > 0) {
        const file = fileArray[0];
        try {
          foodLicenseUrl = await uploadFileToCloudinary(file, "partyfud/caterer-documents/food-license");
        } catch (uploadError: any) {
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

    // Handle file uploads and existing URLs for Registration
    let registrationUrl: string | undefined = undefined;
    
    if (req.body.Registration && typeof req.body.Registration === "string") {
      registrationUrl = req.body.Registration;
    }
    
    if (files?.Registration) {
      const fileArray = Array.isArray(files.Registration) ? files.Registration : [files.Registration];
      if (fileArray.length > 0) {
        const file = fileArray[0];
        try {
          registrationUrl = await uploadFileToCloudinary(file, "partyfud/caterer-documents/registration");
        } catch (uploadError: any) {
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

    const catererInfo = await authService.createCatererInfo({
      business_name,
      business_type,
      business_description,
      service_area,
      minimum_guests: minimum_guests ? parseInt(minimum_guests) : undefined,
      maximum_guests: maximum_guests ? parseInt(maximum_guests) : undefined,
      preparation_time: preparation_time ? parseInt(preparation_time) : undefined,
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

    await prisma.user.update({
      where: { id: catererId },
      data: { 
        profile_completed: true,
        verified: true,
      },
    });

    res.status(201).json({
      success: true,
      data: catererInfo,
      message: "Caterer info created successfully",
    });
  } catch (error: any) {
    console.error("Error creating caterer info:", error);
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
  try {
    const catererId = (req as any).user?.userId;

    if (!catererId) {
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
      return;
    }

    const user = await authService.getUserById(catererId);
    
    if (user.type !== "CATERER") {
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
      preparation_time,
      region,
      delivery_only,
      delivery_plus_setup,
      full_service,
      staff,
      servers,
      commission_rate,
    } = req.body;

    if (!business_name || !business_type) {
      res.status(400).json({
        success: false,
        error: {
          message: "business_name and business_type are required",
        },
      });
      return;
    }

    const existingCatererInfo = await authService.getCatererInfo(catererId);
    
    if (!existingCatererInfo) {
      res.status(404).json({
        success: false,
        error: {
          message: "Caterer info not found. Use POST /api/auth/caterer-info to create.",
        },
      });
      return;
    }

    // Handle file uploads and existing URLs for food_license
    let foodLicenseUrl: string | undefined = undefined;
    const files = (req as any).files;
    
    if (files?.food_license) {
      const fileArray = Array.isArray(files.food_license) ? files.food_license : [files.food_license];
      if (fileArray.length > 0) {
        const file = fileArray[0];
        try {
          foodLicenseUrl = await uploadFileToCloudinary(file, "partyfud/caterer-documents/food-license");
        } catch (uploadError: any) {
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
      foodLicenseUrl = req.body.food_license;
    } else {
      foodLicenseUrl = existingCatererInfo.food_license || undefined;
    }

    // Handle file uploads and existing URLs for Registration
    let registrationUrl: string | undefined = undefined;
    
    if (files?.Registration) {
      const fileArray = Array.isArray(files.Registration) ? files.Registration : [files.Registration];
      if (fileArray.length > 0) {
        const file = fileArray[0];
        try {
          registrationUrl = await uploadFileToCloudinary(file, "partyfud/caterer-documents/registration");
        } catch (uploadError: any) {
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
      registrationUrl = req.body.Registration;
    } else {
      registrationUrl = existingCatererInfo.Registration || undefined;
    }

    // Handle gallery images uploads
    let galleryImages: string[] = [];
    
    // Handle existing gallery images from body (if provided, these are the images to keep)
    // Always use the provided list, even if empty (to allow deletion)
    if (req.body.existing_gallery_images !== undefined) {
      if (typeof req.body.existing_gallery_images === "string") {
        // If it's a JSON string, parse it
        try {
          const parsed = JSON.parse(req.body.existing_gallery_images);
          galleryImages = Array.isArray(parsed) ? parsed : [];
        } catch {
          // If parsing fails, treat as single URL or empty
          galleryImages = req.body.existing_gallery_images ? [req.body.existing_gallery_images] : [];
        }
      } else if (Array.isArray(req.body.existing_gallery_images)) {
        galleryImages = req.body.existing_gallery_images;
      } else {
        galleryImages = [];
      }
    } else {
      // If no existing images provided, keep current ones
      galleryImages = existingCatererInfo.gallery_images || [];
    }
    
    // Handle new gallery image uploads (add to existing images)
    if (files?.gallery_images) {
      const fileArray = Array.isArray(files.gallery_images) ? files.gallery_images : [files.gallery_images];
      const uploadedUrls: string[] = [];
      
      for (const file of fileArray) {
        try {
          const imageUrl = await uploadToCloudinary(file, "partyfud/caterer-gallery");
          uploadedUrls.push(imageUrl);
        } catch (uploadError: any) {
          console.error(`Gallery image upload failed: ${uploadError.message}`);
          // Continue with other images even if one fails
        }
      }
      
      // Add new uploaded images to existing ones
      galleryImages = [...galleryImages, ...uploadedUrls];
    }

    const catererInfo = await authService.updateCatererInfo({
      business_name,
      business_type,
      business_description,
      service_area,
      minimum_guests: minimum_guests ? parseInt(minimum_guests) : undefined,
      maximum_guests: maximum_guests ? parseInt(maximum_guests) : undefined,
      preparation_time: preparation_time ? parseInt(preparation_time) : undefined,
      region: (() => {
        // Handle region as JSON string or array
        if (typeof region === 'string') {
          try {
            const parsed = JSON.parse(region);
            return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
          } catch {
            return region ? [region] : [];
          }
        }
        return Array.isArray(region) ? region : (region ? [region] : []);
      })(),
      delivery_only: delivery_only !== undefined ? delivery_only === "true" || delivery_only === true : undefined,
      delivery_plus_setup: delivery_plus_setup !== undefined ? delivery_plus_setup === "true" || delivery_plus_setup === true : undefined,
      full_service: full_service !== undefined ? full_service === "true" || full_service === true : undefined,
      staff: staff ? parseInt(staff) : undefined,
      servers: servers ? parseInt(servers) : undefined,
      commission_rate: commission_rate ? parseInt(commission_rate) : undefined,
      food_license: foodLicenseUrl,
      Registration: registrationUrl,
      gallery_images: galleryImages,
      caterer_id: catererId,
    });

    await prisma.user.update({
      where: { id: catererId },
      data: { 
        profile_completed: true,
        verified: true,
      },
    });
    
    res.status(200).json({
      success: true,
      data: catererInfo,
      message: "Caterer info updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating caterer info:", error);
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

/**
 * Update user profile
 * PUT /api/auth/profile
 */
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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

    const {
      first_name,
      last_name,
      phone,
      email,
      company_name,
    } = req.body;

    // Handle image upload if provided
    let image_url: string | undefined = req.body.image_url;
    
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

    const updatedUser = await authService.updateUserProfile(userId, {
      first_name,
      last_name,
      phone,
      email,
      company_name,
      image_url,
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    if (error.message && (error.message.includes("not found") || error.message.includes("already taken"))) {
      res.status(400).json({
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


