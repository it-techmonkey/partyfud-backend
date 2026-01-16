import { Request, Response, NextFunction } from "express";
import * as cartService from "./cart.services";

/**
 * Create a cart item
 * POST /api/user/cart/items
 */
export const createCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
      return;
    }

    const { package_id, location, guests, date, price_at_time } =
      req.body;

    if (!package_id) {
      res.status(400).json({
        success: false,
        error: {
          message: "package_id is required",
        },
      });
      return;
    }

    const cartItem = await cartService.createCartItem(user.userId, {
      package_id,
      location,
      guests,
      date: date ? new Date(date) : undefined,
      price_at_time,
    });

    res.status(201).json({
      success: true,
      data: cartItem,
    });
  } catch (error: any) {
    console.error("Error creating cart item:", error);
    const statusCode =
      error.message?.includes("not found") ||
      error.message?.includes("not available") ||
      error.message?.includes("already exists")
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while creating cart item",
      },
    });
  }
};

/**
 * Update a cart item
 * PUT /api/user/cart/items/:cartItemId
 */
export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
      return;
    }

    const cartItemId = req.params.cartItemId;
    if (!cartItemId) {
      res.status(400).json({
        success: false,
        error: {
          message: "Cart item ID is required",
        },
      });
      return;
    }

    const { location, guests, date, price_at_time } = req.body;

    const updatedCartItem = await cartService.updateCartItem(user.userId, cartItemId, {
      location,
      guests,
      date: date ? new Date(date) : undefined,
      price_at_time,
    });

    res.status(200).json({
      success: true,
      data: updatedCartItem,
    });
  } catch (error: any) {
    console.error("Error updating cart item:", error);
    const statusCode = error.message?.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while updating cart item",
      },
    });
  }
};

/**
 * Delete a cart item
 * DELETE /api/user/cart/items/:cartItemId
 */
export const deleteCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
      return;
    }

    const cartItemId = req.params.cartItemId;
    if (!cartItemId) {
      res.status(400).json({
        success: false,
        error: {
          message: "Cart item ID is required",
        },
      });
      return;
    }

    await cartService.deleteCartItem(user.userId, cartItemId);

    res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting cart item:", error);
    const statusCode = error.message?.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while deleting cart item",
      },
    });
  }
};

/**
 * Get all cart items
 * GET /api/user/cart/items
 */
export const getCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
      return;
    }

    const cartItems = await cartService.getCartItems(user.userId);

    res.status(200).json({
      success: true,
      data: cartItems,
      count: cartItems.length,
    });
  } catch (error: any) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching cart items",
      },
    });
  }
};

