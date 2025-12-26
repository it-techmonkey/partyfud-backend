import { Router } from "express";
import { signup, login, logout, getCurrentUser } from "./auth.controller";
import { authenticate } from "./auth.middleware";

const router = Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes (require authentication)
router.get("/me", authenticate, getCurrentUser);

export default router;

