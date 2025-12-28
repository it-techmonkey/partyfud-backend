import { Request, Response, NextFunction } from "express";
import * as packagesService from "./packages.services";
import { uploadToCloudinary } from "../../../lib/cloudinary";

/**
 * Get all packages by caterer ID
 * GET /api/caterer/packages
 */
export const getPackages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;

    const packages = await packagesService.getPackagesByCatererId(catererId);

    res.status(200).json({
      success: true,
      data: packages,
    });
  } catch (error: any) {
    res.status(error.message?.includes("not found") ? 404 : 400).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Get package by ID
 * GET /api/caterer/packages/:id
 */
export const getPackageById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("🔴 [GET PACKAGE BY ID] API hit - This should NOT be called for /packages/items");
  console.log("🔴 [GET PACKAGE BY ID] Request URL:", req.url);
  console.log("🔴 [GET PACKAGE BY ID] Request path:", req.path);
  console.log("🔴 [GET PACKAGE BY ID] Params:", req.params);
  
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const packageId = req.params.id;

    console.log("🔴 [GET PACKAGE BY ID] packageId from params:", packageId);
    console.log("🔴 [GET PACKAGE BY ID] catererId:", catererId);

    const packageData = await packagesService.getPackageById(packageId, catererId);

    res.status(200).json({
      success: true,
      data: packageData,
    });
  } catch (error: any) {
    res.status(error.message?.includes("not found") ? 404 : 400).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Create a new package
 * POST /api/caterer/packages
 */
export const createPackage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;

    // Handle image upload if provided
    let cover_image_url: string | undefined = req.body.cover_image_url; // Fallback to URL if provided
    
    if ((req as any).file) {
      try {
        cover_image_url = await uploadToCloudinary((req as any).file, 'partyfud/packages');
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

    const {
      name,
      people_count,
      package_type_id,
      total_price,
      currency,
      rating,
      is_active,
      is_available,
      package_item_ids, // Array of package item IDs to link
    } = req.body;

    // Convert FormData string values to proper types
    const parsedPeopleCount = typeof people_count === 'string' 
      ? parseInt(people_count, 10) 
      : (typeof people_count === 'number' ? people_count : 0);

    const parsedTotalPrice = typeof total_price === 'string' 
      ? parseFloat(total_price) 
      : (typeof total_price === 'number' ? total_price : 0);

    const parsedRating = rating !== undefined
      ? (typeof rating === 'string' ? parseFloat(rating) : rating)
      : undefined;

    const parsedIsActive = is_active !== undefined
      ? (typeof is_active === 'string'
          ? is_active === 'true' || is_active === '1'
          : is_active)
      : undefined;

    const parsedIsAvailable = is_available !== undefined
      ? (typeof is_available === 'string'
          ? is_available === 'true' || is_available === '1'
          : is_available)
      : undefined;

    // Parse package_item_ids (can be string or array from FormData)
    let parsedPackageItemIds: string[] | undefined;
    if (package_item_ids) {
      if (Array.isArray(package_item_ids)) {
        parsedPackageItemIds = package_item_ids.filter(id => id && typeof id === 'string');
      } else if (typeof package_item_ids === 'string') {
        // Handle comma-separated string
        parsedPackageItemIds = package_item_ids.split(',').map(id => id.trim()).filter(id => id);
      }
    }

    // Validate required fields
    if (!name || !parsedPeopleCount || !package_type_id || !parsedTotalPrice) {
      res.status(400).json({
        success: false,
        error: {
          message:
            "Missing required fields: name, people_count, package_type_id, total_price",
        },
      });
      return;
    }

    const packageData = await packagesService.createPackage(catererId, {
      name,
      people_count: parsedPeopleCount,
      package_type_id,
      cover_image_url,
      total_price: parsedTotalPrice,
      currency,
      rating: parsedRating,
      is_active: parsedIsActive,
      is_available: parsedIsAvailable,
      package_item_ids: parsedPackageItemIds, // Pass item IDs to link
    });

    res.status(201).json({
      success: true,
      data: packageData,
    });
  } catch (error: any) {
    res.status(error.message?.includes("not found") ? 404 : 400).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Update a package
 * PUT /api/caterer/packages/:id
 */
export const updatePackage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const packageId = req.params.id;

    // Handle image upload if provided
    let cover_image_url: string | undefined = req.body.cover_image_url; // Fallback to URL if provided
    
    if ((req as any).file) {
      try {
        cover_image_url = await uploadToCloudinary((req as any).file, 'partyfud/packages');
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

    const {
      name,
      people_count,
      package_type_id,
      total_price,
      currency,
      rating,
      is_active,
      is_available,
    } = req.body;

    const packageData = await packagesService.updatePackage(
      packageId,
      catererId,
      {
        name,
        people_count,
        package_type_id,
        cover_image_url,
        total_price,
        currency,
        rating,
        is_active,
        is_available,
      }
    );

    res.status(200).json({
      success: true,
      data: packageData,
    });
  } catch (error: any) {
    res.status(error.message?.includes("not found") ? 404 : 400).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

