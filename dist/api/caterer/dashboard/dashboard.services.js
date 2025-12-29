"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../../../lib/prisma"));
/**
 * Get dashboard statistics for a caterer
 */
const getDashboardStats = async (catererId) => {
    // Verify caterer exists
    const caterer = await prisma_1.default.user.findUnique({
        where: { id: catererId },
    });
    if (!caterer || caterer.type !== "CATERER") {
        throw new Error("Invalid caterer");
    }
    // Get dishes stats
    const [totalDishes, activeDishes] = await Promise.all([
        prisma_1.default.dish.count({
            where: { caterer_id: catererId },
        }),
        prisma_1.default.dish.count({
            where: { caterer_id: catererId, is_active: true },
        }),
    ]);
    // Get packages stats
    const [totalPackages, activePackages, availablePackages] = await Promise.all([
        prisma_1.default.package.count({
            where: { caterer_id: catererId },
        }),
        prisma_1.default.package.count({
            where: { caterer_id: catererId, is_active: true },
        }),
        prisma_1.default.package.count({
            where: { caterer_id: catererId, is_available: true },
        }),
    ]);
    // Get package items stats
    const [totalPackageItems, draftPackageItems] = await Promise.all([
        prisma_1.default.packageItem.count({
            where: { caterer_id: catererId },
        }),
        prisma_1.default.packageItem.count({
            where: { caterer_id: catererId, package_id: null },
        }),
    ]);
    // Get financial stats
    const packagesWithPrice = await prisma_1.default.package.findMany({
        where: { caterer_id: catererId },
        select: {
            total_price: true,
            currency: true,
        },
    });
    const totalRevenuePotential = packagesWithPrice.reduce((sum, pkg) => {
        return sum + Number(pkg.total_price);
    }, 0);
    const averagePackagePrice = packagesWithPrice.length > 0
        ? totalRevenuePotential / packagesWithPrice.length
        : 0;
    const currency = packagesWithPrice[0]?.currency || "AED";
    // Get recent dishes (last 5)
    const recentDishes = await prisma_1.default.dish.findMany({
        where: { caterer_id: catererId },
        orderBy: { created_at: "desc" },
        take: 5,
        select: {
            id: true,
            name: true,
            image_url: true,
            price: true,
            currency: true,
            is_active: true,
            created_at: true,
        },
    });
    // Get recent packages (last 5)
    const recentPackages = await prisma_1.default.package.findMany({
        where: { caterer_id: catererId },
        orderBy: { created_at: "desc" },
        take: 5,
        select: {
            id: true,
            name: true,
            cover_image_url: true,
            total_price: true,
            currency: true,
            people_count: true,
            is_available: true,
            created_at: true,
        },
    });
    return {
        dishes: {
            total: totalDishes,
            active: activeDishes,
            inactive: totalDishes - activeDishes,
        },
        packages: {
            total: totalPackages,
            active: activePackages,
            available: availablePackages,
            inactive: totalPackages - activePackages,
        },
        packageItems: {
            total: totalPackageItems,
            draft: draftPackageItems,
            linked: totalPackageItems - draftPackageItems,
        },
        financial: {
            averagePackagePrice: Number(averagePackagePrice.toFixed(2)),
            totalRevenuePotential: Number(totalRevenuePotential.toFixed(2)),
            currency,
        },
        recent: {
            dishes: recentDishes.map((dish) => ({
                ...dish,
                price: Number(dish.price),
            })),
            packages: recentPackages.map((pkg) => ({
                ...pkg,
                total_price: Number(pkg.total_price),
            })),
        },
    };
};
exports.getDashboardStats = getDashboardStats;
