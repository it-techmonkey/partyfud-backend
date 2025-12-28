import { Router } from "express";
import { authenticate, requireRole } from "../../auth/auth.middleware";
import {
  createPackageItem,
  getPackageItems,
  getPackageItemById,
  updatePackageItem,
  deletePackageItem,
  linkPackageItemsToPackage,
} from "./package-items.controller";

const router = Router();

router.use(authenticate);
router.use(requireRole("CATERER"));

// Package Items routes
router.post("/", createPackageItem);
router.get("/", getPackageItems);
router.get("/:id", getPackageItemById);
router.put("/:id", updatePackageItem);
router.delete("/:id", deletePackageItem);

// Note: Link route is handled in packages.routes.ts as POST /packages/:id/items/link

export default router;

