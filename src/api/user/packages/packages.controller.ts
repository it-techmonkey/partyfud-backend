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
    // Support both query parameter and route parameter, and slug
    const catererId = req.params.catererId || req.query.caterer_id || req.query.caterer_slug;

    if (!catererId || typeof catererId !== "string") {
      res.status(400).json({
        success: false,
        error: {
          message: "Caterer ID or slug is required",
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
    const {
      caterer_id,
      location,
      region,
      min_guests,
      max_guests,
      min_price,
      max_price,
      occasion_id,
      occasion_name,
      cuisine_type_id,
      category_id,
      search,
      menu_type,
      sort_by,
      created_by,
      user_id
    } = req.query;

    const filters: packagesService.PackageFilters = {};

    if (typeof caterer_id === 'string') filters.caterer_id = caterer_id;
    if (typeof location === 'string') filters.location = location;
    if (typeof region === 'string') filters.region = region;

    if (min_guests) filters.min_guests = parseInt(min_guests as string, 10);
    if (max_guests) filters.max_guests = parseInt(max_guests as string, 10);

    if (min_price) filters.min_price = parseInt(min_price as string, 10);
    if (max_price) filters.max_price = parseInt(max_price as string, 10);

    if (typeof occasion_id === 'string') filters.occasion_id = occasion_id;
    if (typeof cuisine_type_id === 'string') filters.cuisine_type_id = cuisine_type_id;
    if (typeof category_id === 'string') filters.category_id = category_id;
    if (typeof search === 'string') filters.search = search;
    if (typeof user_id === 'string') filters.user_id = user_id;

    // Handle menu_type
    if (typeof menu_type === 'string' && (menu_type === 'fixed' || menu_type === 'customizable')) {
      filters.menu_type = menu_type;
    }

    // Handle sort_by
    const validSortOptions = ['price_asc', 'price_desc', 'rating_desc', 'created_desc'];
    if (typeof sort_by === 'string' && validSortOptions.includes(sort_by)) {
      filters.sort_by = sort_by as any;
    }

    // Handle created_by
    if (typeof created_by === 'string' && (created_by === 'USER' || created_by === 'CATERER')) {
      filters.created_by = created_by;
    }

    // Handle occasion_name -> occasion_id
    if (typeof occasion_name === 'string' && !filters.occasion_id) {
      try {
        const occasion = await prisma.occassion.findFirst({
          where: {
            name: {
              equals: occasion_name,
              mode: 'insensitive',
            },
          },
          select: { id: true }
        });

        if (occasion) {
          filters.occasion_id = occasion.id;
        } else {
          res.status(200).json({
            success: true,
            data: [],
            count: 0,
            filters,
            message: `Occasion "${occasion_name}" not found`,
          });
          return;
        }
      } catch (err) {
        console.error("Error fetching occasion by name:", err);
      }
    }

    const packages = await packagesService.getAllPackagesWithFilters(filters);

    res.status(200).json({
      success: true,
      data: packages,
      count: packages.length,
      filters,
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
    const user = req.user;

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
      minimum_people: people_count,
      people_count, // Keep for backward compatibility
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
    const user = req.user;

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
      filters.min_price = parseInt(req.query.min_price as string, 10);
    }

    if (req.query.max_price) {
      filters.max_price = parseInt(req.query.max_price as string, 10);
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

