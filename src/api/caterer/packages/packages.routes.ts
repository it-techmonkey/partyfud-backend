import { Router } from "express";
import { authenticate, requireRole } from "../../auth/auth.middleware";
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from "./packages.controller";
import { linkPackageItemsToPackage } from "../package-items/package-items.controller";
import { uploadSingle } from "../../../middleware/upload";

const router = Router();

// All routes require authentication and CATERER role
router.use(authenticate);
router.use(requireRole("CATERER"));

// Package routes
router.get("/", getPackages);
router.post("/", uploadSingle, createPackage);
// Link route must come before /:id to avoid route conflicts
router.post("/:id/items/link", linkPackageItemsToPackage);
router.get("/:id", getPackageById);
router.put("/:id", uploadSingle, updatePackage);
router.delete("/:id", deletePackage);

export default router;

