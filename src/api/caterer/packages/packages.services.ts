import prisma from "../../../lib/prisma";
import { getCatererInfo } from "../../auth/auth.services";

export interface CategorySelection {
  category_id: string;
  num_dishes_to_select: number | null; // null = select all, number = select exactly that many
}

export interface CreatePackageData {
  name: string;
  description?: string; // Package description
  minimum_people?: number; // Optional - defaults to caterer's minimum_guests if not provided
  cover_image_url?: string;
  total_price?: number; // Optional - if provided, this price is used (regardless of number of people); if not provided, will be calculated from items
  is_custom_price?: boolean; // True if total_price was manually set by caterer (won't scale with guest count)
  currency?: string;
  rating?: number;
  is_active?: boolean;
  is_available?: boolean;
  customisation_type?: "FIXED" | "CUSTOMISABLE";
  additional_info?: string; // Extra pricing and services information
  package_item_ids?: string[]; // Array of package item IDs to link to this package
  category_selections?: CategorySelection[]; // Only allowed for CUSTOMISABLE packages
  occassion?: string[]; // Array of occasion IDs
}

export interface UpdatePackageData {
  name?: string;
  description?: string; // Package description
  minimum_people?: number; // Optional - defaults to caterer's minimum_guests if not provided
  cover_image_url?: string;
  total_price?: number; // Optional - if provided, this price is used (regardless of number of people); if not provided, will be recalculated from items
  is_custom_price?: boolean; // True if total_price was manually set by caterer (won't scale with guest count)
  currency?: string;
  rating?: number;
  is_active?: boolean;
  is_available?: boolean;
  customisation_type?: "FIXED" | "CUSTOMISABLE";
  additional_info?: string; // Extra pricing and services information
  category_selections?: CategorySelection[]; // Only allowed for CUSTOMISABLE packages
  occassion?: string[]; // Array of occasion IDs
  package_item_ids?: string[]; // Array of package item IDs
}

/**
 * Calculate package price from its items
 * Formula: sum of (dish.price * minimum_people * quantity) for all items
 */
export const calculatePackagePrice = async (
  packageId: string,
  minimumPeople: number
): Promise<number> => {
  const items = await prisma.packageItem.findMany({
    where: { package_id: packageId },
    include: {
      dish: true,
    },
  });

  let totalPrice = 0;
  for (const item of items) {
    const dishPrice = typeof item.dish.price === 'number' ? item.dish.price : parseInt(String(item.dish.price), 10);
    const quantity = item.quantity || 1;
    // Use price_at_time if available (snapshot of price when item was added), otherwise use current dish price
    const itemPrice = item.price_at_time 
      ? (typeof item.price_at_time === 'number' ? item.price_at_time : parseInt(String(item.price_at_time), 10))
      : dishPrice;
    totalPrice += Math.round(itemPrice * minimumPeople * quantity);
  }

  return totalPrice;
};

/**
 * Get all packages by caterer ID
 */
