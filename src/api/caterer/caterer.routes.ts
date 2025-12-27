import { Router } from "express";
import dishesRoutes from "./dishes/dishes.routes";
import packagesRoutes from "./packages/packages.routes";
import metadataRoutes from "./metadata.routes";

const router = Router();

// Mount dish routes at /dishes
router.use("/dishes", dishesRoutes);

// Mount package routes at /packages
router.use("/packages", packagesRoutes);

// Mount metadata routes at /metadata
router.use("/metadata", metadataRoutes);

export default router;
