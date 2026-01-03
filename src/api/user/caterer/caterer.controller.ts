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
      date,
      minBudget,
      maxBudget,
      menuType,
      search,
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

    // Parse numeric values
    const parsedGuests = guests ? Number(guests) : undefined;
    const parsedMinBudget = minBudget ? Number(minBudget) : undefined;
    const parsedMaxBudget = maxBudget ? Number(maxBudget) : undefined;

    const filters: catererService.FilterCaterersParams = {
      location,
      guests: parsedGuests,
      date,
      minBudget: parsedMinBudget,
      maxBudget: parsedMaxBudget,
      menuType: parsedMenuType,
      search,
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

