import prisma from "../../../lib/prisma";

export interface CreatePackageData {
  name: string;
  people_count: number;
  package_type_id: string;
  cover_image_url?: string;
  total_price: number;
  currency?: string;
  rating?: number;
  is_active?: boolean;
  is_available?: boolean;
  package_item_ids?: string[]; // Array of package item IDs to link to this package
}

export interface UpdatePackageData {
  name?: string;
  people_count?: number;
  package_type_id?: string;
  cover_image_url?: string;
  total_price?: number;
  currency?: string;
  rating?: number;
  is_active?: boolean;
  is_available?: boolean;
}

/**
 * Get all packages by caterer ID
 */
export const getPackagesByCatererId = async (catererId: string) => {
  const packages = await prisma.package.findMany({
    where: {
      caterer_id: catererId,
    },
    include: {
      package_type: true,
      items: {
        include: {
          dish: {
            include: {
              cuisine_type: true,
              category: true,
            },
          },
        },
      },
      category_selections: {
        include: {
          category: true,
        },
      },
      occasions: {
        include: {
          occassion: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return packages;
};

/**
 * Get package by ID and verify it belongs to the caterer
 */
export const getPackageById = async (packageId: string, catererId: string) => {
  const packageData = await prisma.package.findFirst({
    where: {
      id: packageId,
      caterer_id: catererId,
    },
    include: {
      package_type: true,
      items: {
        include: {
          dish: {
            include: {
              cuisine_type: true,
              category: true,
            },
          },
        },
      },
      category_selections: {
        include: {
          category: true,
        },
      },
      occasions: {
        include: {
          occassion: true,
        },
      },
    },
  });

  if (!packageData) {
    throw new Error("Package not found or you don't have permission to access it");
  }

  return packageData;
};

/**
 * Create a new package for a caterer
 */
export const createPackage = async (
  catererId: string,
  data: CreatePackageData
) => {
  // Verify caterer exists and is a CATERER type
  const caterer = await prisma.user.findUnique({
    where: { id: catererId },
  });

  if (!caterer || caterer.type !== "CATERER") {
    throw new Error("Invalid caterer");
  }

  // Verify package type exists
  const packageType = await prisma.packageType.findUnique({
    where: { id: data.package_type_id },
  });

  if (!packageType) {
    throw new Error("Invalid package type");
  }

  // Extract package_item_ids before creating package (it's not a Package field)
  const { package_item_ids, ...packageDataWithoutItems } = data;

  // Create the package
  const packageData = await prisma.package.create({
    data: {
      ...packageDataWithoutItems,
      caterer_id: catererId,
      currency: data.currency || "AED",
      is_active: data.is_active ?? true,
      is_available: data.is_available ?? true,
    },
    include: {
      package_type: true,
      items: true,
      category_selections: true,
      occasions: true,
    },
  });

  // Link package items if provided
  if (package_item_ids && package_item_ids.length > 0) {
    // Verify all items belong to caterer
    const items = await prisma.packageItem.findMany({
      where: {
        id: { in: package_item_ids },
        dish: {
          caterer_id: catererId,
        },
      },
    });

    if (items.length !== package_item_ids.length) {
      throw new Error("Some package items not found or do not belong to this caterer");
    }

    // Link items to the package
    await prisma.packageItem.updateMany({
      where: {
        id: { in: package_item_ids },
      },
      data: {
        package_id: packageData.id,
      },
    });

    // Fetch updated package with linked items
    const updatedPackage = await prisma.package.findUnique({
      where: { id: packageData.id },
      include: {
        package_type: true,
        items: {
          include: {
            dish: {
              include: {
                cuisine_type: true,
                category: true,
                sub_category: true,
              },
            },
          },
        },
        category_selections: {
          include: {
            category: true,
          },
        },
        occasions: {
          include: {
            occassion: true,
          },
        },
      },
    });

    return updatedPackage!;
  }

  return packageData;
};

/**
 * Update a package (only if it belongs to the caterer)
 */
export const updatePackage = async (
  packageId: string,
  catererId: string,
  data: UpdatePackageData
) => {
  // Verify package exists and belongs to caterer
  const existingPackage = await prisma.package.findFirst({
    where: {
      id: packageId,
      caterer_id: catererId,
    },
  });

  if (!existingPackage) {
    throw new Error(
      "Package not found or you don't have permission to update it"
    );
  }

  // Verify package type if it's being updated
  if (data.package_type_id) {
    const packageType = await prisma.packageType.findUnique({
      where: { id: data.package_type_id },
    });
    if (!packageType) {
      throw new Error("Invalid package type");
    }
  }

  const packageData = await prisma.package.update({
    where: { id: packageId },
    data,
    include: {
      package_type: true,
      items: {
        include: {
          dish: {
            include: {
              cuisine_type: true,
              category: true,
            },
          },
        },
      },
      category_selections: {
        include: {
          category: true,
        },
      },
      occasions: {
        include: {
          occassion: true,
        },
      },
    },
  });

  return packageData;
};

