import { Router } from "express";
import { authenticate, requireRole } from "../auth/auth.middleware";
import {
  getCuisineTypes,
  getCategories,
  getSubCategories,
  getFreeForms,
  getPackageTypes,
} from "./metadata.controller";

const router = Router();

// All routes require authentication and CATERER role
router.use(authenticate);
router.use(requireRole("CATERER"));

// Metadata routes
router.get("/cuisine-types", getCuisineTypes);
router.get("/categories", getCategories);
router.get("/subcategories", getSubCategories);
router.get("/freeforms", getFreeForms);
router.get("/package-types", getPackageTypes);

export default router;

