import { Router } from "express";
import * as onboardingController from "./onboarding.controller";
import { authenticate } from "../../auth/auth.middleware";
import { upload } from "../../../middleware/upload";

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

/**
 * Upload document (food license or registration)
 * POST /api/caterer/onboarding/upload-document
 */
router.post("/upload-document", upload.single('file'), onboardingController.uploadDocument);

export default router;
