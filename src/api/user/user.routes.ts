import { Router } from "express";
import catererRoutes from "./caterer/caterer.routes";
import packagesRoutes from "./packages/packages.routes";
import dishesRoutes from "./dishes/dishes.routes";
import cartRoutes from "./cart/cart.routes";
import orderRoutes from "./order/order.routes";
import proposalRoutes from "./proposal/proposal.routes";

const router = Router();

// Mount caterer routes at /caterers
router.use("/caterers", catererRoutes);

// Mount packages routes at /packages
router.use("/packages", packagesRoutes);

// Mount dishes routes at /dishes
router.use("/dishes", dishesRoutes);

// Mount cart routes at /cart
router.use("/cart", cartRoutes);

// Mount order routes at /orders
router.use("/orders", orderRoutes);

// Mount proposal routes at /proposals
router.use("/proposals", proposalRoutes);

export default router;

