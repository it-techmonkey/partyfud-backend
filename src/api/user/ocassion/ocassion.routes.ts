import { Router } from "express";
import * as occasionController from "./ocassion.controller";

const router = Router();

/**
 * Get all occasions
 * GET /api/user/occasions
 */
router.get("/", occasionController.getAllOccasions);

/**
 * Get occasion by ID
 * GET /api/user/occasions/:occasionId
 */
router.get("/:occasionId", occasionController.getOccasionById);

export default router;

