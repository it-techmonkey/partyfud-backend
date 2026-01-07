import { Router } from "express";
import * as dashboardController from "./dashboard.controller";

const router = Router();

/**
 * Get dashboard statistics
 * GET /api/admin/dashboard/stats
 */
router.get("/stats", dashboardController.getDashboardStats);

export default router;
