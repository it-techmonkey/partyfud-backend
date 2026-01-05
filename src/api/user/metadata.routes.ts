import { Router } from "express";
import { getCuisineTypes } from "./metadata.controller";

const router = Router();

// Public/user accessible metadata routes (no authentication required)
router.get("/cuisine-types", getCuisineTypes);

export default router;

