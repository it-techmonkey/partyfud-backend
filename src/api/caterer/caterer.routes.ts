import { Router } from "express";
import dishesRoutes from "./dishes/dishes.routes";
import packagesRoutes from "./packages/packages.routes";
import packageItemsRoutes from "./package-items/package-items.routes";
import addOnsRoutes from "./add-ons/add-ons.routes";
import metadataRoutes from "./metadata.routes";
import dashboardRoutes from "./dashboard/dashboard.routes";
import proposalRoutes from "./proposal/proposal.routes";
import ordersRoutes from "./orders/orders.routes";
import infoRoutes from "./info/info.routes";
import onboardingRoutes from "./onboarding/onboarding.routes";

const router = Router();

// Mount dashboard routes at /dashboard
router.use("/dashboard", dashboardRoutes);

// Mount dish routes at /dishes
router.use("/dishes", dishesRoutes);

// Mount package items routes at /packages/items FIRST (before /packages to avoid route conflicts)
router.use("/packages/items", packageItemsRoutes);

// Mount add-ons routes BEFORE /packages to avoid route conflicts with /:id
router.use("/", addOnsRoutes);

// Mount package routes at /packages (must come after add-ons routes)
router.use("/packages", packagesRoutes);

// Mount metadata routes at /metadata
router.use("/metadata", metadataRoutes);

// Mount proposal routes at /proposals
router.use("/proposals", proposalRoutes);

// Mount order routes at /orders
router.use("/orders", ordersRoutes);

// Mount info routes at /info
router.use("/info", infoRoutes);

// Mount onboarding routes at /onboarding
router.use("/onboarding", onboardingRoutes);

export default router;
