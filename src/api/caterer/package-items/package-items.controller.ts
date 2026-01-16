import { Request, Response, NextFunction } from "express";
import * as packageItemsService from "./package-items.services";

/**
 * Create a new package item
 * POST /api/caterer/packages/items
 */
export const createPackageItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;

    const {
      dish_id,
      people_count,
      quantity,
      price_at_time,
      is_optional,
      is_addon,
      package_id, // Optional - can be null for draft items
    } = req.body;

    // Convert FormData string values to proper types
    const parsedPeopleCount = typeof people_count === 'string' 
      ? parseInt(people_count, 10) 
      : (typeof people_count === 'number' ? people_count : 0);

    const parsedQuantity = quantity !== undefined
      ? (typeof quantity === 'string' ? parseInt(quantity, 10) : quantity)
      : undefined;

    const parsedPriceAtTime = price_at_time !== undefined
      ? (typeof price_at_time === 'string' ? parseFloat(price_at_time) : price_at_time)
      : undefined;

    const parsedIsOptional = is_optional !== undefined
      ? (typeof is_optional === 'string'
          ? is_optional === 'true' || is_optional === '1'
          : is_optional)
      : undefined;

    const parsedIsAddon = is_addon !== undefined
      ? (typeof is_addon === 'string'
          ? is_addon === 'true' || is_addon === '1'
          : is_addon)
      : undefined;

    // Validate required fields
    if (!dish_id || !parsedPeopleCount) {
      res.status(400).json({
        success: false,
        error: {
          message: "Missing required fields: dish_id, people_count",
        },
      });
      return;
    }

    const packageItem = await packageItemsService.createPackageItem(catererId, {
      dish_id,
      people_count: parsedPeopleCount,
      quantity: parsedQuantity,
      price_at_time: parsedPriceAtTime,
      is_optional: parsedIsOptional,
      is_addon: parsedIsAddon,
      package_id: package_id || undefined,
    });

    res.status(201).json({
      success: true,
      data: packageItem,
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
 * Get all package items for the authenticated caterer
 * GET /api/caterer/packages/items?draft=true (optional: filter only draft items without package_id)
 */
export const getPackageItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("🔵 [GET PACKAGE ITEMS] API hit");
  console.log("🔵 [GET PACKAGE ITEMS] Request URL:", req.url);
  console.log("🔵 [GET PACKAGE ITEMS] Request method:", req.method);
  console.log("🔵 [GET PACKAGE ITEMS] Query params:", req.query);
  console.log("🔵 [GET PACKAGE ITEMS] Headers:", JSON.stringify(req.headers, null, 2));
  
  try {
    const user = (req as any).user;
    console.log("🔵 [GET PACKAGE ITEMS] Decoded user from token:", JSON.stringify(user, null, 2));
    
    if (!user || !user.userId) {
      console.log("❌ [GET PACKAGE ITEMS] No user or userId found");
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
      return;
    }

    const catererId = user.userId;
    const draftOnly = req.query.draft === 'true' || req.query.draft === '1';
    
    console.log("🔵 [GET PACKAGE ITEMS] Extracted catererId:", catererId);
    console.log("🔵 [GET PACKAGE ITEMS] User type:", user.type);
    console.log("🔵 [GET PACKAGE ITEMS] User email:", user.email);
    console.log("🔵 [GET PACKAGE ITEMS] Draft only filter:", draftOnly);

    console.log("🔵 [GET PACKAGE ITEMS] Calling service.getPackageItems with catererId:", catererId, "draftOnly:", draftOnly);
    const result = await packageItemsService.getPackageItems(catererId, draftOnly);
    console.log("✅ [GET PACKAGE ITEMS] Service returned", result?.categories?.length || 0, "categories");

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error getting package items:", error);
    res.status(error.message?.includes("not found") ? 404 : 400).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Get package item by ID
 * GET /api/caterer/packages/items/:id
 */
export const getPackageItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const itemId = req.params.id;

    const packageItem = await packageItemsService.getPackageItemById(
      itemId,
      catererId
    );

    res.status(200).json({
      success: true,
      data: packageItem,
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
 * Update a package item
 * PUT /api/caterer/packages/items/:id
 */
export const updatePackageItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const itemId = req.params.id;

    const {
      dish_id,
      people_count,
      quantity,
      price_at_time,
      is_optional,
      is_addon,
      package_id,
    } = req.body;

    // Convert FormData string values to proper types
    const parsedPeopleCount = people_count !== undefined
      ? (typeof people_count === 'string' ? parseInt(people_count, 10) : people_count)
      : undefined;

    const parsedQuantity = quantity !== undefined
      ? (typeof quantity === 'string' ? parseInt(quantity, 10) : quantity)
      : undefined;

    const parsedPriceAtTime = price_at_time !== undefined
      ? (typeof price_at_time === 'string' ? parseFloat(price_at_time) : price_at_time)
      : undefined;

    const parsedIsOptional = is_optional !== undefined
      ? (typeof is_optional === 'string'
          ? is_optional === 'true' || is_optional === '1'
          : is_optional)
      : undefined;

    const parsedIsAddon = is_addon !== undefined
      ? (typeof is_addon === 'string'
          ? is_addon === 'true' || is_addon === '1'
          : is_addon)
      : undefined;

    const packageItem = await packageItemsService.updatePackageItem(
      itemId,
      catererId,
      {
        dish_id,
        people_count: parsedPeopleCount,
        quantity: parsedQuantity,
        price_at_time: parsedPriceAtTime,
        is_optional: parsedIsOptional,
        is_addon: parsedIsAddon,
        package_id: package_id || undefined,
      }
    );

    res.status(200).json({
      success: true,
      data: packageItem,
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
 * Delete a package item
 * DELETE /api/caterer/packages/items/:id
 */
export const deletePackageItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const itemId = req.params.id;

    await packageItemsService.deletePackageItem(itemId, catererId);

    res.status(200).json({
      success: true,
      message: "Package item deleted successfully",
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
 * Link package items to a package
 * POST /api/caterer/packages/:id/items/link
 */
export const linkPackageItemsToPackage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    // Get packageId from params (route: /packages/:id/items/link)
    const packageId = req.params.id;

    const { item_ids } = req.body;

    if (!item_ids || !Array.isArray(item_ids) || item_ids.length === 0) {
      res.status(400).json({
        success: false,
        error: {
          message: "item_ids array is required",
        },
      });
      return;
    }

    const updatedItems = await packageItemsService.linkPackageItemsToPackage(
      packageId,
      item_ids,
      catererId
    );

    res.status(200).json({
      success: true,
      data: updatedItems,
      message: "Package items linked successfully",
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

