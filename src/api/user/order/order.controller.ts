import { Request, Response, NextFunction } from "express";
import * as orderService from "./order.services";

/**
 * Create an order
 * POST /api/user/orders
 */
export const createOrder = async (
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

    const { cart_item_ids, items } = req.body;

    // Either cart_item_ids or items must be provided
    if (!cart_item_ids && !items) {
      res.status(400).json({
        success: false,
        error: {
          message: "Either cart_item_ids or items array is required",
        },
      });
      return;
    }

    // If items provided, validate structure
    if (items && Array.isArray(items)) {
      for (const item of items) {
        if (!item.package_id || item.price_at_time === undefined) {
          res.status(400).json({
            success: false,
            error: {
              message: "Each item must have package_id and price_at_time",
            },
          });
          return;
        }
      }
    }

    const order = await orderService.createOrder(user.userId, {
      cart_item_ids,
      items: items || [],
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    const statusCode =
      error.message?.includes("not found") ||
      error.message?.includes("not available")
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while creating order",
      },
    });
  }
};

/**
 * Update an order
 * PUT /api/user/orders/:orderId
 */
export const updateOrder = async (
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

    const orderId = req.params.orderId;
    if (!orderId) {
      res.status(400).json({
        success: false,
        error: {
          message: "Order ID is required",
        },
      });
      return;
    }

    const { status, total_price } = req.body;

    // Validate status if provided
    if (status) {
      const validStatuses = [
        "PENDING",
        "CONFIRMED",
        "PAID",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          error: {
            message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
          },
        });
        return;
      }
    }

    const updatedOrder = await orderService.updateOrder(user.userId, orderId, {
      status,
      total_price,
    });

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error: any) {
    console.error("Error updating order:", error);
    const statusCode = error.message?.includes("not found") ||
      error.message?.includes("Cannot update")
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while updating order",
      },
    });
  }
};

/**
 * Delete an order
 * DELETE /api/user/orders/:orderId
 */
export const deleteOrder = async (
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

    const orderId = req.params.orderId;
    if (!orderId) {
      res.status(400).json({
        success: false,
        error: {
          message: "Order ID is required",
        },
      });
      return;
    }

    await orderService.deleteOrder(user.userId, orderId);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting order:", error);
    const statusCode = error.message?.includes("not found") ||
      error.message?.includes("Cannot delete")
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while deleting order",
      },
    });
  }
};

/**
 * Get all orders
 * GET /api/user/orders
 */
export const getOrders = async (
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

    const orders = await orderService.getOrders(user.userId);

    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching orders",
      },
    });
  }
};

/**
 * Get a single order by ID
 * GET /api/user/orders/:orderId
 */
export const getOrderById = async (
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

    const orderId = req.params.orderId;
    if (!orderId) {
      res.status(400).json({
        success: false,
        error: {
          message: "Order ID is required",
        },
      });
      return;
    }

    const order = await orderService.getOrderById(user.userId, orderId);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("Error fetching order:", error);
    const statusCode = error.message?.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching order",
      },
    });
  }
};

