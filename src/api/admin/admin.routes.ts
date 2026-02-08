import { Router } from "express";
import catererinfoRoutes from "./catererinfo/catererinfo.routes";
import dashboardRoutes from "./dashboard/dashboard.routes";
import metadataRoutes from "./metadata/metadata.routes";
import ordersRoutes from "./orders/orders.routes";

const router = Router();

console.log('✅ [Routes] Admin routes initializing...');

// Mount catererinfo routes at /catererinfo
// The financials route is defined inside catererinfo.routes.ts before the /:id route
router.use("/catererinfo", catererinfoRoutes);

// Mount dashboard routes at /dashboard
router.use("/dashboard", dashboardRoutes);

// Mount metadata routes at /metadata
router.use("/metadata", metadataRoutes);

// Mount orders routes at /orders
router.use("/orders", ordersRoutes);

// Placeholder route - to be expanded
router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Admin routes - coming soon",
  });
});

console.log('✅ [Routes] Admin routes initialized');

export default router;
