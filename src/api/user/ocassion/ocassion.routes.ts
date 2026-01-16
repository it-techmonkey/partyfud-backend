import { Router } from "express";
import * as occasionController from "./ocassion.controller";

const router = Router();

/**
 * Get all occasions
 * GET /api/user/occasions
 */
router.get("/", occasionController.getAllOccasions);

/**
 * Get all cuisine types
 * GET /api/user/occasions/cuisines
 */
router.get("/cuisines", occasionController.getAllCuisineTypes);

/**
 * Get occasion by ID
 * GET /api/user/occasions/:occasionId
 */
router.get("/:occasionId", occasionController.getOccasionById);

export default router;

