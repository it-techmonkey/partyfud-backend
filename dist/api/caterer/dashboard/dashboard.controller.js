"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const dashboard_services_1 = require("./dashboard.services");
/**
 * Get dashboard statistics for the authenticated caterer
 */
const getDashboard = async (req, res) => {
    try {
        const catererId = req.user?.userId;
        if (!catererId) {
            return res.status(401).json({
                success: false,
                error: { message: "Unauthorized" },
            });
        }
        const stats = await (0, dashboard_services_1.getDashboardStats)(catererId);
        return res.status(200).json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Failed to fetch dashboard statistics" },
        });
    }
};
exports.getDashboard = getDashboard;
