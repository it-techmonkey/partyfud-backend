import { Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma";

/**
 * Get all cuisine types (public/user accessible)
 * GET /api/user/metadata/cuisine-types
 */
export const getCuisineTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cuisineTypes = await prisma.cuisineType.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: cuisineTypes,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

