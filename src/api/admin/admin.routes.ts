import { Router } from "express";
import catererinfoRoutes from "./catererinfo/catererinfo.routes";

const router = Router();

// Mount catererinfo routes at /catererinfo
router.use("/catererinfo", catererinfoRoutes);

// Placeholder route - to be expanded
router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Admin routes - coming soon",
  });
});

export default router;

