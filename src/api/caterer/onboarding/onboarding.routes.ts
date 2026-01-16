import { Router } from "express";
import * as onboardingController from "./onboarding.controller";
import { authenticate } from "../../auth/auth.middleware";

const router = Router();

// All onboarding routes require authentication
router.use(authenticate);

/**
 * Save onboarding draft
 * POST /api/caterer/onboarding/save-draft
 */
router.post("/save-draft", onboardingController.saveDraft);

/**
 * Submit onboarding for approval
 * POST /api/caterer/onboarding/submit
 */
router.post("/submit", onboardingController.submit);

/**
 * Get onboarding status
 * GET /api/caterer/onboarding/status
 */
router.get("/status", onboardingController.getStatus);

export default router;
