import { Request, Response, NextFunction } from "express";
import * as onboardingService from "./onboarding.services";

/**
 * Save onboarding draft
 * POST /api/caterer/onboarding/save-draft
 */
export const saveDraft = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      });
      return;
    }

    const data = await onboardingService.saveDraft(user.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Draft saved successfully",
      data,
    });
  } catch (error: any) {
    console.error("Error saving draft:", error);
    res.status(500).json({
      success: false,
      error: { message: error.message || "Failed to save draft" },
    });
  }
};

/**
 * Submit onboarding for approval
 * POST /api/caterer/onboarding/submit
 */
export const submit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      });
      return;
    }

    const data = await onboardingService.submit(user.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      data,
    });
  } catch (error: any) {
    console.error("Error submitting application:", error);
    const status = error.message?.includes("required") ? 400 : 500;
    res.status(status).json({
      success: false,
      error: { message: error.message || "Failed to submit application" },
    });
  }
};

/**
 * Get onboarding status
 * GET /api/caterer/onboarding/status
 */
export const getStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      });
      return;
    }

    const data = await onboardingService.getStatus(user.userId);

    if (!data) {
      res.status(404).json({
        success: false,
        error: { message: "Caterer profile not found" },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Error fetching onboarding status:", error);
    res.status(500).json({
      success: false,
      error: { message: error.message || "Failed to fetch status" },
    });
  }
};
