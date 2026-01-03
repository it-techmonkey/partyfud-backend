import { Request, Response, NextFunction } from "express";
import * as dishesService from "./dishes.services";

/**
 * Get all dishes with filters
 * GET /api/user/dishes?caterer_id=xxx&cuisine_type_id=xxx&category_id=xxx&...
 * 
 * Query parameters:
 * - caterer_id: Filter by caterer ID
 * - cuisine_type_id: Filter by cuisine type
 * - category_id: Filter by category
 * - sub_category_id: Filter by subcategory
 * - search: Search in dish name
 * - min_price: Minimum price
 * - max_price: Maximum price
 * - is_active: Filter by active status (default: true)
 * - group_by_category: Group results by category (true/false)
 */
export const getAllDishes = async (
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

    if (req.query.cuisine_type_id && typeof req.query.cuisine_type_id === 'string') {
      filters.cuisine_type_id = req.query.cuisine_type_id;
    }

    if (req.query.category_id && typeof req.query.category_id === 'string') {
      filters.category_id = req.query.category_id;
    }

    if (req.query.sub_category_id && typeof req.query.sub_category_id === 'string') {
      filters.sub_category_id = req.query.sub_category_id;
    }

    if (req.query.search && typeof req.query.search === 'string') {
      filters.search = req.query.search;
    }

    if (req.query.min_price) {
      filters.min_price = parseFloat(req.query.min_price as string);
    }

    if (req.query.max_price) {
      filters.max_price = parseFloat(req.query.max_price as string);
    }

    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === 'true' || req.query.is_active === '1';
    }

    // Check if grouping is requested
    const groupByCategory = req.query.group_by_category === 'true' || req.query.group_by_category === '1';

    let dishes;
    if (groupByCategory) {
      dishes = await dishesService.getAllDishesGroupedByCategory(filters);
    } else {
      dishes = await dishesService.getAllDishesWithFilters(filters);
    }

    res.status(200).json({
      success: true,
      data: dishes,
      count: Array.isArray(dishes) ? dishes.length : (dishes as any).categories?.reduce((sum: number, cat: any) => sum + cat.dishes.length, 0) || 0,
    });
  } catch (error: any) {
    console.error("Error fetching dishes:", error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching dishes",
      },
    });
  }
};

/**
 * Get dish by ID
 * GET /api/user/dishes/:id
 */
export const getDishById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dishId = req.params.id;

    if (!dishId || typeof dishId !== "string") {
      res.status(400).json({
        success: false,
        error: {
          message: "Dish ID is required",
        },
      });
      return;
    }

    const dish = await dishesService.getDishById(dishId);

    res.status(200).json({
      success: true,
      data: dish,
    });
  } catch (error: any) {
    console.error("Error fetching dish:", error);
    const statusCode = error.message?.includes("not found") || 
                       error.message?.includes("not available") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching the dish",
      },
    });
  }
};

