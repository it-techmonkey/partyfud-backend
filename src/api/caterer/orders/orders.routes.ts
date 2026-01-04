import { Router } from "express";
import * as orderController from "./orders.controller";
import { authenticate } from "../../auth/auth.middleware";

const router = Router();

// All order routes require authentication
router.use(authenticate);

/**
 * Get all orders for the authenticated caterer
 * GET /api/caterer/orders
 */
router.get("/", orderController.getOrders);

/**
 * Get a single order by ID
 * GET /api/caterer/orders/:orderId
 */
router.get("/:orderId", orderController.getOrderById);

/**
 * Update order status
 * PUT /api/caterer/orders/:orderId
 * 
 * Request body:
 * {
 *   status: "PENDING" | "CONFIRMED" | "PAID" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED"
 * }
 */
router.put("/:orderId", orderController.updateOrder);

export default router;

