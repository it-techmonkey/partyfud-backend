import { Router } from "express";
import * as orderController from "./order.controller";
import { authenticate } from "../../auth/auth.middleware";

const router = Router();

// All order routes require authentication
router.use(authenticate);

/**
 * Get all orders
 * GET /api/user/orders
 */
router.get("/", orderController.getOrders);

/**
 * Get a single order by ID
 * GET /api/user/orders/:orderId
 */
router.get("/:orderId", orderController.getOrderById);

/**
 * Create an order
 * POST /api/user/orders
 */
router.post("/", orderController.createOrder);

/**
 * Update an order
 * PUT /api/user/orders/:orderId
 */
router.put("/:orderId", orderController.updateOrder);

/**
 * Delete an order
 * DELETE /api/user/orders/:orderId
 */
router.delete("/:orderId", orderController.deleteOrder);

export default router;