export const getPackagesByCatererId = async (catererId: string) => {
  try {
    console.log("🔍 [SERVICE] getPackagesByCatererId called with catererId:", catererId);
    
    const packages = await prisma.package.findMany({
      where: {
        caterer_id: catererId,
      },
      include: {
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
        add_ons: {
          where: {
            is_active: true,
          },
          orderBy: {
            created_at: "asc",
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    console.log("✅ [SERVICE] Found", packages.length, "packages");
    
    // Format packages to ensure proper serialization (convert Decimal to Number)
    const formattedPackages = packages.map((pkg) => {
      const formatted = {
        id: pkg.id,
        name: pkg.name,
        description: pkg.description,
        minimum_people: pkg.minimum_people,
        people_count: pkg.minimum_people, // Include for backward compatibility
        cover_image_url: pkg.cover_image_url,
        total_price: pkg.total_price ? (typeof pkg.total_price === 'number' ? pkg.total_price : parseInt(String(pkg.total_price), 10)) : 0,
        is_custom_price: pkg.is_custom_price || false, // Track if price was manually set
        currency: pkg.currency,
        rating: pkg.rating,
        is_active: pkg.is_active,
        is_available: pkg.is_available,
        caterer_id: pkg.caterer_id,
        user_id: pkg.user_id,
        created_by: pkg.created_by,
        customisation_type: pkg.customisation_type,
        additional_info: pkg.additional_info,
        created_at: pkg.created_at,
        updated_at: pkg.updated_at,
        items: pkg.items.map((item) => ({
          id: item.id,
          package_id: item.package_id,
          caterer_id: item.caterer_id,
          dish_id: item.dish_id,
          people_count: item.people_count,
          is_optional: item.is_optional,
          quantity: item.quantity,
            price_at_time: item.price_at_time ? (typeof item.price_at_time === 'number' ? item.price_at_time : parseInt(String(item.price_at_time), 10)) : null,
          is_addon: item.is_addon,
          created_at: item.created_at,
          updated_at: item.updated_at,
          dish: item.dish ? {
            id: item.dish.id,
            name: item.dish.name,
            image_url: item.dish.image_url,
            cuisine_type_id: item.dish.cuisine_type_id,
            category_id: item.dish.category_id,
            sub_category_id: item.dish.sub_category_id,
            caterer_id: item.dish.caterer_id,
            quantity: item.dish.quantity,
            pieces: item.dish.pieces,
            price: typeof item.dish.price === 'number' ? item.dish.price : parseInt(String(item.dish.price), 10),
            currency: item.dish.currency,
            is_active: item.dish.is_active,
            created_at: item.dish.created_at,
            updated_at: item.dish.updated_at,
            cuisine_type: item.dish.cuisine_type,
            category: item.dish.category,
          } : null,
        })),
        category_selections: pkg.category_selections.map((cs) => ({
          id: cs.id,
          package_id: cs.package_id,
          category_id: cs.category_id,
          num_dishes_to_select: cs.num_dishes_to_select,
          created_at: cs.created_at,
          updated_at: cs.updated_at,
          category: cs.category,
        })),
        occasions: pkg.occasions.map((occ) => ({
          id: occ.id,
          package_id: occ.package_id,
          occasion_id: occ.occasion_id,
          created_at: occ.created_at,
          occassion: occ.occassion,
        })),
        add_ons: pkg.add_ons ? pkg.add_ons.map((addOn) => ({
          id: addOn.id,
          package_id: addOn.package_id,
          name: addOn.name,
          description: addOn.description,
          price: typeof addOn.price === 'number' ? addOn.price : parseInt(String(addOn.price), 10),
          currency: addOn.currency,
          is_active: addOn.is_active,
          created_at: addOn.created_at,
          updated_at: addOn.updated_at,
        })) : [],
      };
      return formatted;
    });
    
    return formattedPackages;
  } catch (error: any) {
    console.error("❌ [SERVICE] Error in getPackagesByCatererId:", error);
    console.error("❌ [SERVICE] Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    throw error;
  }
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

  // Get caterer info to get minimum_guests (used as default if minimum_people not provided)
  const catererInfo = await getCatererInfo(catererId);
  if (!catererInfo || !catererInfo.minimum_guests) {
    throw new Error("Caterer minimum guests not configured. Please update your caterer profile.");
  }
  // Use provided minimum_people or default to caterer's minimum_guests
  const minimumPeople = data.minimum_people || catererInfo.minimum_guests;

  // Extract package_item_ids, category_selections, and occassion before creating package (they're not Package fields)
  const { package_item_ids, category_selections, occassion, ...packageDataWithoutItems } = data;

  // Validate category_selections: only allowed for CUSTOMISABLE packages
  const customisationType = data.customisation_type || "FIXED";
  if (category_selections && category_selections.length > 0 && customisationType !== "CUSTOMISABLE") {
    throw new Error("Category selections are only allowed for CUSTOMISABLE packages");
  }

  // If category_selections provided, validate categories exist
  // Filter out 'uncategorized' as it's not a real category in the database
  if (category_selections && category_selections.length > 0) {
    const categoryIds = category_selections
      .map(cs => cs.category_id)
      .filter(id => id && id !== 'uncategorized');
    
    if (categoryIds.length > 0) {
      const existingCategories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
      });

      if (existingCategories.length !== categoryIds.length) {
        throw new Error("One or more categories not found");
      }
    }
  }

  // Calculate total_price from items if package_item_ids are provided
  // package_item_ids can be either PackageItem IDs or Dish IDs
  // If total_price is explicitly provided, use it; otherwise calculate from items
  let finalPrice: number;
  let isCustomPrice = false; // Track if price was manually set
  let packageItemIdsToLink: string[] = [];
  
  if (package_item_ids && package_item_ids.length > 0) {
    // First, try to find existing PackageItems
    const existingItems = await prisma.packageItem.findMany({
      where: {
        id: { in: package_item_ids },
          caterer_id: catererId,
      },
      include: {
        dish: true,
      },
    });

    // Check if any IDs are dish IDs (not found in PackageItem table)
    const foundItemIds = new Set(existingItems.map(item => item.id));
    const missingIds = package_item_ids.filter(id => !foundItemIds.has(id));

    // If there are missing IDs, they might be dish IDs - verify and create PackageItems
    if (missingIds.length > 0) {
      // Verify these are dish IDs and belong to the caterer
      const dishes = await prisma.dish.findMany({
        where: {
          id: { in: missingIds },
          caterer_id: catererId,
        },
      });

      if (dishes.length !== missingIds.length) {
      throw new Error("Some package items not found or do not belong to this caterer");
    }

      // Create PackageItems from dishes (create individually to get IDs)
      const createdItems = await Promise.all(
        dishes.map(dish =>
          prisma.packageItem.create({
            data: {
              dish_id: dish.id,
              caterer_id: catererId,
              people_count: minimumPeople,
              quantity: dish.pieces || 1,
              price_at_time: dish.price,
              is_optional: customisationType === "CUSTOMISABLE", // Optional for CUSTOMISABLE, required for FIXED
              is_addon: false,
            },
            include: {
              dish: true,
            },
          })
        )
      );

      // Add created items to the list
      packageItemIdsToLink = [
        ...existingItems.map(item => item.id),
        ...createdItems.map(item => item.id),
      ];

      // Calculate price from all items (existing + newly created)
      // Only calculate if total_price was not explicitly provided
      if (data.total_price === undefined) {
        finalPrice = 0;
        for (const item of [...existingItems, ...createdItems]) {
          const dishPrice = typeof item.dish.price === 'number' ? item.dish.price : parseInt(String(item.dish.price), 10);
          const quantity = item.quantity || 1;
          const itemPrice = item.price_at_time ? Number(item.price_at_time) : dishPrice;
          finalPrice += itemPrice * minimumPeople * quantity;
        }
        isCustomPrice = false;
      } else {
        finalPrice = data.total_price;
        isCustomPrice = true; // Caterer explicitly set a price
      }
    } else {
      // All IDs are existing PackageItems
      packageItemIdsToLink = package_item_ids;
      
      // Calculate price from existing items
      // Only calculate if total_price was not explicitly provided
      if (data.total_price === undefined) {
        finalPrice = 0;
        for (const item of existingItems) {
          const dishPrice = typeof item.dish.price === 'number' ? item.dish.price : parseInt(String(item.dish.price), 10);
          const quantity = item.quantity || 1;
          const itemPrice = item.price_at_time ? Number(item.price_at_time) : dishPrice;
          finalPrice += itemPrice * minimumPeople * quantity;
        }
        isCustomPrice = false;
      } else {
        finalPrice = data.total_price;
        isCustomPrice = true; // Caterer explicitly set a price
      }
    }
  } else {
    // No package_item_ids provided
    // Use total_price if provided, otherwise default to 0
    if (data.total_price !== undefined) {
      finalPrice = data.total_price;
      isCustomPrice = true; // Caterer explicitly set a price
    } else {
      finalPrice = 0;
      isCustomPrice = false;
    }
  }

  // Create the package
  const packageData = await prisma.package.create({
    data: {
      ...packageDataWithoutItems,
      caterer_id: catererId,
      minimum_people: minimumPeople, // Set from caterer's minimum_guests
      currency: data.currency || "AED",
      is_active: data.is_active ?? true,
      is_available: data.is_available ?? true,
      customisation_type: customisationType,
      total_price: finalPrice,
      is_custom_price: isCustomPrice, // Track if price was manually set
    },
    include: {
      items: true,
      category_selections: true,
      occasions: true,
    },
  });

  // Link package items if provided
  if (packageItemIdsToLink.length > 0) {
    // Link items to the package
    await prisma.packageItem.updateMany({
      where: {
        id: { in: packageItemIdsToLink },
        caterer_id: catererId, // Security: only update items belonging to this caterer
      },
      data: {
        package_id: packageData.id,
      },
    });
  }

  // Create category selections if provided (only for CUSTOMISABLE packages)
  // Filter out 'uncategorized' as it's not a real category in the database
  if (category_selections && category_selections.length > 0 && customisationType === "CUSTOMISABLE") {
    const validCategorySelections = category_selections.filter(
      cs => cs.category_id && cs.category_id !== 'uncategorized'
    );
    
    if (validCategorySelections.length > 0) {
      await prisma.packageCategorySelection.createMany({
        data: validCategorySelections.map(cs => ({
          package_id: packageData.id,
          category_id: cs.category_id,
          num_dishes_to_select: cs.num_dishes_to_select,
        })),
      });
    }
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

  // Package type is no longer required

  // Extract category_selections, occassion, and package_item_ids before updating package
  const { category_selections, occassion, package_item_ids, ...packageDataWithoutSelections } = data;

  // Determine customisation type (use existing if not provided)
  const customisationType = data.customisation_type || existingPackage.customisation_type || "FIXED";

  // Validate category_selections: only allowed for CUSTOMISABLE packages
  if (category_selections && category_selections.length > 0 && customisationType !== "CUSTOMISABLE") {
    throw new Error("Category selections are only allowed for CUSTOMISABLE packages");
  }

  // If category_selections provided, validate categories exist
  // Filter out 'uncategorized' as it's not a real category in the database
  if (category_selections && category_selections.length > 0) {
    const categoryIds = category_selections
      .map(cs => cs.category_id)
      .filter(id => id && id !== 'uncategorized');
    
    if (categoryIds.length > 0) {
      const existingCategories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
      });

      if (existingCategories.length !== categoryIds.length) {
        throw new Error("One or more categories not found");
      }
    }
  }

  // Get caterer info to get minimum_guests (used as default if minimum_people not provided)
  const catererInfo = await getCatererInfo(catererId);
  if (!catererInfo || !catererInfo.minimum_guests) {
    throw new Error("Caterer minimum guests not configured. Please update your caterer profile.");
  }
  // Use provided minimum_people or default to caterer's minimum_guests
  const minimumPeople = data.minimum_people !== undefined ? data.minimum_people : catererInfo.minimum_guests;

  // Determine final price and is_custom_price flag
  let finalPrice: number;
  let isCustomPrice: boolean;
  
  // If total_price is explicitly provided, use it (custom price)
  if (data.total_price !== undefined) {
    finalPrice = data.total_price;
    isCustomPrice = true; // Caterer explicitly set a price
  } else if (data.is_custom_price === false) {
    // Caterer explicitly cleared the custom price, recalculate from items
    isCustomPrice = false;
    if (package_item_ids !== undefined) {
      const currentItemIds = package_item_ids;
      if (currentItemIds.length > 0) {
        const items = await prisma.packageItem.findMany({
          where: { id: { in: currentItemIds } },
          include: { dish: true },
        });
        finalPrice = 0;
        for (const item of items) {
          const dishPrice = typeof item.dish.price === 'number' ? item.dish.price : parseInt(String(item.dish.price), 10);
          const quantity = item.quantity || 1;
          const itemPrice = item.price_at_time ? Number(item.price_at_time) : dishPrice;
          finalPrice += itemPrice * minimumPeople * quantity;
        }
      } else {
        finalPrice = 0;
      }
    } else {
      // No items update, recalculate from existing items
      const items = await prisma.packageItem.findMany({
        where: { package_id: packageId },
        include: { dish: true },
      });
      finalPrice = 0;
      for (const item of items) {
        const dishPrice = typeof item.dish.price === 'number' ? item.dish.price : parseInt(String(item.dish.price), 10);
        const quantity = item.quantity || 1;
        const itemPrice = item.price_at_time ? Number(item.price_at_time) : dishPrice;
        finalPrice += itemPrice * minimumPeople * quantity;
      }
    }
  } else {
    // No total_price provided and is_custom_price not explicitly cleared
    // Keep existing is_custom_price flag and price (don't recalculate if it was custom)
    if (existingPackage.is_custom_price) {
      // Keep existing custom price
      finalPrice = typeof existingPackage.total_price === 'number' ? existingPackage.total_price : parseInt(String(existingPackage.total_price), 10);
      isCustomPrice = true;
    } else {
      // Recalculate from items
      isCustomPrice = false;
      if (package_item_ids !== undefined) {
        const currentItemIds = package_item_ids;
        if (currentItemIds.length > 0) {
          const items = await prisma.packageItem.findMany({
            where: { id: { in: currentItemIds } },
            include: { dish: true },
          });
          finalPrice = 0;
          for (const item of items) {
            const dishPrice = typeof item.dish.price === 'number' ? item.dish.price : parseInt(String(item.dish.price), 10);
            const quantity = item.quantity || 1;
            const itemPrice = item.price_at_time ? Number(item.price_at_time) : dishPrice;
            finalPrice += itemPrice * minimumPeople * quantity;
          }
        } else {
          finalPrice = 0;
        }
      } else {
        // No items update, recalculate from existing items
        const items = await prisma.packageItem.findMany({
          where: { package_id: packageId },
          include: { dish: true },
        });
        finalPrice = 0;
        for (const item of items) {
          const dishPrice = typeof item.dish.price === 'number' ? item.dish.price : parseInt(String(item.dish.price), 10);
          const quantity = item.quantity || 1;
          const itemPrice = item.price_at_time ? Number(item.price_at_time) : dishPrice;
          finalPrice += itemPrice * minimumPeople * quantity;
        }
      }
    }
  }

  // Update the package
  const packageData = await prisma.package.update({
    where: { id: packageId },
    data: {
      ...packageDataWithoutSelections,
      minimum_people: minimumPeople, // Always update to current caterer's minimum_guests
      total_price: finalPrice,
      is_custom_price: isCustomPrice, // Track if price was manually set
    },
    include: {
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
    // For CUSTOMISABLE packages with empty package_item_ids, keep existing items
    // This means "all dishes available" - don't remove anything
    if (customisationType === "CUSTOMISABLE" && package_item_ids.length === 0) {
      // Do nothing - keep existing items as they are
      console.log("CUSTOMISABLE package with empty package_item_ids - keeping existing items");
    } else {
      // Get existing package items
      const existingItems = await prisma.packageItem.findMany({
        where: { package_id: packageId },
        select: { id: true, dish_id: true },
      });
      const existingDishIds = new Set(existingItems.map(item => item.dish_id));

      // Find dish IDs that need package items created
      const dishIdsNeedingItems = package_item_ids.filter(dishId => !existingDishIds.has(dishId));
      
      // Create package items for dishes that don't have items yet
      if (dishIdsNeedingItems.length > 0) {
        const dishes = await prisma.dish.findMany({
          where: {
            id: { in: dishIdsNeedingItems },
            caterer_id: catererId,
          },
        });

        await Promise.all(
          dishes.map(dish =>
            prisma.packageItem.create({
              data: {
                dish_id: dish.id,
                caterer_id: catererId,
                people_count: minimumPeople,
                quantity: dish.pieces || 1,
                price_at_time: dish.price,
                is_optional: customisationType === "CUSTOMISABLE",
                is_addon: false,
                package_id: packageId,
              },
            })
          )
        );
      }

      // Get all package items (existing + newly created) for this package
      const allPackageItems = await prisma.packageItem.findMany({
        where: { package_id: packageId },
        select: { id: true, dish_id: true },
      });
      const allPackageDishIds = new Set(allPackageItems.map(item => item.dish_id));

      // Items to remove: package items whose dishes are not in package_item_ids
      const itemsToRemove = allPackageItems
        .filter(item => !package_item_ids.includes(item.dish_id))
        .map(item => item.id);

      // Items to add: dishes in package_item_ids that don't have package items yet
      const dishIdsToAdd = package_item_ids.filter(dishId => !allPackageDishIds.has(dishId));
      
      if (dishIdsToAdd.length > 0) {
        const dishes = await prisma.dish.findMany({
          where: {
            id: { in: dishIdsToAdd },
            caterer_id: catererId,
          },
        });

        await Promise.all(
          dishes.map(dish =>
            prisma.packageItem.create({
              data: {
                dish_id: dish.id,
                caterer_id: catererId,
                people_count: minimumPeople,
                quantity: dish.pieces || 1,
                price_at_time: dish.price,
                is_optional: customisationType === "CUSTOMISABLE",
                is_addon: false,
                package_id: packageId,
              },
            })
          )
        );
      }

      // Remove items that are no longer needed
      if (itemsToRemove.length > 0) {
        await prisma.packageItem.updateMany({
          where: { id: { in: itemsToRemove } },
          data: { package_id: null },
        });
      }
    }
  }

  // Handle category selections update
  if (category_selections !== undefined) {
    // Delete existing category selections
    await prisma.packageCategorySelection.deleteMany({
      where: { package_id: packageId },
    });

    // Create new category selections if provided and package is CUSTOMISABLE
    // Filter out 'uncategorized' as it's not a real category in the database
    if (category_selections.length > 0 && customisationType === "CUSTOMISABLE") {
      const validCategorySelections = category_selections.filter(
        cs => cs.category_id && cs.category_id !== 'uncategorized'
      );
      
      if (validCategorySelections.length > 0) {
        await prisma.packageCategorySelection.createMany({
          data: validCategorySelections.map(cs => ({
            package_id: packageId,
            category_id: cs.category_id,
            num_dishes_to_select: cs.num_dishes_to_select,
          })),
        });
      }
    }
  }

  // If any related data was updated, fetch the updated package
  if (category_selections !== undefined || occassion !== undefined || package_item_ids !== undefined) {
    const updatedPackage = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
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
        add_ons: {
          where: {
            is_active: true,
          },
          orderBy: {
            created_at: "asc",
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

