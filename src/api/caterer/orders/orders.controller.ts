import { Request, Response, NextFunction } from "express";
import * as orderService from "./orders.services";

/**
 * Get all orders for the authenticated caterer
 * GET /api/caterer/orders
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

    const orders = await orderService.getOrdersForCaterer(user.userId);

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
 * Get a single order by ID for the authenticated caterer
 * GET /api/caterer/orders/:orderId
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

    const order = await orderService.getOrderByIdForCaterer(user.userId, orderId);

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

/**
 * Update order status
 * PUT /api/caterer/orders/:orderId
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
    const { status } = req.body;

    if (!orderId) {
      res.status(400).json({
        success: false,
        error: {
          message: "Order ID is required",
        },
      });
      return;
    }

    if (!status) {
      res.status(400).json({
        success: false,
        error: {
          message: "Status is required",
        },
      });
      return;
    }

    const validStatuses = ["PENDING", "CONFIRMED", "PAID", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        error: {
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
      });
      return;
    }

    const order = await orderService.updateOrderStatus(user.userId, orderId, { status });

    res.status(200).json({
      success: true,
      data: order,
      message: "Order status updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating order:", error);
    const statusCode =
      error.message?.includes("not found") ||
      error.message?.includes("does not belong") ||
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

