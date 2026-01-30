import { Request, Response, NextFunction } from "express";
import * as dishesService from "./dishes.services";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import prisma from "../../../lib/prisma";

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
    const groupByCategory = req.query.group_by_category === 'true' || req.query.group_by_category === '1';

    // If group_by_category is requested, return grouped structure
    if (groupByCategory) {
      const groupedDishes = await dishesService.getDishesByCatererIdGrouped(catererId, {
        cuisine_type_id,
        category_id,
      });

      res.status(200).json({
        success: true,
        data: groupedDishes,
      });
    } else {
      // Return flat array (existing behavior)
      const dishes = await dishesService.getDishesByCatererId(catererId, {
        cuisine_type_id,
        category_id,
      });

      res.status(200).json({
        success: true,
        data: dishes,
      });
    }
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

    // Handle image upload if provided
    let image_url: string | undefined = req.body.image_url; // Fallback to URL if provided
    
    if ((req as any).file) {
      try {
        image_url = await uploadToCloudinary((req as any).file, 'partyfud/dishes');
      } catch (uploadError: any) {
        res.status(400).json({
          success: false,
          error: {
            message: `Image upload failed: ${uploadError.message}`,
          },
        });
        return;
      }
    }

    const {
      name,
      cuisine_type_id,
      category_id,
      sub_category_id,
      quantity,
      pieces,
      price,
      serves_people,
      currency,
      is_active,
    } = req.body;

    // Quantity is now a free text field (string)
    const parsedQuantity = quantity || undefined;

    const parsedPieces = pieces 
      ? (typeof pieces === 'string' ? parseInt(pieces, 10) : pieces)
      : 1;

    const parsedPrice = typeof price === 'string' 
      ? parseInt(price, 10) 
      : (typeof price === 'number' ? Math.round(price) : 0);

    const parsedServesPeople = serves_people 
      ? (typeof serves_people === 'string' ? parseInt(serves_people, 10) : serves_people)
      : undefined;

    const parsedIsActive = typeof is_active === 'string'
      ? is_active === 'true' || is_active === '1'
      : (typeof is_active === 'boolean' ? is_active : true);

    // Validate required fields
    if (!name || !cuisine_type_id || !parsedPrice) {
      res.status(400).json({
        success: false,
        error: {
          message:
            "Missing required fields: name, cuisine_type_id, price",
        },
      });
      return;
    }

    // Look up names from IDs
    const cuisineType = await prisma.cuisineType.findUnique({
      where: { id: cuisine_type_id },
    });
    if (!cuisineType) {
      res.status(400).json({
        success: false,
        error: { message: `Cuisine type with ID "${cuisine_type_id}" not found` },
      });
      return;
    }

    // Category is optional
    let category = null;
    if (category_id) {
      category = await prisma.category.findUnique({
        where: { id: category_id },
      });
      if (!category) {
        res.status(400).json({
          success: false,
          error: { message: `Category with ID "${category_id}" not found` },
        });
        return;
      }
    }

    // Check if category has subcategories (only if category is provided)
    let hasSubCategories = false;
    if (category_id) {
      const subCategoriesCount = await prisma.subCategory.count({
        where: { category_id: category_id },
      });
      hasSubCategories = subCategoriesCount > 0;
    }

    let subCategory = null;
    if (sub_category_id) {
      if (!category_id) {
        res.status(400).json({
          success: false,
          error: { message: `Sub category requires a category to be selected` },
        });
        return;
      }
      subCategory = await prisma.subCategory.findUnique({
        where: { id: sub_category_id },
      });
      if (!subCategory) {
        res.status(400).json({
          success: false,
          error: { message: `Sub category with ID "${sub_category_id}" not found` },
        });
        return;
      }
      // Verify subcategory belongs to the selected category
      if (subCategory.category_id !== category_id) {
        res.status(400).json({
          success: false,
          error: { message: `Sub category does not belong to the selected category` },
        });
        return;
      }
    }
    // Sub-category is optional - can be null even if category has subcategories

    // Parse freeform_ids if provided (can be string or array)
    // FormData sends multiple values with the same key as an array
    let freeformIdsArray: string[] | undefined;
    
    // Check if freeform_ids exists in body (could be array or single value)
    const freeformIdsValue = req.body.freeform_ids;
    if (freeformIdsValue) {
      if (Array.isArray(freeformIdsValue)) {
        freeformIdsArray = freeformIdsValue.filter(id => id && typeof id === 'string');
      } else if (typeof freeformIdsValue === 'string') {
        // Handle comma-separated string or single value
        freeformIdsArray = freeformIdsValue.split(',').map(id => id.trim()).filter(id => id);
      }
    }

    const dishData: any = {
      name,
      image_url,
      cuisine_type: cuisineType.name,
      quantity: parsedQuantity,
      pieces: parsedPieces,
      price: parsedPrice,
      serves_people: parsedServesPeople,
      currency: currency || 'AED',
      is_active: parsedIsActive,
      freeform_ids: freeformIdsArray,
    };

    // Only include category if it exists
    if (category) {
      dishData.category = category.name;
    }

    // Only include sub_category if subCategory exists
    if (subCategory) {
      dishData.sub_category = subCategory.name;
    }

    const dish = await dishesService.createDish(catererId, dishData);

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

    // Handle image upload if provided
    let image_url: string | undefined = req.body.image_url; // Fallback to URL if provided
    
    if ((req as any).file) {
      try {
        image_url = await uploadToCloudinary((req as any).file, 'partyfud/dishes');
      } catch (uploadError: any) {
        res.status(400).json({
          success: false,
          error: {
            message: `Image upload failed: ${uploadError.message}`,
          },
        });
        return;
      }
    }

    const {
      name,
      cuisine_type_id,
      category_id,
      sub_category_id,
      quantity,
      pieces,
      price,
      serves_people,
      currency,
      is_active,
    } = req.body;

    // Quantity is now a free text field (string)
    const parsedQuantity = quantity !== undefined ? quantity : undefined;

    const parsedPieces = pieces !== undefined
      ? (typeof pieces === 'string' ? parseInt(pieces, 10) : pieces)
      : undefined;

    const parsedPrice = price !== undefined
      ? (typeof price === 'string' ? parseInt(price, 10) : Math.round(price))
      : undefined;

    const parsedServesPeople = serves_people !== undefined
      ? (serves_people === null || serves_people === '' 
          ? null 
          : (typeof serves_people === 'string' ? parseInt(serves_people, 10) : serves_people))
      : undefined;

    const parsedIsActive = is_active !== undefined
      ? (typeof is_active === 'string'
          ? is_active === 'true' || is_active === '1'
          : is_active)
      : undefined;

    // Prepare update data
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (parsedQuantity !== undefined) updateData.quantity = parsedQuantity;
    if (parsedPieces !== undefined) updateData.pieces = parsedPieces;
    if (parsedPrice !== undefined) updateData.price = parsedPrice;
    if (parsedServesPeople !== undefined) updateData.serves_people = parsedServesPeople;
    if (currency !== undefined) updateData.currency = currency;
    if (parsedIsActive !== undefined) updateData.is_active = parsedIsActive;

    // Look up names from IDs if provided
    if (cuisine_type_id) {
      const cuisineType = await prisma.cuisineType.findUnique({
        where: { id: cuisine_type_id },
      });
      if (!cuisineType) {
        res.status(400).json({
          success: false,
          error: { message: `Cuisine type with ID "${cuisine_type_id}" not found` },
        });
        return;
      }
      updateData.cuisine_type = cuisineType.name;
    }

    if (category_id) {
      const category = await prisma.category.findUnique({
        where: { id: category_id },
      });
      if (!category) {
        res.status(400).json({
          success: false,
          error: { message: `Category with ID "${category_id}" not found` },
        });
        return;
      }
      updateData.category = category.name;

      // If sub_category_id is also provided, look it up
      if (sub_category_id) {
        const subCategory = await prisma.subCategory.findUnique({
          where: { id: sub_category_id },
        });
        if (!subCategory) {
          res.status(400).json({
            success: false,
            error: { message: `Sub category with ID "${sub_category_id}" not found` },
          });
          return;
        }
        updateData.sub_category = subCategory.name;
      }
    } else if (sub_category_id) {
      // If only sub_category_id is provided, we need the existing category
      const existingDish = await prisma.dish.findUnique({
        where: { id: dishId },
        select: { category_id: true },
      });
      if (existingDish) {
        const subCategory = await prisma.subCategory.findUnique({
          where: { id: sub_category_id },
        });
        if (!subCategory) {
          res.status(400).json({
            success: false,
            error: { message: `Sub category with ID "${sub_category_id}" not found` },
          });
          return;
        }
        updateData.sub_category = subCategory.name;
      }
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const dish = await dishesService.updateDish(dishId, catererId, updateData);

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

