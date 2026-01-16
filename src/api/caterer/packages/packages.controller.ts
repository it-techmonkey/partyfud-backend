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
    if (!user || !user.userId) {
      res.status(401).json({
        success: false,
        error: {
          message: "Authentication required",
        },
      });
      return;
    }

    const catererId = user.userId;
    console.log("🔍 [GET PACKAGES] Fetching packages for caterer:", catererId);

    const packages = await packagesService.getPackagesByCatererId(catererId);
    console.log("✅ [GET PACKAGES] Successfully fetched", packages.length, "packages");

    res.status(200).json({
      success: true,
      data: packages,
    });
  } catch (error: any) {
    console.error("❌ [GET PACKAGES] Error:", error);
    console.error("❌ [GET PACKAGES] Error stack:", error.stack);
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
      description,
      minimum_people,
      total_price,
      currency,
      rating,
      is_active,
      is_available,
      customisation_type,
      additional_info, // Extra pricing and services information
      package_item_ids, // Array of package item IDs to link
      category_selections, // Array of { category_id, num_dishes_to_select }
      occassion, // Array of occasion IDs
    } = req.body;

    // Convert FormData string values to proper types
    const parsedMinimumPeople = minimum_people !== undefined
      ? (typeof minimum_people === 'string' ? parseInt(minimum_people, 10) : (typeof minimum_people === 'number' ? minimum_people : undefined))
      : undefined;

    const parsedTotalPrice = total_price !== undefined
      ? (typeof total_price === 'string' ? parseFloat(total_price) : (typeof total_price === 'number' ? total_price : undefined))
      : undefined;

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

    // Parse occassion (can be string or array from FormData)
    let parsedOccasions: string[] | undefined;
    if (occassion !== undefined) {
      if (Array.isArray(occassion)) {
        parsedOccasions = occassion;
      } else if (typeof occassion === 'string') {
        try {
          const parsed = JSON.parse(occassion);
          if (Array.isArray(parsed)) {
            parsedOccasions = parsed;
          }
        } catch (e) {
          // Invalid JSON, ignore
        }
      }
    }

    // Parse customisation_type
    const parsedCustomisationType = customisation_type === "CUSTOMISABLE" ? "CUSTOMISABLE" : "FIXED";

    // Parse category_selections (only for FIXED packages)
    let parsedCategorySelections: Array<{ category_id: string; num_dishes_to_select: number | null }> | undefined;
    if (category_selections) {
      if (Array.isArray(category_selections)) {
        parsedCategorySelections = category_selections.map((cs: any) => ({
          category_id: cs.category_id,
          num_dishes_to_select: cs.num_dishes_to_select === null || cs.num_dishes_to_select === undefined
            ? null
            : (typeof cs.num_dishes_to_select === 'string'
              ? parseInt(cs.num_dishes_to_select, 10)
              : cs.num_dishes_to_select),
        })).filter((cs: any) => cs.category_id);
      } else if (typeof category_selections === 'string') {
        // Try to parse JSON string
        try {
          const parsed = JSON.parse(category_selections);
          if (Array.isArray(parsed)) {
            parsedCategorySelections = parsed.map((cs: any) => ({
              category_id: cs.category_id,
              num_dishes_to_select: cs.num_dishes_to_select === null || cs.num_dishes_to_select === undefined
                ? null
                : (typeof cs.num_dishes_to_select === 'string'
                  ? parseInt(cs.num_dishes_to_select, 10)
                  : cs.num_dishes_to_select),
            })).filter((cs: any) => cs.category_id);
          }
        } catch (e) {
          // Invalid JSON, ignore
        }
      }
    }

    // Validate required fields
    if (!name || !parsedMinimumPeople) {
      res.status(400).json({
        success: false,
        error: {
          message:
            "Missing required fields: name, minimum_people",
        },
      });
      return;
    }

    // Validate that package items are provided if total_price is not provided
    if (!parsedTotalPrice && (!parsedPackageItemIds || parsedPackageItemIds.length === 0)) {
      res.status(400).json({
        success: false,
        error: {
          message:
            "Either total_price or package_item_ids must be provided. Package price is calculated from items.",
        },
      });
      return;
    }

    const packageData = await packagesService.createPackage(catererId, {
      name,
      description,
      minimum_people: parsedMinimumPeople,
      cover_image_url,
      total_price: parsedTotalPrice,
      currency,
      rating: parsedRating,
      is_active: parsedIsActive,
      is_available: parsedIsAvailable,
      customisation_type: parsedCustomisationType,
      additional_info, // Extra pricing and services information
      package_item_ids: parsedPackageItemIds, // Pass item IDs to link
      category_selections: parsedCategorySelections, // Pass category selections
      occassion: parsedOccasions, // Pass occasions
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
      description,
      minimum_people,
      total_price,
      currency,
      rating,
      is_active,
      is_available,
      customisation_type,
      additional_info, // Extra pricing and services information
      category_selections,
      occassion,
      package_item_ids,
    } = req.body;

    // Parse occassion
    let parsedOccasions: string[] | undefined;
    if (occassion !== undefined) {
      if (Array.isArray(occassion)) {
        parsedOccasions = occassion;
      } else if (typeof occassion === 'string') {
        try {
          const parsed = JSON.parse(occassion);
          if (Array.isArray(parsed)) {
            parsedOccasions = parsed;
          }
        } catch (e) {
          // Invalid JSON, ignore
        }
      }
    }

    // Parse package_item_ids
    let parsedPackageItemIds: string[] | undefined;
    if (package_item_ids !== undefined) {
      if (Array.isArray(package_item_ids)) {
        parsedPackageItemIds = package_item_ids;
      } else if (typeof package_item_ids === 'string') {
        // Could be comma-separated or JSON
        if (package_item_ids.trim().startsWith('[')) {
          try {
            const parsed = JSON.parse(package_item_ids);
            if (Array.isArray(parsed)) {
              parsedPackageItemIds = parsed;
            }
          } catch (e) {
            // Invalid JSON, try comma-separated
            parsedPackageItemIds = package_item_ids.split(',').map(id => id.trim()).filter(Boolean);
          }
        } else {
          parsedPackageItemIds = package_item_ids.split(',').map(id => id.trim()).filter(Boolean);
        }
      }
    }

    // Parse minimum_people
    let parsedMinimumPeople: number | undefined;
    if (minimum_people !== undefined) {
      parsedMinimumPeople = typeof minimum_people === 'string' 
        ? parseInt(minimum_people, 10) 
        : minimum_people;
    }

    // Parse customisation_type
    const parsedCustomisationType = customisation_type === "CUSTOMISABLE" ? "CUSTOMISABLE" : undefined;

    // Parse category_selections
    let parsedCategorySelections: Array<{ category_id: string; num_dishes_to_select: number | null }> | undefined;
    if (category_selections !== undefined) {
      if (Array.isArray(category_selections)) {
        parsedCategorySelections = category_selections.map((cs: any) => ({
          category_id: cs.category_id,
          num_dishes_to_select: cs.num_dishes_to_select === null || cs.num_dishes_to_select === undefined
            ? null
            : (typeof cs.num_dishes_to_select === 'string'
              ? parseInt(cs.num_dishes_to_select, 10)
              : cs.num_dishes_to_select),
        })).filter((cs: any) => cs.category_id);
      } else if (typeof category_selections === 'string') {
        // Try to parse JSON string
        try {
          const parsed = JSON.parse(category_selections);
          if (Array.isArray(parsed)) {
            parsedCategorySelections = parsed.map((cs: any) => ({
              category_id: cs.category_id,
              num_dishes_to_select: cs.num_dishes_to_select === null || cs.num_dishes_to_select === undefined
                ? null
                : (typeof cs.num_dishes_to_select === 'string'
                  ? parseInt(cs.num_dishes_to_select, 10)
                  : cs.num_dishes_to_select),
            })).filter((cs: any) => cs.category_id);
          }
        } catch (e) {
          // Invalid JSON, ignore
        }
      }
    }

    const packageData = await packagesService.updatePackage(
      packageId,
      catererId,
      {
        name,
        description,
        minimum_people: parsedMinimumPeople,
        cover_image_url,
        total_price: total_price !== undefined ? parseFloat(total_price) : undefined,
        currency,
        rating: rating !== undefined ? parseFloat(rating) : undefined,
        is_active: is_active !== undefined ? is_active === 'true' || is_active === true : undefined,
        is_available: is_available !== undefined ? is_available === 'true' || is_available === true : undefined,
        customisation_type: parsedCustomisationType,
        additional_info, // Extra pricing and services information
        category_selections: parsedCategorySelections,
        occassion: parsedOccasions,
        package_item_ids: parsedPackageItemIds,
      }
    );

    res.status(200).json({
      success: true,
      data: packageData,
    });
  } catch (error: any) {
    console.error('Error updating package:', error);

    let statusCode = 400;
    let errorMessage = error.message || 'An error occurred while updating the package';

    // Handle specific error types with user-friendly messages
    if (error.message?.includes('not found') || error.message?.includes('permission')) {
      statusCode = 404;
      errorMessage = 'Package not found or you do not have permission to edit it';
    } else if (error.code === 'P2003' || error.message?.includes('Foreign key')) {
      // Prisma foreign key constraint error
      statusCode = 400;
      errorMessage = 'Unable to update package due to invalid data. Please check all fields.';
    } else if (error.code === 'P2002') {
      // Prisma unique constraint error
      statusCode = 409;
      errorMessage = 'A package with this name already exists.';
    }

    res.status(statusCode).json({
      success: false,
      error: {
        message: errorMessage,
      },
    });
  }
};

/**
 * Delete a package
 * DELETE /api/caterer/packages/:id
 */
export const deletePackage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const packageId = req.params.id;

    await packagesService.deletePackage(packageId, catererId);

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error: any) {
    let statusCode = 500;
    let errorMessage = error.message || 'An error occurred while deleting the package';

    if (error.message?.includes('not found') || error.message?.includes('permission')) {
      statusCode = 404;
      errorMessage = 'Package not found or you do not have permission to delete it';
    }

    res.status(statusCode).json({
      success: false,
      error: {
        message: errorMessage,
      },
    });
  }
};

