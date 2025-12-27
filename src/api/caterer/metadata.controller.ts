import { Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma";

/**
 * Get all cuisine types
 * GET /api/caterer/metadata/cuisine-types
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

/**
 * Get all categories
 * GET /api/caterer/metadata/categories
 */
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: categories,
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

/**
 * Get subcategories by category ID
 * GET /api/caterer/metadata/subcategories?category_id=xxx
 */
export const getSubCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const category_id = req.query.category_id as string | undefined;

    const where: any = {};
    if (category_id) {
      where.category_id = category_id;
    }

    const subCategories = await prisma.subCategory.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: subCategories,
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

/**
 * Get all free forms
 * GET /api/caterer/metadata/freeforms
 */
export const getFreeForms = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const freeForms = await prisma.freeForm.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: freeForms,
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

