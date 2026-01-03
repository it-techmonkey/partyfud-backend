import { Router } from "express";
import * as dishesController from "./dishes.controller";

const router = Router();

/**
 * Get all dishes with filters
 * GET /api/user/dishes?caterer_id=xxx&cuisine_type_id=xxx&category_id=xxx&search=xxx&min_price=xxx&max_price=xxx&group_by_category=true
 * 
 * Query parameters:
 * - caterer_id: Filter by caterer ID
 * - cuisine_type_id: Filter by cuisine type
 * - category_id: Filter by category
 * - sub_category_id: Filter by subcategory
 * - search: Search in dish name
 * - min_price: Minimum price
 * - max_price: Maximum price
 * - is_active: Filter by active status (default: true)
 * - group_by_category: Group results by category (true/false)
 */
router.get("/", dishesController.getAllDishes);

/**
 * Get dish by ID
 * GET /api/user/dishes/:id
 */
router.get("/:id", dishesController.getDishById);

export default router;

