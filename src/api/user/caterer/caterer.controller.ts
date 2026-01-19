import { Request, Response, NextFunction } from "express";
import * as catererService from "./caterer.services";

/**
 * Filter and fetch all caterers
 * POST /api/user/caterers
 */
export const filterCaterers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      location,
      guests,
      minGuests,
      maxGuests,
      date,
      minBudget,
      maxBudget,
      menuType,
      search,
      occasionId,
      dietaryNeeds,
    } = req.body;

    // Parse menuType if it's a string
    let parsedMenuType = menuType;
    if (typeof menuType === "string") {
      try {
        parsedMenuType = JSON.parse(menuType);
      } catch {
        // If parsing fails, treat as undefined
        parsedMenuType = undefined;
      }
    }

    // Parse numeric values - handle empty strings and invalid values
    const parsedGuests = guests && guests !== '' ? Number(guests) : undefined;
    const parsedMinGuests = minGuests && minGuests !== '' && !isNaN(Number(minGuests)) ? Number(minGuests) : undefined;
    const parsedMaxGuests = maxGuests && maxGuests !== '' && !isNaN(Number(maxGuests)) ? Number(maxGuests) : undefined;
    const parsedMinBudget = minBudget && minBudget !== '' && !isNaN(Number(minBudget)) ? Number(minBudget) : undefined;
    const parsedMaxBudget = maxBudget && maxBudget !== '' && !isNaN(Number(maxBudget)) ? Number(maxBudget) : undefined;

    const filters: catererService.FilterCaterersParams = {
      location,
      guests: parsedGuests,
      minGuests: parsedMinGuests,
      maxGuests: parsedMaxGuests,
      date,
      minBudget: parsedMinBudget,
      maxBudget: parsedMaxBudget,
      menuType: parsedMenuType,
      search,
      occasionId,
      dietaryNeeds: Array.isArray(dietaryNeeds) ? dietaryNeeds : dietaryNeeds ? [dietaryNeeds] : undefined,
    };

    const caterers = await catererService.filterCaterers(filters);

    res.status(200).json({
      success: true,
      data: caterers,
      count: caterers.length,
    });
  } catch (error: any) {
    console.error("Error filtering caterers:", error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching caterers",
      },
    });
  }
};

/**
 * Get caterer by ID
 * GET /api/user/caterers/:id
 */
export const getCatererById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: {
          message: "Caterer ID is required",
        },
      });
      return;
    }

    const caterer = await catererService.getCatererById(id);

    res.status(200).json({
      success: true,
      data: caterer,
    });
  } catch (error: any) {
    console.error("Error fetching caterer:", error);
    const statusCode = error.message?.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching caterer",
      },
    });
  }
};

/**
 * Get all dishes by caterer ID
 * GET /api/user/caterers/:id/dishes
 */
export const getDishesByCatererId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: {
          message: "Caterer ID is required",
        },
      });
      return;
    }

    const dishes = await catererService.getDishesByCatererId(id);

    res.status(200).json({
      success: true,
      data: dishes,
      count: dishes.length,
    });
  } catch (error: any) {
    console.error("Error fetching dishes by caterer:", error);
    const statusCode = error.message?.includes("not found") || 
                       error.message?.includes("not approved") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching dishes",
      },
    });
  }
};

