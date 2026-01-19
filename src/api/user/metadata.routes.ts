import { Router } from "express";
import { getCuisineTypes, getPackageTypes, getDietaryNeeds } from "./metadata.controller";

const router = Router();

// Public/user accessible metadata routes (no authentication required)
router.get("/cuisine-types", getCuisineTypes);
router.get("/package-types", getPackageTypes);
router.get("/dietary-needs", getDietaryNeeds);

export default router;

