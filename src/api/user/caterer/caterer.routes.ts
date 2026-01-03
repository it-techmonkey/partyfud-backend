import { Router } from "express";
import * as catererController from "./caterer.controller";

const router = Router();

/**
 * Filter and fetch all caterers
 * POST /api/user/caterers
 * 
 * Request body:
 * {
 *   location?: string,
 *   guests?: number,
 *   date?: string (ISO date),
 *   minBudget?: number,
 *   maxBudget?: number,
 *   menuType?: {
 *     fixed?: boolean,
 *     customizable?: boolean,
 *     liveStations?: boolean
 *   },
 *   search?: string
 * }
 */
router.post("/", catererController.filterCaterers);

/**
 * Get caterer by ID
 * GET /api/user/caterers/:id
 */
router.get("/:id", catererController.getCatererById);

export default router;

