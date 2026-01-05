import { Router } from "express";
import * as packagesController from "./packages.controller";
import { authenticate } from "../../auth/auth.middleware";

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
 * Get all package types
 * GET /api/user/packages/types
 */
router.get("/types", packagesController.getAllPackageTypes);

/**
 * Get packages created by the authenticated user
 * GET /api/user/packages/my-packages
 * 
 * Requires authentication
 * Returns only packages created by the logged-in user
 */
router.get("/my-packages", authenticate, packagesController.getMyPackages);

/**
 * Get packages by occasion name
 * GET /api/user/packages/occasion/:occasionName
 * 
 * NOTE: This route must be defined BEFORE /all to avoid route conflicts
 */
router.get("/occasion/:occasionName", packagesController.getPackagesByOccasionName);

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
 * - occasion_id: Filter by occasion/event type ID
 * - occasion_name: Filter by occasion/event type name (case-insensitive, converts to occasion_id)
 * - cuisine_type_id: Filter by cuisine type
 * - category_id: Filter by category
 * - package_type: Filter by package type name (case-insensitive)
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
 * Create a custom package for a user
 * POST /api/user/packages
 * 
 * Requires authentication
 * 
 * Request body:
 * {
 *   name?: string,                    // Optional, auto-generated if not provided
 *   dish_ids: string[],              // Required: Array of dish IDs
 *   people_count: number,             // Required: Number of people
 *   package_type_id?: string,        // Optional: Package type ID
 *   quantities?: { [dish_id: string]: number } // Optional: Quantities for each dish
 * }
 */
router.post("/", authenticate, packagesController.createCustomPackage);

/**
 * Get packages by caterer ID (query parameter)
 * GET /api/user/packages?caterer_id=xxx
 */
router.get("/", packagesController.getPackagesByCatererId); // Support query parameter

export default router;

