import prisma from "../../../lib/prisma";

export interface CreatePackageItemData {
  dish_id: string;
  people_count: number;
  quantity?: number;
  price_at_time?: number;
  is_optional?: boolean;
  is_addon?: boolean;
  package_id?: string; // Optional - can be null for draft items
}

export interface UpdatePackageItemData {
  dish_id?: string;
  people_count?: number;
  quantity?: number;
  price_at_time?: number;
  is_optional?: boolean;
  is_addon?: boolean;
  package_id?: string;
}

/**
 * Create a new package item (can exist without a package)
 */
export const createPackageItem = async (
  catererId: string,
  data: CreatePackageItemData
) => {
  // Verify caterer exists and is a CATERER type
  const caterer = await prisma.user.findUnique({
    where: { id: catererId },
  });

  if (!caterer || caterer.type !== "CATERER") {
    throw new Error("Invalid caterer");
  }

  // Verify dish exists
  const dish = await prisma.dish.findUnique({
    where: { id: data.dish_id },
  });

  if (!dish) {
    throw new Error("Dish not found");
  }

  // Verify dish belongs to the caterer
  if (dish.caterer_id !== catererId) {
    throw new Error("Dish does not belong to this caterer");
  }

  // Verify package exists if package_id is provided
  if (data.package_id) {
    const packageData = await prisma.package.findFirst({
      where: {
        id: data.package_id,
        caterer_id: catererId,
      },
    });

    if (!packageData) {
      throw new Error("Package not found or does not belong to this caterer");
    }
  }

  const packageItem = await prisma.packageItem.create({
    data: {
      dish_id: data.dish_id,
      caterer_id: catererId, // Set caterer_id directly
      people_count: data.people_count,
      quantity: data.quantity ?? 1,
      price_at_time: data.price_at_time ? data.price_at_time : dish.price,
      is_optional: data.is_optional ?? false,
      is_addon: data.is_addon ?? false,
      package_id: data.package_id || undefined, // Can be undefined for draft items
    },
    include: {
      dish: {
        include: {
          cuisine_type: true,
          category: true,
          sub_category: true,
        },
      },
      package: true,
    },
  });

  return packageItem;
};

/**
 * Get all package items for a caterer, grouped by category
 * Returns all package items linked with the caterer_id, organized by category
 * @param catererId - The caterer ID
 * @param draftOnly - If true, only returns items without package_id (draft items)
 */
