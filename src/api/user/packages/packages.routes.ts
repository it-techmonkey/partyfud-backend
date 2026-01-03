import { Router } from "express";
import * as packagesController from "./packages.controller";

const router = Router();

/**
 * Get packages by caterer ID
 * GET /api/user/packages/caterer/:catererId
 * 
 * Alternative: GET /api/user/packages?caterer_id=xxx
 * 
 * Note: The controller handles both route parameter and query parameter
 */
router.get("/caterer/:catererId", packagesController.getPackagesByCatererId);

/**
 * Get all packages with filters
 * GET /api/user/packages/all?location=xxx&min_price=xxx&max_price=xxx&...
 * 
 * IMPORTANT: This route must be defined BEFORE /:packageId to avoid route conflicts
 * 
 * Query parameters:
 * - caterer_id: Filter by caterer ID
 * - location: Filter by location (service_area)
 * - region: Filter by region
 * - min_guests: Minimum number of guests
 * - max_guests: Maximum number of guests
 * - min_price: Minimum price
 * - max_price: Maximum price
 * - occasion_id: Filter by occasion/event type
 * - cuisine_type_id: Filter by cuisine type
 * - category_id: Filter by category
 * - search: Search in package name
 * - menu_type: 'fixed' or 'customizable'
 * - sort_by: 'price_asc', 'price_desc', 'rating_desc', 'created_desc'
 */
router.get("/all", packagesController.getAllPackages);

/**
 * Get a single package by ID
 * GET /api/user/packages/:packageId
 * 
 * NOTE: This must be defined AFTER /all to avoid route conflicts
 */
router.get("/:packageId", packagesController.getPackageById);

/**
 * Get packages by caterer ID (query parameter)
 * GET /api/user/packages?caterer_id=xxx
 */
router.get("/", packagesController.getPackagesByCatererId); // Support query parameter

export default router;

