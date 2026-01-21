import { Router } from "express";
import { authenticate, requireRole } from "../../auth/auth.middleware";
import {
  createAddOn,
  getAddOnsByPackageId,
  getAddOnById,
  updateAddOn,
  deleteAddOn,
} from "./add-ons.controller";

const router = Router();

// All routes require authentication and CATERER role
router.use(authenticate);
router.use(requireRole("CATERER"));

// Add-ons routes
// Note: Package-specific routes must come before the general :id route
router.post("/packages/:packageId/add-ons", createAddOn);
router.get("/packages/:packageId/add-ons", getAddOnsByPackageId);
router.get("/add-ons/:id", getAddOnById);
router.put("/add-ons/:id", updateAddOn);
router.delete("/add-ons/:id", deleteAddOn);

export default router;
