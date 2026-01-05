import { Request, Response, NextFunction } from "express";
import * as occasionService from "./ocassion.services";

/**
 * Get all occasions
 * GET /api/user/occasions
 */
export const getAllOccasions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const occasions = await occasionService.getAllOccasions();

    res.status(200).json({
      success: true,
      data: occasions,
      count: occasions.length,
    });
  } catch (error: any) {
    console.error("Error fetching occasions:", error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching occasions",
      },
    });
  }
};

/**
 * Get occasion by ID
 * GET /api/user/occasions/:occasionId
 */
export const getOccasionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const occasionId = req.params.occasionId;

    if (!occasionId || typeof occasionId !== "string") {
      res.status(400).json({
        success: false,
        error: {
          message: "Occasion ID is required",
        },
      });
      return;
    }

    const occasion = await occasionService.getOccasionById(occasionId);

    res.status(200).json({
      success: true,
      data: occasion,
    });
  } catch (error: any) {
    console.error("Error fetching occasion:", error);
    const statusCode = error.message?.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching the occasion",
      },
    });
  }
};

