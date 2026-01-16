import { Request, Response, NextFunction } from "express";
import * as packagesService from "./packages.services";
import prisma from "../../../lib/prisma";

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

    // Support filtering by occasion_name (convert to occasion_id)
    if (req.query.occasion_name && typeof req.query.occasion_name === 'string' && !filters.occasion_id) {
      try {
        const occasion = await prisma.occassion.findFirst({
          where: {
            name: {
              equals: req.query.occasion_name,
              mode: 'insensitive',
            },
          },
        });

        if (occasion) {
          filters.occasion_id = occasion.id;
        } else {
          // If occasion not found, return empty result with a message
          res.status(200).json({
            success: true,
            data: [],
            count: 0,
            filters: filters,
            message: `Occasion "${req.query.occasion_name}" not found`,
          });
          return;
        }
      } catch (err: any) {
        console.error("Error fetching occasion by name:", err);
        // Continue without occasion filter if there's an error
      }
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

    // Support filtering by created_by (USER or CATERER)
    if (req.query.created_by && typeof req.query.created_by === 'string') {
      if (req.query.created_by === 'USER' || req.query.created_by === 'CATERER') {
        filters.created_by = req.query.created_by as 'USER' | 'CATERER';
      }
    }

    // Support filtering by user_id (for user-created packages)
    if (req.query.user_id && typeof req.query.user_id === 'string') {
      filters.user_id = req.query.user_id;
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

/**
 * Get packages by occasion name
 * GET /api/user/packages/occasion/:occasionName
 */
export const getPackagesByOccasionName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const occasionName = req.params.occasionName;

    if (!occasionName || typeof occasionName !== "string") {
      res.status(400).json({
        success: false,
        error: {
          message: "Occasion name is required",
        },
      });
      return;
    }

    const packages = await packagesService.getPackagesByOccasionName(occasionName);

    res.status(200).json({
      success: true,
      data: packages,
      count: packages.length,
      occasion_name: occasionName,
    });
  } catch (error: any) {
    console.error("Error fetching packages by occasion:", error);
    const statusCode = error.message?.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching packages",
      },
    });
  }
};

/**
 * Create a custom package for a user
 * POST /api/user/packages
 * 
 * Request body:
 * {
 *   name?: string,                    // Optional, auto-generated if not provided
 *   dish_ids: string[],              // Required: Array of dish IDs
 *   people_count: number,             // Required: Number of people
 *   package_type_id?: string,        // Optional: Package type ID
 *   quantities?: { [dish_id: string]: number } // Optional: Quantities for each dish
 * }
 */
export const createCustomPackage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;

    // JWT payload has userId, not id
    const userId = user?.userId || user?.id;

    if (!user || !userId) {
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized. Please authenticate first.",
        },
      });
      return;
    }

    const { name, dish_ids, people_count, quantities } = req.body;

    // Validate required fields
    if (!dish_ids || !Array.isArray(dish_ids) || dish_ids.length === 0) {
      res.status(400).json({
        success: false,
        error: {
          message: "dish_ids is required and must be a non-empty array",
        },
      });
      return;
    }

    if (!people_count || typeof people_count !== "number" || people_count <= 0) {
      res.status(400).json({
        success: false,
        error: {
          message: "people_count is required and must be a positive number",
        },
      });
      return;
    }

    // Validate quantities if provided
    if (quantities && typeof quantities !== "object") {
      res.status(400).json({
        success: false,
        error: {
          message: "quantities must be an object mapping dish_id to quantity",
        },
      });
      return;
    }

    const packageData = await packagesService.createCustomPackage(userId, {
      name,
      dish_ids,
      people_count,
      quantities,
    });

    res.status(201).json({
      success: true,
      data: packageData,
    });
  } catch (error: any) {
    console.error("Error creating custom package:", error);
    const statusCode =
      error.message?.includes("not found") ||
      error.message?.includes("not approved") ||
      error.message?.includes("inactive")
        ? 404
        : error.message?.includes("required") ||
          error.message?.includes("must be") ||
          error.message?.includes("Invalid")
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while creating the package",
      },
    });
  }
};

/**
 * Get packages created by the authenticated user
 * GET /api/user/packages/my-packages
 * 
 * Requires authentication
 * Returns only packages created by the logged-in user
 */
export const getMyPackages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;

    // JWT payload has userId, not id
    const userId = user?.userId || user?.id;

    if (!user || !userId) {
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized. Please authenticate first.",
        },
      });
      return;
    }

    // Extract query parameters for additional filters
    const filters: any = {
      created_by: 'USER',
      user_id: userId, // Filter by authenticated user's ID
    };

    // Support additional filters
    if (req.query.search && typeof req.query.search === 'string') {
      filters.search = req.query.search;
    }

    if (req.query.min_price) {
      filters.min_price = parseFloat(req.query.min_price as string);
    }

    if (req.query.max_price) {
      filters.max_price = parseFloat(req.query.max_price as string);
    }

    if (req.query.min_guests) {
      filters.min_guests = parseInt(req.query.min_guests as string, 10);
    }

    if (req.query.max_guests) {
      filters.max_guests = parseInt(req.query.max_guests as string, 10);
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
    });
  } catch (error: any) {
    console.error("Error fetching user packages:", error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching packages",
      },
    });
  }
};

