import { Request, Response } from "express";
import prisma from "../../../lib/prisma";

/**
 * Get dashboard statistics
 * GET /api/admin/dashboard/stats
 */
export const getDashboardStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get orders with their items
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            package: {
              include: {
                package_type: true,
                items: {
                  include: {
                    dish: {
                      include: {
                        cuisine_type: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        user: true,
      },
    });

    // Calculate total revenue
    const platformRevenue = orders.reduce((sum: number, order) => {
      const orderTotal = order.items.reduce(
        (itemSum: number, item) => itemSum + Number(item.price_at_time),
        0
      );
      return sum + orderTotal;
    }, 0);

    // Get total orders
    const totalOrders = orders.length;

    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? platformRevenue / totalOrders : 0;

    // Get active caterers (approved)
    const activeCaterers = await prisma.catererinfo.count({
      where: { status: "APPROVED" },
    });

    // Get caterer counts by status
    const pendingCaterers = await prisma.catererinfo.count({
      where: { status: "PENDING" },
    });
    const approvedCaterers = await prisma.catererinfo.count({
      where: { status: "APPROVED" },
    });
    const rejectedCaterers = await prisma.catererinfo.count({
      where: { status: "REJECTED" },
    });
    const blockedCaterers = await prisma.catererinfo.count({
      where: { status: "BLOCKED" },
    });

    // Group orders by month for the past 12 months
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const monthlyOrders = await prisma.order.findMany({
      where: {
        created_at: {
          gte: twelveMonthsAgo,
        },
      },
      include: {
        items: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    // Group by month and calculate GMV
    const monthlyData: {
      [key: string]: { orders: number; gmv: number; estimate: number };
    } = {};

    monthlyOrders.forEach((order) => {
      const monthKey = `${order.created_at.getFullYear()}-${String(
        order.created_at.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { orders: 0, gmv: 0, estimate: 0 };
      }

      monthlyData[monthKey].orders += 1;
      const orderTotal = order.items.reduce(
        (sum: number, item) => sum + Number(item.price_at_time),
        0
      );
      monthlyData[monthKey].gmv += orderTotal;
      monthlyData[monthKey].estimate += orderTotal * 1.08; // 8% higher estimate
    });

    // Format into array for last 12 months
    const ordersAndGMV = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleString("en-US", { month: "short" });

      ordersAndGMV.push({
        month: monthName,
        year: date.getFullYear(),
        orders: monthlyData[monthKey]?.orders || 0,
        gmv: monthlyData[monthKey]?.gmv || 0,
        estimate: monthlyData[monthKey]?.estimate || 0,
      });
    }

    // Get orders by cuisine type
    const cuisineCounts: { [key: string]: number } = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        // Get all unique cuisines from the package's dishes
        const cuisines = new Set<string>();
        item.package?.items?.forEach((packageItem) => {
          const cuisineName = packageItem.dish?.cuisine_type?.name;
          if (cuisineName) {
            cuisines.add(cuisineName);
          }
        });
        
        // Count each unique cuisine in this order item
        cuisines.forEach((cuisine) => {
          cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1;
        });
        
        // If no cuisines found, count as "Other"
        if (cuisines.size === 0) {
          cuisineCounts["Other"] = (cuisineCounts["Other"] || 0) + 1;
        }
      });
    });

    const totalCuisineOrders = Object.values(cuisineCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    // More distinguishable colors - vibrant and distinct hues
    const colors = [
      "#16a34a", // Green (Arabic)
      "#dc2626", // Red (Spanish)
      "#f59e0b", // Orange (Mandarin)
      "#86efac", // Light Green (Swahili)
      "#22c55e", // Medium Green
      "#15803d", // Dark Green
      "#84cc16", // Lime
      "#facc15", // Yellow
      "#fb923c", // Light Orange
      "#f97316", // Deep Orange
    ];

    const ordersByCuisine = Object.entries(cuisineCounts)
      .map(([cuisine, orders], index) => ({
        cuisine,
        orders,
        percentage:
          totalCuisineOrders > 0
            ? ((orders / totalCuisineOrders) * 100).toFixed(1)
            : "0.0",
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.orders - a.orders);

    // Calculate Quality & Risk Indicators
    // 1. Average Rating from all packages
    const packagesWithRatings = await prisma.package.findMany({
      where: {
        rating: { not: null },
      },
      select: {
        rating: true,
      },
    });

    const avgRating =
      packagesWithRatings.length > 0
        ? packagesWithRatings.reduce((sum, pkg) => sum + (pkg.rating || 0), 0) /
          packagesWithRatings.length
        : 0;

    // 2. Cancellation Rate
    const cancelledOrders = orders.filter(
      (order) => order.status === "CANCELLED"
    ).length;
    const cancellationRate =
      totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

    // 3. Refund Rate (using CANCELLED as proxy for refunds)
    const refundRate = cancellationRate; // Same as cancellation for now

    res.json({
      success: true,
      data: {
        totalOrders,
        platformRevenue,
        activeCaterers,
        avgOrderValue,
        pendingCaterers,
        approvedCaterers,
        rejectedCaterers,
        blockedCaterers,
        ordersAndGMV,
        ordersByCuisine,
        avgRating: Number(avgRating.toFixed(1)),
        cancellationRate: Number(cancellationRate.toFixed(1)),
        refundRate: Number(refundRate.toFixed(1)),
      },
    });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching dashboard stats",
      },
    });
  }
};
