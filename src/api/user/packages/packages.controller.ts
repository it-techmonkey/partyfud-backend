import { Request, Response, NextFunction } from "express";
import * as packagesService from "./packages.services";

/**
 * Get packages by caterer ID
 * GET /api/user/packages?caterer_id=xxx
 * or
 * GET /api/user/packages/caterer/:catererId
 */
export const getPackagesByCatererId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Support both query parameter and route parameter
    const catererId = req.params.catererId || req.query.caterer_id;

    if (!catererId || typeof catererId !== "string") {
      res.status(400).json({
        success: false,
        error: {
          message: "Caterer ID is required",
        },
      });
      return;
    }

    const packages = await packagesService.getPackagesByCatererId(catererId);

    res.status(200).json({
      success: true,
      data: packages,
      count: packages.length,
    });
  } catch (error: any) {
    console.error("Error fetching packages:", error);
    const statusCode = error.message?.includes("not found") || 
                       error.message?.includes("not approved") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching packages",
      },
    });
  }
};

/**
 * Get a single package by ID
 * GET /api/user/packages/:packageId
 */
export const getPackageById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const packageId = req.params.packageId;

    if (!packageId || typeof packageId !== "string") {
      res.status(400).json({
        success: false,
        error: {
          message: "Package ID is required",
        },
      });
      return;
    }

    const packageData = await packagesService.getPackageById(packageId);

    res.status(200).json({
      success: true,
      data: packageData,
    });
  } catch (error: any) {
    console.error("Error fetching package:", error);
    const statusCode = error.message?.includes("not found") || 
                       error.message?.includes("not available") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching the package",
      },
    });
  }
};

/**
 * Get all packages with filters
 * GET /api/user/packages/all?caterer_id=xxx&location=xxx&min_price=xxx&max_price=xxx&...
 */
export const getAllPackages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract query parameters
    const filters: any = {};

    if (req.query.caterer_id && typeof req.query.caterer_id === 'string') {
      filters.caterer_id = req.query.caterer_id;
    }

    if (req.query.location && typeof req.query.location === 'string') {
      filters.location = req.query.location;
    }

    if (req.query.region && typeof req.query.region === 'string') {
      filters.region = req.query.region;
    }

    if (req.query.min_guests) {
      filters.min_guests = parseInt(req.query.min_guests as string, 10);
    }

    if (req.query.max_guests) {
      filters.max_guests = parseInt(req.query.max_guests as string, 10);
    }

    if (req.query.min_price) {
      filters.min_price = parseFloat(req.query.min_price as string);
    }

    if (req.query.max_price) {
      filters.max_price = parseFloat(req.query.max_price as string);
    }

    if (req.query.occasion_id && typeof req.query.occasion_id === 'string') {
      filters.occasion_id = req.query.occasion_id;
    }

    if (req.query.cuisine_type_id && typeof req.query.cuisine_type_id === 'string') {
      filters.cuisine_type_id = req.query.cuisine_type_id;
    }

    if (req.query.category_id && typeof req.query.category_id === 'string') {
      filters.category_id = req.query.category_id;
    }

    if (req.query.search && typeof req.query.search === 'string') {
      filters.search = req.query.search;
    }

    if (req.query.menu_type && typeof req.query.menu_type === 'string') {
      if (req.query.menu_type === 'fixed' || req.query.menu_type === 'customizable') {
        filters.menu_type = req.query.menu_type;
      }
    }

    if (req.query.sort_by && typeof req.query.sort_by === 'string') {
      const validSortOptions = ['price_asc', 'price_desc', 'rating_desc', 'created_desc'];
      if (validSortOptions.includes(req.query.sort_by)) {
        filters.sort_by = req.query.sort_by;
      }
    }

    const packages = await packagesService.getAllPackagesWithFilters(filters);

    res.status(200).json({
      success: true,
      data: packages,
      count: packages.length,
      filters: filters,
    });
  } catch (error: any) {
    console.error("Error fetching packages:", error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching packages",
      },
    });
  }
};

