import { Router } from "express";
import dishesRoutes from "./dishes/dishes.routes";
import packagesRoutes from "./packages/packages.routes";
import packageItemsRoutes from "./package-items/package-items.routes";
import metadataRoutes from "./metadata.routes";
import dashboardRoutes from "./dashboard/dashboard.routes";

const router = Router();

// Mount dashboard routes at /dashboard
router.use("/dashboard", dashboardRoutes);

// Mount dish routes at /dishes
router.use("/dishes", dishesRoutes);

// Mount package items routes at /packages/items FIRST (before /packages to avoid route conflicts)
router.use("/packages/items", packageItemsRoutes);

// Mount package routes at /packages (must come after /packages/items)
router.use("/packages", packagesRoutes);

// Mount metadata routes at /metadata
router.use("/metadata", metadataRoutes);

export default router;
