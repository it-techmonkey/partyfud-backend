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
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const packageId = req.params.id;

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
    } = req.body;

    // Validate required fields
    if (!name || !people_count || !package_type_id || !total_price) {
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
      people_count,
      package_type_id,
      cover_image_url,
      total_price,
      currency,
      rating,
      is_active,
      is_available,
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

