import { Router } from "express";
import { authenticate, requireRole } from "../../auth/auth.middleware";
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
} from "./packages.controller";

const router = Router();

// All routes require authentication and CATERER role
router.use(authenticate);
router.use(requireRole("CATERER"));

// Package routes
router.get("/", getPackages);
router.get("/:id", getPackageById);
router.post("/", createPackage);
router.put("/:id", updatePackage);

export default router;

