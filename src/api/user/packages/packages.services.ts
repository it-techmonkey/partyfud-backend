import prisma from "../../../lib/prisma";

/**
 * Get all active and available packages by caterer ID
 * Only returns packages for approved caterers
 */
export const getPackagesByCatererId = async (catererId: string) => {
  // First verify the caterer exists and is approved
  const caterer = await prisma.user.findFirst({
    where: {
      id: catererId,
      type: "CATERER",
      catererinfo: {
        status: "APPROVED",
      },
    },
  });

  if (!caterer) {
    throw new Error("Caterer not found or not approved");
  }

  // Get all active and available packages for this caterer (only created by CATERER)
  const packages = await prisma.package.findMany({
    where: {
      caterer_id: catererId,
      is_active: true,
      is_available: true,
      created_by: "CATERER", // Only show packages created by caterers
    },
    include: {
      items: {
        include: {
          dish: {
            include: {
              cuisine_type: true,
              category: true,
              sub_category: true,
              free_forms: {
                include: {
                  freeform: true,
                },
              },
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

  // Format the response
  return await Promise.all(packages.map(async (pkg) => await formatPackageResponse(pkg)));
};

/**
 * Get packages by occasion name
 * Filters packages that have the specified occasion
 */
export const getPackagesByOccasionName = async (occasionName: string) => {
  // First, find the occasion by name (case-insensitive)
  const occasion = await prisma.occassion.findFirst({
    where: {
      name: {
        equals: occasionName,
        mode: 'insensitive',
      },
    },
  });

  if (!occasion) {
    throw new Error(`Occasion "${occasionName}" not found`);
  }

  // Build where clause for packages
  const packageWhere: any = {
    is_active: true,
    is_available: true,
    created_by: "CATERER", // Only show packages created by caterers
    caterer: {
      type: "CATERER",
      catererinfo: {
        status: "APPROVED",
      },
    },
    occasions: {
      some: {
        occasion_id: occasion.id,
      },
    },
  };

  // Get packages with all relations
  const packages = await prisma.package.findMany({
    where: packageWhere,
    include: {
      caterer: {
        include: {
          catererinfo: true,
        },
      },
      items: {
        include: {
          dish: {
            include: {
              cuisine_type: true,
              category: true,
              sub_category: true,
              free_forms: {
                include: {
                  freeform: true,
                },
              },
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
      created_at: 'desc',
    },
  });

  // Format the response (same format as getAllPackagesWithFilters)
  return await Promise.all(packages.map(async (pkg) => await formatPackageResponse(pkg)));
};

/**
 * Get a single package by ID
 * Only returns package if it's active, available, and from an approved caterer
 */
export const getPackageById = async (packageId: string) => {
  // Get the package with all relations (allow both USER and CATERER created packages)
  const pkg = await prisma.package.findFirst({
    where: {
      id: packageId,
      is_active: true,
      is_available: true,
      // Allow both USER and CATERER created packages
      OR: [
        {
          created_by: "USER",
        },
        {
          created_by: "CATERER",
          caterer: {
            type: "CATERER",
            catererinfo: {
              status: "APPROVED",
            },
          },
        },
      ],
    },
    include: {
      caterer: {
        include: {
          catererinfo: true,
        },
      },
      items: {
        include: {
          dish: {
            include: {
              cuisine_type: true,
              category: true,
              sub_category: true,
              free_forms: {
                include: {
                  freeform: true,
                },
              },
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

  if (!pkg) {
    throw new Error("Package not found or not available");
  }

  // Format the response (same format as getPackagesByCatererId)
  return await formatPackageResponse(pkg);
};

/**
 * Get all packages with filters
 * Supports filtering by:
 * - caterer_id (optional)
 * - location/region
 * - min_guests, max_guests
 * - min_price, max_price
 * - occasion_id
 * - cuisine_type_id
 * - category_id
 * - search (package name)
 * - menu_type (fixed, customizable)
 * - sort_by (price_asc, price_desc, rating_desc, created_desc)
 */
export interface PackageFilters {
  caterer_id?: string;
  location?: string;
  region?: string;
  min_guests?: number;
  max_guests?: number;
  min_price?: number;
  max_price?: number;
  occasion_id?: string;
  occasion_ids?: string[]; // Support multiple occasion IDs
  cuisine_type_id?: string;
  category_id?: string;
  package_type?: string;
  search?: string;
  menu_type?: 'fixed' | 'customizable';
  sort_by?: 'price_asc' | 'price_desc' | 'rating_desc' | 'created_desc';
  created_by?: 'USER' | 'CATERER'; // Filter by who created the package
  user_id?: string; // Filter by user ID who created the package
  dish_id?: string; // Filter by dish ID the package contains
}


export const getAllPackagesWithFilters = async (filters: PackageFilters = {}) => {
  // Build where clause for packages
  const packageWhere: any = {
    is_active: true,
    is_available: true,
    caterer: {
      type: "CATERER",
      catererinfo: {
        status: "APPROVED",
      },
    },
  };

  // Filter by created_by (default to CATERER if not specified)
  if (filters.created_by) {
    packageWhere.created_by = filters.created_by;
  } else {
    // Default behavior: only show CATERER-created packages
    packageWhere.created_by = "CATERER";
  }

  // Filter by user_id (for user-created packages)
  if (filters.user_id) {
    packageWhere.user_id = filters.user_id;
  }

  // Filter by caterer_id
  if (filters.caterer_id) {
    packageWhere.caterer_id = filters.caterer_id;
  }

  // Filter by minimum_people (guests) - support both field names during migration
  if (filters.min_guests !== undefined || filters.max_guests !== undefined) {
    // Use OR condition to support both minimum_people and people_count during migration
    packageWhere.OR = [
      {
        minimum_people: {
          ...(filters.min_guests !== undefined && { gte: filters.min_guests }),
          ...(filters.max_guests !== undefined && { lte: filters.max_guests }),
        },
      },
      {
        people_count: {
          ...(filters.min_guests !== undefined && { gte: filters.min_guests }),
          ...(filters.max_guests !== undefined && { lte: filters.max_guests }),
        },
      },
    ];
  }

  // Filter by price
  if (filters.min_price !== undefined || filters.max_price !== undefined) {
    packageWhere.total_price = {};
    if (filters.min_price !== undefined) {
      packageWhere.total_price.gte = filters.min_price;
    }
    if (filters.max_price !== undefined) {
      packageWhere.total_price.lte = filters.max_price;
    }
  }

  // Filter by search (package name)
  if (filters.search) {
    packageWhere.name = {
      contains: filters.search,
      mode: 'insensitive',
    };
  }

  // Filter by location/region (from catererinfo)
  if (filters.location || filters.region) {
    const locationFilters: any[] = [];
    if (filters.location) {
      locationFilters.push({ service_area: { contains: filters.location, mode: 'insensitive' } });
    }
    if (filters.region) {
      // Region is now an array, so we use hasSome to check if any region matches
      locationFilters.push({ region: { hasSome: [filters.region] } });
    }

    packageWhere.caterer = {
      ...packageWhere.caterer,
      catererinfo: {
        ...packageWhere.caterer.catererinfo,
        ...(locationFilters.length > 0 ? { OR: locationFilters } : {}),
      },
    };
  }

  // Filter by occasion (support both single and multiple)
  if (filters.occasion_ids && filters.occasion_ids.length > 0) {
    // Multiple occasions - package must have at least one of the selected occasions
    packageWhere.occasions = {
      some: {
        occasion_id: {
          in: filters.occasion_ids,
        },
      },
    };
  } else if (filters.occasion_id) {
    // Single occasion (backward compatibility)
    packageWhere.occasions = {
      some: {
        occasion_id: filters.occasion_id,
      },
    };
  }

  // Package type filtering is no longer supported

  // Handle dish, cuisine, and category filters together
  if (filters.dish_id || filters.cuisine_type_id || filters.category_id) {
    const dishFilters: any = {};
    if (filters.dish_id) {
      dishFilters.id = filters.dish_id;
    }
    if (filters.cuisine_type_id) {
      dishFilters.cuisine_type_id = filters.cuisine_type_id;
    }
    if (filters.category_id) {
      dishFilters.category_id = filters.category_id;
    }

    packageWhere.items = {
      some: {
        dish: dishFilters,
      },
    };
  }

  // Filter by menu type using customisation_type
  if (filters.menu_type === 'customizable') {
    packageWhere.customisation_type = 'CUSTOMISABLE';
  } else if (filters.menu_type === 'fixed') {
    packageWhere.customisation_type = 'FIXED';
  }

  // Build orderBy clause
  let orderBy: any = { created_at: 'desc' };
  if (filters.sort_by) {
    switch (filters.sort_by) {
      case 'price_asc':
        orderBy = { total_price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { total_price: 'desc' };
        break;
      case 'rating_desc':
        orderBy = { rating: 'desc' };
        break;
      case 'created_desc':
        orderBy = { created_at: 'desc' };
        break;
    }
  }

  // Get packages with all relations
  const packages = await prisma.package.findMany({
    where: packageWhere,
    include: {
      caterer: {
        include: {
          catererinfo: true,
        },
      },
      items: {
        include: {
          dish: {
            include: {
              cuisine_type: true,
              category: true,
              sub_category: true,
              free_forms: {
                include: {
                  freeform: true,
                },
              },
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
    orderBy,
  });

  // Format the response (same format as getPackagesByCatererId)
  // Recalculate prices for non-custom packages to ensure serves_people is applied
  return await Promise.all(packages.map(async (pkg) => await formatPackageResponse(pkg)));
};

/**
 * Create a custom package for a user
 * User selects dishes and creates their own package
 */
export interface CreateCustomPackageData {
  name?: string; // Optional, will be auto-generated if not provided
  dish_ids: string[]; // Array of dish IDs selected by user
  minimum_people: number; // Minimum number of people for the package
  people_count?: number; // Legacy field - kept for backward compatibility
  quantities?: { [dish_id: string]: number }; // Optional quantities for each dish (default: 1)
}

export const createCustomPackage = async (
  userId: string,
  data: CreateCustomPackageData
) => {
  // Validate required fields
  if (!data.dish_ids || data.dish_ids.length === 0) {
    throw new Error("At least one dish ID is required");
  }

  // Support both minimum_people and people_count during migration
  const minimumPeople = data.minimum_people || data.people_count || 0;
  if (!minimumPeople || minimumPeople <= 0) {
    throw new Error("minimum_people must be greater than 0");
  }

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Fetch all dishes to validate and get their details
  const dishes = await prisma.dish.findMany({
    where: {
      id: { in: data.dish_ids },
      is_active: true,
    },
    include: {
      caterer: {
        include: {
          catererinfo: true,
        },
      },
    },
  });

  if (dishes.length !== data.dish_ids.length) {
    throw new Error("Some dishes not found or are inactive");
  }

  // Check if all dishes are from the same caterer
  // Filter out null values to get only dishes with caterer_id set
  const dishesWithCaterer = dishes.filter((dish) => dish.caterer_id);
  const catererIds = new Set(dishesWithCaterer.map((dish) => dish.caterer_id).filter(Boolean));

  // If some dishes don't have caterer_id, we need to check if we can infer it
  const dishesWithoutCaterer = dishes.filter((dish) => !dish.caterer_id);

  let catererId: string | null = null;

  if (catererIds.size === 0) {
    // All dishes lack caterer_id - try to infer from package items if possible
    // This can happen if dishes were added to packages before caterer_id was required
    if (dishesWithoutCaterer.length === dishes.length) {
      // Try to find the caterer_id from package items that reference these dishes
      const packageItems = await prisma.packageItem.findMany({
        where: {
          dish_id: { in: data.dish_ids },
        },
        include: {
          package: {
            select: {
              caterer_id: true,
            },
          },
        },
      });

      const packageCatererIds = new Set(
        packageItems
          .map((item) => item.package?.caterer_id)
          .filter(Boolean)
      );

      if (packageCatererIds.size === 1) {
        catererId = Array.from(packageCatererIds)[0] as string;
      } else if (packageCatererIds.size === 0) {
        throw new Error("All dishes must belong to a caterer. Please ensure all selected dishes have a valid caterer assigned.");
      } else {
        throw new Error("All dishes must be from the same caterer");
      }
    } else {
      throw new Error("All dishes must belong to a caterer");
    }
  } else if (catererIds.size === 1) {
    catererId = Array.from(catererIds)[0] as string;

    // If some dishes don't have caterer_id but others do, check if we can infer it
    if (dishesWithoutCaterer.length > 0) {
      // Verify that dishes without caterer_id belong to packages from the same caterer
      const packageItems = await prisma.packageItem.findMany({
        where: {
          dish_id: { in: dishesWithoutCaterer.map((d) => d.id) },
        },
        include: {
          package: {
            select: {
              caterer_id: true,
            },
          },
        },
      });

      const packageCatererIds = new Set(
        packageItems
          .map((item) => item.package?.caterer_id)
          .filter(Boolean)
      );

      // If all dishes without caterer_id are from packages with the same caterer as dishes with caterer_id
      if (packageCatererIds.size > 0 && Array.from(packageCatererIds)[0] === catererId) {
        // All good - dishes without caterer_id belong to the same caterer
      } else if (packageCatererIds.size > 1 || (packageCatererIds.size === 1 && Array.from(packageCatererIds)[0] !== catererId)) {
        throw new Error("All dishes must be from the same caterer");
      }
    }
  } else {
    throw new Error("All dishes must be from the same caterer");
  }

  if (!catererId) {
    throw new Error("Unable to determine caterer for selected dishes");
  }

  // Verify caterer is approved
  const caterer = await prisma.user.findFirst({
    where: {
      id: catererId,
      type: "CATERER",
      catererinfo: {
        status: "APPROVED",
      },
    },
  });

  if (!caterer) {
    throw new Error("Caterer not found or not approved");
  }

  // Determine package_type_id
  // Package type is no longer required

  // Calculate total price from dishes
  // Note: Dish prices are stored as per-person prices
  // Total price = sum of (dish_price * quantity) * minimum_people
  let totalPrice = 0;
  const dishQuantities = data.quantities || {};

  dishes.forEach((dish) => {
    const quantity = dishQuantities[dish.id] || 1;
    const dishPrice = Number(dish.price);
    totalPrice += dishPrice * quantity;
  });

  // Multiply by minimum_people since dish prices are per-person
  totalPrice = totalPrice * minimumPeople;

  // Generate package name if not provided
  const packageName =
    data.name ||
    `Custom Package - ${dishes.length} dish${dishes.length > 1 ? "es" : ""} - ${minimumPeople} people`;

  // Create the package
  const packageData = await prisma.package.create({
    data: {
      name: packageName,
      minimum_people: minimumPeople,
      cover_image_url: null, // As per requirement
      total_price: totalPrice,
      currency: "AED",
      caterer_id: catererId,
      user_id: userId, // Store the user ID who created this package
      created_by: "USER",
      customisation_type: "CUSTOMISABLE", // User-created packages are always customizable
      is_active: true,
      is_available: true,
    },
    include: {
      caterer: {
        include: {
          catererinfo: true,
        },
      },
    },
  });

  // Create package items for each dish
  await Promise.all(
    dishes.map(async (dish) => {
      const quantity = dishQuantities[dish.id] || 1;

      return await prisma.packageItem.create({
        data: {
          package_id: packageData.id,
          caterer_id: catererId,
          dish_id: dish.id,
          people_count: minimumPeople, // PackageItem still uses people_count for the item's people count
          quantity: quantity,
          is_optional: false,
          is_addon: false,
          price_at_time: dish.price, // Store price at creation time
        },
        include: {
          dish: {
            include: {
              cuisine_type: true,
              category: true,
              sub_category: true,
              free_forms: {
                include: {
                  freeform: true,
                },
              },
            },
          },
        },
      });
    })
  );

  // Fetch the complete package with all relations
  const completePackage = await prisma.package.findUnique({
    where: { id: packageData.id },
    include: {
      caterer: {
        include: {
          catererinfo: true,
        },
      },
      items: {
        include: {
          dish: {
            include: {
              cuisine_type: true,
              category: true,
              sub_category: true,
              free_forms: {
                include: {
                  freeform: true,
                },
              },
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

  if (!completePackage) {
    throw new Error("Failed to retrieve created package");
  }

  // Format the response (same format as other package endpoints)
  return formatPackageResponse(completePackage);
};


/**
 * Helper to format package response
 * Standardizes the response format across all package endpoints
 * Recalculates prices for non-custom packages to ensure serves_people is applied
 */
const formatPackageResponse = async (pkg: any) => {
  // Support both minimum_people and people_count during migration
  const minimumPeople = pkg.minimum_people || pkg.people_count || 1;
  
  let totalPrice = Number(pkg.total_price);
  const isCustomPrice = pkg.is_custom_price ?? false;
  
  // Recalculate price for non-custom packages if they have items
  // This ensures serves_people is properly applied even if dishes were updated
  if (!isCustomPrice && pkg.items && pkg.items.length > 0) {
    const { calculatePackagePrice } = await import('../../caterer/packages/packages.services');
    totalPrice = await calculatePackagePrice(pkg.id, minimumPeople);
  }

  return {
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    minimum_people: minimumPeople,
    people_count: minimumPeople, // Keep for backward compatibility
    cover_image_url: pkg.cover_image_url,
    total_price: totalPrice,
    is_custom_price: isCustomPrice,
    price_per_person: totalPrice / minimumPeople,
    currency: pkg.currency,
    rating: pkg.rating,
    is_available: pkg.is_available,
    customisation_type: pkg.customisation_type,
    created_by: pkg.created_by,
    user_id: pkg.user_id,
    additional_info: pkg.additional_info,
    // Only include caterer if the relation was fetched
    caterer: pkg.caterer ? {
      id: pkg.caterer.id,
      name: pkg.caterer.catererinfo?.business_name || pkg.caterer.company_name || 'Unknown',
      location: pkg.caterer.catererinfo?.service_area ||
        (Array.isArray(pkg.caterer.catererinfo?.region)
          ? pkg.caterer.catererinfo.region.join(', ')
          : pkg.caterer.catererinfo?.region) || null,
    } : undefined,
    items: pkg.items?.map((item: any) => ({
      id: item.id,
      dish: item.dish ? {
        id: item.dish.id,
        name: item.dish.name,
        image_url: item.dish.image_url,
        price: Number(item.dish.price),
        currency: item.dish.currency,
        quantity: item.dish.quantity,
        pieces: item.dish.pieces,
        serves_people: item.dish.serves_people,
        cuisine_type: item.dish.cuisine_type?.name,
        category: item.dish.category?.name || null,
        sub_category: item.dish.sub_category?.name || null,
        free_forms: item.dish.free_forms?.map((df: any) => ({
          id: df.freeform.id,
          name: df.freeform.name,
          description: df.freeform.description,
        })) || [],
      } : null,
      people_count: item.people_count,
      quantity: item.quantity,
      is_optional: item.is_optional,
      is_addon: item.is_addon,
      price_at_time: item.price_at_time ? Number(item.price_at_time) : null,
    })) || [],
    category_selections: pkg.category_selections?.map((selection: any) => ({
      id: selection.id,
      category: {
        id: selection.category.id,
        name: selection.category.name,
        description: selection.category.description,
      },
      num_dishes_to_select: selection.num_dishes_to_select,
    })) || [],
    occasions: pkg.occasions?.map((occ: any) => ({
      id: occ.id,
      occasion: {
        id: occ.occassion.id,
        name: occ.occassion.name,
        image_url: occ.occassion.image_url,
        description: occ.occassion.description,
      },
    })) || [],
    add_ons: pkg.add_ons ? pkg.add_ons.map((addOn: any) => ({
      id: addOn.id,
      package_id: addOn.package_id,
      name: addOn.name,
      description: addOn.description,
      price: Number(addOn.price),
      currency: addOn.currency,
      is_active: addOn.is_active,
      created_at: addOn.created_at,
      updated_at: addOn.updated_at,
    })) : [],
    created_at: pkg.created_at,
    updated_at: pkg.updated_at,
  };
};
