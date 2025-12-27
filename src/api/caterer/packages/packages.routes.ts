import { Router } from "express";
import { authenticate, requireRole } from "../../auth/auth.middleware";
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
} from "./packages.controller";
import { uploadSingle } from "../../../middleware/upload";

const router = Router();

// All routes require authentication and CATERER role
router.use(authenticate);
router.use(requireRole("CATERER"));

// Package routes
router.get("/", getPackages);
router.get("/:id", getPackageById);
router.post("/", uploadSingle, createPackage);
router.put("/:id", uploadSingle, updatePackage);

export default router;

