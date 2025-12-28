import { Router } from "express";
import { authenticate, requireRole } from "../../auth/auth.middleware";
import { getDashboard } from "./dashboard.controller";

const router = Router();

// Get dashboard statistics
router.get("/", authenticate, requireRole("CATERER"), getDashboard);

export default router;

