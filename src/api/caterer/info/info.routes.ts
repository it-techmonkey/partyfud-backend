import { Router } from "express";
import { authenticate, requireRole } from "../../auth/auth.middleware";
import * as infoController from "./info.controller";

const router = Router();

// All routes require authentication and CATERER role
router.use(authenticate);
router.use(requireRole("CATERER"));

/**
 * GET /api/caterer/info
 * Get caterer info for authenticated caterer
 */
router.get("/", infoController.getCatererInfo);

export default router;
