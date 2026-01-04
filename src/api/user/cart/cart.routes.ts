import { Router } from "express";
import * as cartController from "./cart.controller";
import { authenticate } from "../../auth/auth.middleware";

const router = Router();

// All cart routes require authentication
router.use(authenticate);

/**
 * Get all cart items
 * GET /api/user/cart/items
 */
router.get("/items", cartController.getCartItems);

/**
 * Create a cart item
 * POST /api/user/cart/items
 */
router.post("/items", cartController.createCartItem);

/**
 * Update a cart item
 * PUT /api/user/cart/items/:cartItemId
 */
router.put("/items/:cartItemId", cartController.updateCartItem);

/**
 * Delete a cart item
 * DELETE /api/user/cart/items/:cartItemId
 */
router.delete("/items/:cartItemId", cartController.deleteCartItem);

export default router;

