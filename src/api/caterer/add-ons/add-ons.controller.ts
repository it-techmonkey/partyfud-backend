import { Request, Response, NextFunction } from "express";
import * as addOnsService from "./add-ons.services";

/**
 * Create a new add-on for a fixed menu package
 * POST /api/caterer/packages/:packageId/add-ons
 */
export const createAddOn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const packageId = req.params.packageId;

    const { name, description, price, currency, is_active } = req.body;

    // Convert price to integer - ensure it's a whole number
    // Frontend sends numeric values, we store as integer
    let parsedPrice: number | undefined;
    if (price !== undefined && price !== null && price !== '') {
      const numValue = typeof price === 'string' ? parseFloat(price) : price;
      if (!isNaN(numValue) && numValue >= 0) {
        parsedPrice = Math.round(numValue); // Round to nearest integer
      }
    }

    const parsedIsActive = is_active !== undefined
      ? (typeof is_active === 'string'
          ? is_active === 'true' || is_active === '1'
          : is_active)
      : undefined;

    // Validate required fields
    if (!name || parsedPrice === undefined || parsedPrice < 0) {
      res.status(400).json({
        success: false,
        error: {
          message: "Missing required fields: name, price (must be >= 0)",
        },
      });
      return;
    }

    const addOn = await addOnsService.createAddOn(catererId, {
      package_id: packageId,
      name,
      description,
      price: parsedPrice,
      currency,
      is_active: parsedIsActive,
    });

    res.status(201).json({
      success: true,
      data: addOn,
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
 * Get all add-ons for a package
 * GET /api/caterer/packages/:packageId/add-ons
 */
export const getAddOnsByPackageId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const packageId = req.params.packageId;

    const addOns = await addOnsService.getAddOnsByPackageId(packageId, catererId);

    res.status(200).json({
      success: true,
      data: addOns,
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
 * Get add-on by ID
 * GET /api/caterer/add-ons/:id
 */
export const getAddOnById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const addOnId = req.params.id;

    const addOn = await addOnsService.getAddOnById(addOnId, catererId);

    res.status(200).json({
      success: true,
      data: addOn,
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
 * Update an add-on
 * PUT /api/caterer/add-ons/:id
 */
export const updateAddOn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const addOnId = req.params.id;

    const { name, description, price, currency, is_active } = req.body;

    // Convert price to integer - ensure it's a whole number
    // Frontend sends numeric values, we store as integer
    let parsedPrice: number | undefined;
    if (price !== undefined && price !== null && price !== '') {
      const numValue = typeof price === 'string' ? parseFloat(price) : price;
      if (!isNaN(numValue) && numValue >= 0) {
        parsedPrice = Math.round(numValue); // Round to nearest integer
      }
    }

    const parsedIsActive = is_active !== undefined
      ? (typeof is_active === 'string'
          ? is_active === 'true' || is_active === '1'
          : is_active)
      : undefined;

    // Validate price if provided
    if (parsedPrice !== undefined && parsedPrice < 0) {
      res.status(400).json({
        success: false,
        error: {
          message: "Price must be >= 0",
        },
      });
      return;
    }

    const addOn = await addOnsService.updateAddOn(addOnId, catererId, {
      name,
      description,
      price: parsedPrice,
      currency,
      is_active: parsedIsActive,
    });

    res.status(200).json({
      success: true,
      data: addOn,
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
 * Delete an add-on
 * DELETE /api/caterer/add-ons/:id
 */
export const deleteAddOn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    const catererId = user.userId;
    const addOnId = req.params.id;

    await addOnsService.deleteAddOn(addOnId, catererId);

    res.status(200).json({
      success: true,
      message: "Add-on deleted successfully",
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
