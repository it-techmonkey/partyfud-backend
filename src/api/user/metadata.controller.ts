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

/**
 * Get all package types (Menu Types)
 * GET /api/user/metadata/package-types
 * Returns dynamic menu types based on package customisation types and service types
 */
export const getPackageTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Return menu types based on package customisation types and service offerings
    const packageTypes = [
      { id: 'fixed', name: 'Set Menus', description: 'Pre-set menu packages' },
      { id: 'customizable', name: 'Build Your Own', description: 'Customizable menu packages' },
      { id: 'liveStations', name: 'Live Stations', description: 'Live cooking stations' },
    ];

    res.status(200).json({
      success: true,
      data: packageTypes,
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
 * Get all dietary needs
 * GET /api/user/metadata/dietary-needs
 * Returns common dietary preferences/needs
 */
export const getDietaryNeeds = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Return common dietary needs
    const dietaryNeeds = [
      { id: 'vegetarian', name: 'Vegetarian' },
      { id: 'vegan', name: 'Vegan' },
      { id: 'glutenFree', name: 'Gluten-Free' },
      { id: 'halal', name: 'Halal' },
      { id: 'kosher', name: 'Kosher' },
      { id: 'nutFree', name: 'Nut-Free' },
      { id: 'dairyFree', name: 'Dairy-Free' },
    ];

    res.status(200).json({
      success: true,
      data: dietaryNeeds,
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
