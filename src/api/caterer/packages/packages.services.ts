import prisma from "../../../lib/prisma";

export interface CategorySelection {
  category_id: string;
  num_dishes_to_select: number | null; // null = select all, number = select exactly that many
}

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
  customisation_type?: "FIXED" | "CUSTOMISABLE";
  package_item_ids?: string[]; // Array of package item IDs to link to this package
  category_selections?: CategorySelection[]; // Only allowed for FIXED packages
  occassion?: string[]; // Array of occasion IDs
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
  customisation_type?: "FIXED" | "CUSTOMISABLE";
  category_selections?: CategorySelection[]; // Only allowed for FIXED packages
  occassion?: string[]; // Array of occasion IDs
  package_item_ids?: string[]; // Array of package item IDs
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

  // Extract package_item_ids, category_selections, and occassion before creating package (they're not Package fields)
  const { package_item_ids, category_selections, occassion, ...packageDataWithoutItems } = data;

  // Validate category_selections: only allowed for FIXED packages
  const customisationType = data.customisation_type || "FIXED";
  if (category_selections && category_selections.length > 0 && customisationType !== "FIXED") {
    throw new Error("Category selections are only allowed for FIXED packages");
  }

  // If category_selections provided, validate categories exist
  if (category_selections && category_selections.length > 0) {
    const categoryIds = category_selections.map(cs => cs.category_id);
    const existingCategories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });
    
    if (existingCategories.length !== categoryIds.length) {
      throw new Error("One or more categories not found");
    }
  }

  // Create the package
  const packageData = await prisma.package.create({
    data: {
      ...packageDataWithoutItems,
      caterer_id: catererId,
      currency: data.currency || "AED",
      is_active: data.is_active ?? true,
      is_available: data.is_available ?? true,
      customisation_type: customisationType,
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
  }

  // Create category selections if provided (only for FIXED packages)
  if (category_selections && category_selections.length > 0 && customisationType === "FIXED") {
    await prisma.packageCategorySelection.createMany({
      data: category_selections.map(cs => ({
        package_id: packageData.id,
        category_id: cs.category_id,
        num_dishes_to_select: cs.num_dishes_to_select,
      })),
    });
  }

  // Create occasions if provided
  if (occassion && occassion.length > 0) {
    await prisma.packageOccassion.createMany({
      data: occassion.map(occasionId => ({
        package_id: packageData.id,
        occasion_id: occasionId,
      })),
    });
  }

  // Fetch updated package with all relations
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

  // Extract category_selections, occassion, and package_item_ids before updating package
  const { category_selections, occassion, package_item_ids, ...packageDataWithoutSelections } = data;

  // Determine customisation type (use existing if not provided)
  const customisationType = data.customisation_type || existingPackage.customisation_type || "FIXED";

  // Validate category_selections: only allowed for FIXED packages
  if (category_selections && category_selections.length > 0 && customisationType !== "FIXED") {
    throw new Error("Category selections are only allowed for FIXED packages");
  }

  // If category_selections provided, validate categories exist
  if (category_selections && category_selections.length > 0) {
    const categoryIds = category_selections.map(cs => cs.category_id);
    const existingCategories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });
    
    if (existingCategories.length !== categoryIds.length) {
      throw new Error("One or more categories not found");
    }
  }

  // Update the package
  const packageData = await prisma.package.update({
    where: { id: packageId },
    data: packageDataWithoutSelections,
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

  // Handle occasions update
  if (occassion !== undefined) {
    // Delete existing occasions
    await prisma.packageOccassion.deleteMany({
      where: { package_id: packageId },
    });

    // Create new occasions if provided
    if (occassion.length > 0) {
      await prisma.packageOccassion.createMany({
        data: occassion.map(occasionId => ({
          package_id: packageId,
          occasion_id: occasionId,
        })),
      });
    }
  }

  // Handle package items update
  if (package_item_ids !== undefined) {
    // First, get existing package items
    const existingItems = await prisma.packageItem.findMany({
      where: { package_id: packageId },
      select: { id: true },
    });
    const existingItemIds = existingItems.map(item => item.id);

    // Items to add (in package_item_ids but not in existing)
    const itemsToAdd = package_item_ids.filter(id => !existingItemIds.includes(id));
    
    // Items to remove (in existing but not in package_item_ids)
    const itemsToRemove = existingItemIds.filter(id => !package_item_ids.includes(id));

    // Update items to remove: set package_id to null (make them draft items)
    if (itemsToRemove.length > 0) {
      await prisma.packageItem.updateMany({
        where: { id: { in: itemsToRemove } },
        data: { package_id: null },
      });
    }

    // Update items to add: set package_id
    if (itemsToAdd.length > 0) {
      await prisma.packageItem.updateMany({
        where: { id: { in: itemsToAdd } },
        data: { package_id: packageId },
      });
    }
  }

  // Handle category selections update
  if (category_selections !== undefined) {
    // Delete existing category selections
    await prisma.packageCategorySelection.deleteMany({
      where: { package_id: packageId },
    });

    // Create new category selections if provided and package is FIXED
    if (category_selections.length > 0 && customisationType === "FIXED") {
      await prisma.packageCategorySelection.createMany({
        data: category_selections.map(cs => ({
          package_id: packageId,
          category_id: cs.category_id,
          num_dishes_to_select: cs.num_dishes_to_select,
        })),
      });
    }
  }

  // If any related data was updated, fetch the updated package
  if (category_selections !== undefined || occassion !== undefined || package_item_ids !== undefined) {
    const updatedPackage = await prisma.package.findUnique({
      where: { id: packageId },
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

    return updatedPackage!;
  }

  return packageData;
};

/**
 * Delete a package
 */
export const deletePackage = async (packageId: string, catererId: string) => {
  // First verify the package belongs to the caterer
  const packageData = await prisma.package.findFirst({
    where: {
      id: packageId,
      caterer_id: catererId,
    },
  });

  if (!packageData) {
    throw new Error('Package not found or you do not have permission to delete it');
  }

  // Delete the package (related records will be cascade deleted based on schema)
  await prisma.package.delete({
    where: {
      id: packageId,
    },
  });

  return true;
};

