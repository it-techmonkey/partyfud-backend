import { Router } from "express";
import { authenticate, requireRole } from "../../auth/auth.middleware";
import {
  getDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
} from "./dishes.controller";
import { uploadSingle } from "../../../middleware/upload";

const router = Router();

// All routes require authentication and CATERER role
router.use(authenticate);
router.use(requireRole("CATERER"));

// Dish routes
router.get("/", getDishes);
router.get("/:id", getDishById);
router.post("/", uploadSingle, createDish);
router.put("/:id", uploadSingle, updateDish);
router.delete("/:id", deleteDish);

export default router;

