import { Request, Response, NextFunction } from "express";
import * as dishesService from "./dishes.services";

/**
 * Get all dishes by caterer ID
 * GET /api/caterer/dishes
 */
export const getDishes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;

    // Get query parameters for filters
    const cuisine_type_id = req.query.cuisine_type_id as string | undefined;
    const category_id = req.query.category_id as string | undefined;

    const dishes = await dishesService.getDishesByCatererId(catererId, {
      cuisine_type_id,
      category_id,
    });

    res.status(200).json({
      success: true,
      data: dishes,
    });
  } catch (error: any) {
    const statusCode = error.message?.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Get dish by ID
 * GET /api/caterer/dishes/:id
 */
export const getDishById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const dishId = req.params.id;

    const dish = await dishesService.getDishById(dishId, catererId);

    res.status(200).json({
      success: true,
      data: dish,
    });
  } catch (error: any) {
    res.status(error.message?.includes("not found") ? 404 : 400).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Create a new dish
 * POST /api/caterer/dishes
 */
export const createDish = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;

    const {
      name,
      image_url,
      cuisine_type_id,
      category_id,
      sub_category_id,
      quantity_in_gm,
      pieces,
      price,
      currency,
      is_active,
    } = req.body;

    // Validate required fields
    if (!name || !cuisine_type_id || !category_id || !sub_category_id || !price) {
      res.status(400).json({
        success: false,
        error: {
          message:
            "Missing required fields: name, cuisine_type_id, category_id, sub_category_id, price",
        },
      });
      return;
    }

    const dish = await dishesService.createDish(catererId, {
      name,
      image_url,
      cuisine_type_id,
      category_id,
      sub_category_id,
      quantity_in_gm,
      pieces,
      price,
      currency,
      is_active,
    });

    res.status(201).json({
      success: true,
      data: dish,
    });
  } catch (error: any) {
    res.status(error.message?.includes("not found") ? 404 : 400).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Update a dish
 * PUT /api/caterer/dishes/:id
 */
export const updateDish = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const dishId = req.params.id;

    const {
      name,
      image_url,
      cuisine_type_id,
      category_id,
      sub_category_id,
      quantity_in_gm,
      pieces,
      price,
      currency,
      is_active,
    } = req.body;

    const dish = await dishesService.updateDish(dishId, catererId, {
      name,
      image_url,
      cuisine_type_id,
      category_id,
      sub_category_id,
      quantity_in_gm,
      pieces,
      price,
      currency,
      is_active,
    });

    res.status(200).json({
      success: true,
      data: dish,
    });
  } catch (error: any) {
    res.status(error.message?.includes("not found") ? 404 : 400).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Delete a dish
 * DELETE /api/caterer/dishes/:id
 */
export const deleteDish = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const dishId = req.params.id;

    await dishesService.deleteDish(dishId, catererId);

    res.status(200).json({
      success: true,
      message: "Dish deleted successfully",
    });
  } catch (error: any) {
    res.status(error.message?.includes("not found") ? 404 : 400).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

