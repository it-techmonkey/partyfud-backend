import { Request, Response } from "express";
import { getDashboardStats } from "./dashboard.services";

/**
 * Get dashboard statistics for the authenticated caterer
 */
export const getDashboard = async (req: Request, res: Response) => {
  try {
    const catererId = (req as any).user?.userId;

    if (!catererId) {
      return res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      });
    }

    const stats = await getDashboardStats(catererId);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({
      success: false,
      error: { message: error.message || "Failed to fetch dashboard statistics" },
    });
  }
};


