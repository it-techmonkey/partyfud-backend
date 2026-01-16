import prisma from "../../../lib/prisma";

export interface DashboardStats {
  dishes: {
    total: number;
    active: number;
    inactive: number;
  };
  packages: {
    total: number;
    active: number;
    available: number;
    inactive: number;
  };
  packageItems: {
    total: number;
    draft: number; // Items without a package_id
    linked: number; // Items linked to packages
  };
  financial: {
    averagePackagePrice: number;
    totalRevenuePotential: number; // Sum of all package prices
    currency: string;
  };
  recent: {
    dishes: Array<{
      id: string;
      name: string;
      image_url: string | null;
      price: number;
      currency: string;
      is_active: boolean;
      created_at: Date;
    }>;
    packages: Array<{
      id: string;
      name: string;
      cover_image_url: string | null;
      total_price: number;
      currency: string;
      minimum_people: number;
      people_count: number; // For frontend compatibility
      is_available: boolean;
      created_at: Date;
    }>;
  };
}

/**
 * Get dashboard statistics for a caterer
 */
export const getDashboardStats = async (catererId: string): Promise<DashboardStats> => {
  // Verify caterer exists
  const caterer = await prisma.user.findUnique({
    where: { id: catererId },
  });

  if (!caterer) {
    throw new Error(`User with ID ${catererId} not found`);
  }

  if (caterer.type !== "CATERER") {
    throw new Error(`User with ID ${catererId} is not a caterer. User type: ${caterer.type}`);
  }

  // Get dishes stats
  const [totalDishes, activeDishes] = await Promise.all([
    prisma.dish.count({
      where: { caterer_id: catererId },
    }),
    prisma.dish.count({
      where: { caterer_id: catererId, is_active: true },
    }),
  ]);

  // Get packages stats
  const [totalPackages, activePackages, availablePackages] = await Promise.all([
    prisma.package.count({
      where: { caterer_id: catererId },
    }),
    prisma.package.count({
      where: { caterer_id: catererId, is_active: true },
    }),
    prisma.package.count({
      where: { caterer_id: catererId, is_available: true },
    }),
  ]);

  // Get package items stats
  const [totalPackageItems, draftPackageItems] = await Promise.all([
    prisma.packageItem.count({
      where: { caterer_id: catererId },
    }),
    prisma.packageItem.count({
      where: { caterer_id: catererId, package_id: null },
    }),
  ]);

  // Get financial stats
  const packagesWithPrice = await prisma.package.findMany({
    where: { caterer_id: catererId },
    select: {
      total_price: true,
      currency: true,
    },
  });

  const totalRevenuePotential = packagesWithPrice.reduce((sum: number, pkg: { total_price: any; currency: string }) => {
    return sum + Number(pkg.total_price);
  }, 0);

  const averagePackagePrice =
    packagesWithPrice.length > 0
      ? totalRevenuePotential / packagesWithPrice.length
      : 0;

  const currency = packagesWithPrice[0]?.currency || "AED";

  // Get recent dishes (last 5)
  const recentDishes = await prisma.dish.findMany({
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
  const recentPackages = await prisma.package.findMany({
    where: { caterer_id: catererId },
    orderBy: { created_at: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      cover_image_url: true,
      total_price: true,
      currency: true,
      minimum_people: true,
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
      dishes: recentDishes.map((dish: { id: string; name: string; image_url: string | null; price: any; currency: string; is_active: boolean; created_at: Date }) => ({
        ...dish,
        price: Number(dish.price),
      })),
      packages: recentPackages.map((pkg: { id: string; name: string; cover_image_url: string | null; total_price: any; currency: string; minimum_people: number; is_available: boolean; created_at: Date }) => ({
        ...pkg,
        total_price: Number(pkg.total_price),
        people_count: pkg.minimum_people, // Map minimum_people to people_count for frontend compatibility
      })),
    },
  };
};

