import { Router } from "express";
import catererRoutes from "./caterer/caterer.routes";
import packagesRoutes from "./packages/packages.routes";
import dishesRoutes from "./dishes/dishes.routes";

const router = Router();

// Mount caterer routes at /caterers
router.use("/caterers", catererRoutes);

// Mount packages routes at /packages
router.use("/packages", packagesRoutes);

// Mount dishes routes at /dishes
router.use("/dishes", dishesRoutes);

export default router;