export const getPackageItems = async (catererId: string, draftOnly: boolean = false) => {
  console.log("🟢 [SERVICE] getPackageItems called with catererId:", catererId, "draftOnly:", draftOnly);
  
  // Verify caterer exists
  console.log("🟢 [SERVICE] Checking if caterer exists...");
  const caterer = await prisma.user.findUnique({
    where: { id: catererId },
  });
  console.log("🟢 [SERVICE] Caterer found:", caterer ? "YES" : "NO");
  if (caterer) {
    console.log("🟢 [SERVICE] Caterer type:", caterer.type);
    console.log("🟢 [SERVICE] Caterer email:", caterer.email);
  }

  if (!caterer || caterer.type !== "CATERER") {
    console.log("❌ [SERVICE] Invalid caterer - throwing error");
    throw new Error("Invalid caterer");
  }

  // Get all categories first (to include empty categories)
  console.log("🟢 [SERVICE] Fetching all categories...");
  const allCategories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  console.log("🟢 [SERVICE] Found", allCategories.length, "categories");

  // Build where clause
  const whereClause: any = {
      caterer_id: catererId,
    };

  // If draftOnly is true, only get items without package_id
  if (draftOnly) {
    whereClause.package_id = null;
    console.log("🟢 [SERVICE] Filtering for draft items only (package_id = null)");
  }

  // Get all package items for this caterer
  console.log("🟢 [SERVICE] Querying package items with where clause:", JSON.stringify(whereClause));
  
  try {
    // Get package items with all relations
    const packageItems = await prisma.packageItem.findMany({
      where: whereClause,
      include: {
        dish: {
          include: {
            cuisine_type: true,
            category: true,
            sub_category: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    console.log("🟢 [SERVICE] Found", packageItems.length, "package items");
    console.log("🟢 [SERVICE] Package items IDs:", packageItems.map((item: any) => item.id));
    
    // Now manually fetch packages for items that have package_id, but only if they belong to this caterer
    const itemsWithPackages = await Promise.all(
      packageItems.map(async (item: any) => {
        console.log(`🟢 [SERVICE] Processing item ${item.id}: package_id=${item.package_id}`);
        
        if (item.package_id) {
          try {
            // Only fetch package if it belongs to this caterer
            const packageData = await prisma.package.findFirst({
              where: {
                id: item.package_id,
                caterer_id: catererId, // Security: only get packages that belong to this caterer
              },
            });
            
            if (packageData) {
              console.log(`🟢 [SERVICE] Item ${item.id} has valid package: ${packageData.id}`);
              return {
                ...item,
                package: packageData,
              };
            } else {
              console.log(`⚠️ [SERVICE] Item ${item.id} has package_id ${item.package_id} but package doesn't belong to caterer or doesn't exist`);
              return {
                ...item,
                package: null, // Set to null if package doesn't belong to caterer
              };
            }
          } catch (packageError: any) {
            console.error(`❌ [SERVICE] Error fetching package for item ${item.id}:`, packageError.message);
            return {
              ...item,
              package: null, // Set to null on error
            };
          }
        } else {
          console.log(`🟢 [SERVICE] Item ${item.id} has no package_id (draft item)`);
          return {
            ...item,
            package: null,
          };
        }
      })
    );

    // Group items by category_id
    const itemsByCategory = new Map<string, any[]>();
    const uncategorizedItems: any[] = [];
    
    itemsWithPackages.forEach((item: any) => {
      const categoryId = item.dish?.category_id;
      if (categoryId) {
        if (!itemsByCategory.has(categoryId)) {
          itemsByCategory.set(categoryId, []);
        }
        itemsByCategory.get(categoryId)!.push(item);
      } else {
        // Items without a valid category
        uncategorizedItems.push(item);
      }
    });

    console.log("🟢 [SERVICE] Grouped items into", itemsByCategory.size, "categories");
    if (uncategorizedItems.length > 0) {
      console.log("⚠️ [SERVICE] Found", uncategorizedItems.length, "items without valid category");
    }

    // Build response structure with all categories
    const categoriesWithItems = allCategories.map((category) => {
      const items = itemsByCategory.get(category.id) || [];
      return {
        category: {
          id: category.id,
          name: category.name,
          description: category.description,
          created_at: category.created_at,
          updated_at: category.updated_at,
        },
        items: items,
      };
    });

    // Add uncategorized items if any exist
    if (uncategorizedItems.length > 0) {
      categoriesWithItems.push({
        category: {
          id: 'uncategorized',
          name: 'Uncategorized',
          description: 'Items without a valid category',
          created_at: new Date(),
          updated_at: new Date(),
        },
        items: uncategorizedItems,
      });
    }

    console.log("🟢 [SERVICE] Returning", categoriesWithItems.length, "categories with items grouped");
    return { categories: categoriesWithItems };
  } catch (error: any) {
    console.error("❌ [SERVICE] Error in getPackageItems query:");
    console.error("❌ [SERVICE] Error message:", error.message);
    console.error("❌ [SERVICE] Error stack:", error.stack);
    throw error;
  }
};

/**
 * Get package item by ID
 */
export const getPackageItemById = async (
  itemId: string,
  catererId: string
) => {
  const packageItem = await prisma.packageItem.findFirst({
    where: {
      id: itemId,
      caterer_id: catererId, // Filter by caterer_id directly
    },
    include: {
      dish: {
        include: {
          cuisine_type: true,
          category: true,
          sub_category: true,
        },
      },
      package: true,
    },
  });

  if (!packageItem) {
    throw new Error("Package item not found or you don't have permission to access it");
  }

  return packageItem;
};

/**
 * Update a package item
 */
export const updatePackageItem = async (
  itemId: string,
  catererId: string,
  data: UpdatePackageItemData
) => {
  // Verify item exists and belongs to caterer
  const existingItem = await prisma.packageItem.findFirst({
    where: {
      id: itemId,
      caterer_id: catererId, // Filter by caterer_id directly
    },
  });

  if (!existingItem) {
    throw new Error("Package item not found or you don't have permission to update it");
  }

  // Verify dish if being updated
  if (data.dish_id) {
    const dish = await prisma.dish.findFirst({
      where: {
        id: data.dish_id,
        caterer_id: catererId,
      },
    });

    if (!dish) {
      throw new Error("Dish not found or does not belong to this caterer");
    }
  }

  // Verify package if being updated
  if (data.package_id) {
    const packageData = await prisma.package.findFirst({
      where: {
        id: data.package_id,
        caterer_id: catererId,
      },
    });

    if (!packageData) {
      throw new Error("Package not found or does not belong to this caterer");
    }
  }

  const updateData: any = {};
  if (data.dish_id !== undefined) updateData.dish_id = data.dish_id;
  if (data.people_count !== undefined) updateData.people_count = data.people_count;
  if (data.quantity !== undefined) updateData.quantity = data.quantity;
  if (data.price_at_time !== undefined) updateData.price_at_time = data.price_at_time;
  if (data.is_optional !== undefined) updateData.is_optional = data.is_optional;
  if (data.is_addon !== undefined) updateData.is_addon = data.is_addon;
  if (data.package_id !== undefined) updateData.package_id = data.package_id || undefined;

  const packageItem = await prisma.packageItem.update({
    where: { id: itemId },
    data: updateData,
    include: {
      dish: {
        include: {
          cuisine_type: true,
          category: true,
          sub_category: true,
        },
      },
      package: true,
    },
  });

  return packageItem;
};

/**
 * Delete a package item
 */
export const deletePackageItem = async (itemId: string, catererId: string) => {
  // Verify item exists and belongs to caterer
  const existingItem = await prisma.packageItem.findFirst({
    where: {
      id: itemId,
      caterer_id: catererId, // Filter by caterer_id directly
    },
  });

  if (!existingItem) {
    throw new Error("Package item not found or you don't have permission to delete it");
  }

  await prisma.packageItem.delete({
    where: { id: itemId },
  });
};

/**
 * Link package items to a package (update their package_id)
 */
export const linkPackageItemsToPackage = async (
  packageId: string,
  itemIds: string[],
  catererId: string
) => {
  // Verify package exists and belongs to caterer
  const packageData = await prisma.package.findFirst({
    where: {
      id: packageId,
      caterer_id: catererId,
    },
  });

  if (!packageData) {
    throw new Error("Package not found or does not belong to this caterer");
  }

  // Verify all items belong to caterer
  const items = await prisma.packageItem.findMany({
    where: {
      id: { in: itemIds },
      caterer_id: catererId, // Filter by caterer_id directly
    },
  });

  if (items.length !== itemIds.length) {
    throw new Error("Some package items not found or do not belong to this caterer");
  }

  // Update all items to link them to the package
  // Also ensure caterer_id is set (in case it wasn't set before)
  await prisma.packageItem.updateMany({
    where: {
      id: { in: itemIds },
      caterer_id: catererId, // Only update items belonging to this caterer
    },
    data: {
      package_id: packageId,
      caterer_id: catererId, // Ensure caterer_id is set
    },
  });

  // Return updated items
  const updatedItems = await prisma.packageItem.findMany({
    where: {
      id: { in: itemIds },
    },
    include: {
      dish: {
        include: {
          cuisine_type: true,
          category: true,
          sub_category: true,
        },
      },
      package: true,
    },
  });

  return updatedItems;
};

