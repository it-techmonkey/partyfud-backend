import { Router } from "express";
import { signup, login, logout, getCurrentUser, createCatererInfo, updateCatererInfo, updateUserProfile } from "./auth.controller";
import { authenticate } from "./auth.middleware";
import { uploadSingle, uploadCatererDocuments } from "../../middleware/upload";

const router = Router();

// Public routes
router.post("/signup", uploadSingle, signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes (require authentication)
router.get("/me", authenticate, getCurrentUser);
router.put("/profile", authenticate, uploadSingle, updateUserProfile);
router.post("/caterer-info", authenticate, uploadCatererDocuments, createCatererInfo);
router.put("/caterer-info", authenticate, uploadCatererDocuments, updateCatererInfo);

export default router;

