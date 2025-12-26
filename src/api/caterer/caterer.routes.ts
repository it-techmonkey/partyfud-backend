import { Router } from "express";
import dishesRoutes from "./dishes/dishes.routes";
import packagesRoutes from "./packages/packages.routes";

const router = Router();

// Mount dish routes at /dishes
router.use("/dishes", dishesRoutes);

// Mount package routes at /packages
router.use("/packages", packagesRoutes);

export default router;
