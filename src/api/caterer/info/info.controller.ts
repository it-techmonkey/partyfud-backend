import { Request, Response, NextFunction } from "express";
import * as authService from "../../auth/auth.services";

/**
 * Get caterer info for authenticated caterer
 * GET /api/caterer/info
 */
export const getCatererInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const catererId = (req as any).user?.userId;

    if (!catererId) {
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
      return;
    }

    // Verify user is a caterer
    const user = await authService.getUserById(catererId);
    
    if (user.type !== "CATERER") {
      res.status(403).json({
        success: false,
        error: {
          message: "Only caterers can access this endpoint",
        },
      });
      return;
    }

    const catererInfo = await authService.getCatererInfo(catererId);

    if (!catererInfo) {
      res.status(404).json({
        success: false,
        error: {
          message: "Caterer info not found",
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: catererInfo,
    });
  } catch (error: any) {
    next(error);
  }
};
