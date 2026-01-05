import { Router } from "express";
import catererinfoRoutes from "./catererinfo/catererinfo.routes";
import dashboardRoutes from "./dashboard/dashboard.routes";

const router = Router();

// Mount catererinfo routes at /catererinfo
router.use("/catererinfo", catererinfoRoutes);

// Mount dashboard routes at /dashboard
router.use("/dashboard", dashboardRoutes);

// Placeholder route - to be expanded
router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Admin routes - coming soon",
  });
});

export default router;

