import { Router } from "express";
import { signup, login, logout, getCurrentUser, catererInfo } from "./auth.controller";
import { authenticate } from "./auth.middleware";
import { uploadSingle, uploadCatererDocuments } from "../../middleware/upload";

const router = Router();

// Public routes
router.post("/signup", uploadSingle, signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes (require authentication)
router.get("/me", authenticate, getCurrentUser);
router.post("/caterer-info", authenticate, uploadCatererDocuments, catererInfo);

export default router;

