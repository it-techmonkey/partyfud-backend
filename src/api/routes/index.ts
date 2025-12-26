import { Router } from "express";
import authRoutes from "../auth/auth.routes";
import userRoutes from "../user/user.routes";
import adminRoutes from "../admin/admin.routes";
import catererRoutes from "../caterer/caterer.routes";

const router = Router();

// Health check route
router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// Auth routes (authentication for all user types)
router.use("/auth", authRoutes);

// User routes
router.use("/user", userRoutes);

// Admin routes
router.use("/admin", adminRoutes);

// Caterer routes
router.use("/caterer", catererRoutes);

export default router;

