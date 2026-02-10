import prisma from "../../../lib/prisma";

export interface FilterCaterersParams {
  location?: string;
  guests?: number;
  minGuests?: number; // Minimum guest count
  maxGuests?: number; // Maximum guest count
  date?: string; // ISO date string
  minBudget?: number;
  maxBudget?: number;
  menuType?: {
    fixed?: boolean;
    customizable?: boolean;
    liveStations?: boolean;
  };
  search?: string;
  occasionId?: string; // Filter by occasion ID
  dietaryNeeds?: string[]; // Array of dietary need IDs
}

/**
 * Filter and fetch all approved caterers based on criteria
 */
export const filterCaterers = async (params: FilterCaterersParams) => {
  const {
    location,
    guests,
    minGuests,
    maxGuests,
    date,
    minBudget,
    maxBudget,
    menuType,
    search,
    occasionId,
    dietaryNeeds,
  } = params;

  // Build where clause for catererinfo
  const whereClause: any = {
    status: "APPROVED", // Only show approved caterers
  };

  // Filter by location/region
  if (location && location !== "All") {
    // Region is now an array, so we use hasSome to check if any region matches
    whereClause.region = { hasSome: [location] };
  }

  // Build AND conditions array for complex filters
  const andConditions: any[] = [];

  // Filter by guest count (check if caterer can handle the number of guests)
  // Support both single guest count and min/max range
  if ((minGuests !== undefined && minGuests > 0) || (maxGuests !== undefined && maxGuests > 0)) {
    // For ranges to overlap: caterer.min <= user.max AND caterer.max >= user.min
    const guestConditions: any[] = [];

    // If minGuests is provided: caterer must be able to handle at least this many
    // This means: caterer.maximum_guests >= minGuests (caterer can handle at least minGuests)
    if (minGuests !== undefined && minGuests > 0) {
      guestConditions.push({
        OR: [
          { maximum_guests: { gte: minGuests } },
          { maximum_guests: null }, // Include caterers with no max limit
        ],
      });
    }

    // If maxGuests is provided: caterer's minimum must not exceed this
    // This means: caterer.minimum_guests <= maxGuests (caterer's min is not more than maxGuests)
    if (maxGuests !== undefined && maxGuests > 0) {
      guestConditions.push({
        OR: [
          { minimum_guests: { lte: maxGuests } },
          { minimum_guests: null }, // Include caterers with no min requirement
        ],
      });
    }

    if (guestConditions.length > 0) {
      andConditions.push({
        AND: guestConditions,
      });
    }
  } else if (guests && guests > 0) {
    // Single guest count (legacy support)
    andConditions.push({
      OR: [
        {
          AND: [
            { minimum_guests: { lte: guests } },
            { maximum_guests: { gte: guests } },
          ],
        },
        {
          AND: [
            { minimum_guests: null },
            { maximum_guests: { gte: guests } },
          ],
        },
        {
          AND: [
            { minimum_guests: { lte: guests } },
            { maximum_guests: null },
          ],
        },
      ],
    });
  }

  // Filter by menu type (delivery_only, delivery_plus_setup, full_service)
  if (menuType) {
    const menuConditions: any[] = [];

    if (menuType.fixed) {
      // Fixed menu typically means delivery_only or delivery_plus_setup
      menuConditions.push({ delivery_only: true });
      menuConditions.push({ delivery_plus_setup: true });
    }

    if (menuType.customizable) {
      // Customizable can be any service type
      menuConditions.push({ delivery_only: true });
      menuConditions.push({ delivery_plus_setup: true });
      menuConditions.push({ full_service: true });
    }

    if (menuType.liveStations) {
      // Live stations typically require full_service
      menuConditions.push({ full_service: true });
    }

    if (menuConditions.length > 0) {
      andConditions.push({
        OR: menuConditions,
      });
    }
  }

  // Combine AND conditions if any exist
  if (andConditions.length > 0) {
    whereClause.AND = andConditions;
  }

  // Get all approved caterers with their info
  const caterers = await prisma.user.findMany({
    where: {
      type: "CATERER",
      catererinfo: whereClause,
      // Search filter on business name or user name
      ...(search && {
        OR: [
          { first_name: { contains: search, mode: "insensitive" } },
          { last_name: { contains: search, mode: "insensitive" } },
          { company_name: { contains: search, mode: "insensitive" } },
          {
            catererinfo: {
              business_name: { contains: search, mode: "insensitive" },
            },
          },
        ],
      }),
    },
    include: {
      catererinfo: true,
      packages: {
        where: {
          is_active: true,
          is_available: true,
          // Filter by occasion if provided
          ...(occasionId && {
            occasions: {
              some: {
                occasion_id: occasionId,
              },
            },
          }),
        },
        include: {
          occasions: {
            include: {
              occassion: true,
            },
          },
        },
      },
      dishes: {
        where: {
          is_active: true,
        },
        include: {
          cuisine_type: true,
          category: true,
        },
        take: 10, // Limit dishes for performance
      },
    },
  });

  // Filter by budget range (based on package prices)
  let filteredCaterers = caterers;

  // Filter out caterers with no matching packages after occasion filter
  if (occasionId) {
    filteredCaterers = caterers.filter((caterer) => {
      return caterer.packages && caterer.packages.length > 0;
    });
  }

  if ((minBudget !== undefined && minBudget > 0) || (maxBudget !== undefined && maxBudget > 0)) {
    filteredCaterers = filteredCaterers.filter((caterer) => {
      if (!caterer.packages || caterer.packages.length === 0) {
        return false; // Exclude caterers with no packages when filtering by budget
      }

      // Calculate price per person for each package
      const packagePrices = caterer.packages
        .filter((pkg: any) => pkg.minimum_people > 0) // Filter out packages with invalid people count
        .map((pkg: any) => {
          const pricePerPerson = Number(pkg.total_price) / pkg.minimum_people;
          return pricePerPerson;
        });

      if (packagePrices.length === 0) {
        return false; // No valid packages
      }

      // Get min and max price per person
      const minPrice = Math.min(...packagePrices);
      const maxPrice = Math.max(...packagePrices);

      // Check if caterer's price range overlaps with filter range
      // Caterer is included if their price range overlaps with the filter range
      if (minBudget !== undefined && minBudget > 0 && maxBudget !== undefined && maxBudget > 0) {
        // Both min and max specified: caterer's range must overlap
        // Range overlap: caterer.min <= filter.max AND caterer.max >= filter.min
        return minPrice <= maxBudget && maxPrice >= minBudget;
      } else if (minBudget !== undefined && minBudget > 0) {
        // Only min specified: caterer must have packages within or above this price
        // Show caterers whose max price is >= minBudget (they have options at or above this price)
        return maxPrice >= minBudget;
      } else if (maxBudget !== undefined && maxBudget > 0) {
        // Only max specified: caterer must have packages within or below this price
        // Show caterers whose min price is <= maxBudget (they have options at or below this price)
        return minPrice <= maxBudget;
      }

      return true;
    });
  }

  // Filter by date availability (if date is provided)
  // Note: This is a placeholder - you may need to add availability/booking logic
  if (date) {
    // For now, we'll just return all caterers
    // In the future, you might want to check against a bookings/availability table
    // filteredCaterers = filteredCaterers.filter(caterer => {
    //   // Check if caterer is available on this date
    //   return true;
    // });
  }

  // Filter by menu type based on package customisation_type
  if (menuType) {
    // Only apply menu type filter if not all options are selected
    const allSelected = menuType.fixed && menuType.customizable && menuType.liveStations;
    const noneSelected = !menuType.fixed && !menuType.customizable && !menuType.liveStations;

    if (!allSelected && !noneSelected) {
      filteredCaterers = filteredCaterers.filter((caterer) => {
        if (!caterer.packages || caterer.packages.length === 0) {
          return true; // Include caterers with no packages
        }

        const hasFixedPackages = caterer.packages.some(
          (pkg: any) => pkg.customisation_type === 'FIXED'
        );
        const hasCustomizablePackages = caterer.packages.some(
          (pkg: any) => pkg.customisation_type === 'CUSTOMISABLE' || pkg.customisation_type === 'CUSTOMIZABLE'
        );
        const hasLiveStations = caterer.catererinfo?.full_service || false;

        // Check if caterer matches selected menu types
        if (menuType.fixed && !menuType.customizable && !menuType.liveStations) {
          return hasFixedPackages;
        }
        if (menuType.customizable && !menuType.fixed && !menuType.liveStations) {
          return hasCustomizablePackages;
        }
        if (menuType.liveStations && !menuType.fixed && !menuType.customizable) {
          return hasLiveStations;
        }
        if (menuType.fixed && menuType.customizable && !menuType.liveStations) {
          return hasFixedPackages || hasCustomizablePackages;
        }
        if (menuType.fixed && menuType.liveStations && !menuType.customizable) {
          return hasFixedPackages || hasLiveStations;
        }
        if (menuType.customizable && menuType.liveStations && !menuType.fixed) {
          return hasCustomizablePackages || hasLiveStations;
        }
        // If all are selected, return true (already handled above)
        return true;
      });
    }
  }

  // Filter by dietary needs
  if (dietaryNeeds && dietaryNeeds.length > 0) {
    filteredCaterers = filteredCaterers.filter((caterer) => {
      // Check if caterer's cuisine types or description mentions any of the dietary needs
      const catererText = (
        (caterer.catererinfo?.business_description || '') + ' ' +
        caterer.dishes.map((d: any) => d.cuisine_type?.name || '').join(' ')
      ).toLowerCase();

      // Check if caterer mentions any of the selected dietary needs
      const dietaryKeywords: Record<string, string[]> = {
        'vegetarian': ['vegetarian', 'veg'],
        'vegan': ['vegan'],
        'glutenFree': ['gluten-free', 'gluten free', 'glutenfree'],
        'halal': ['halal'],
        'kosher': ['kosher'],
        'nutFree': ['nut-free', 'nut free', 'nutfree', 'peanut free'],
        'dairyFree': ['dairy-free', 'dairy free', 'dairyfree', 'lactose free'],
      };

      return dietaryNeeds.some(need => {
        const keywords = dietaryKeywords[need] || [need.toLowerCase()];
        return keywords.some(keyword => catererText.includes(keyword));
      });
    });
  }

  // Format response with calculated price ranges
  const formattedCaterers = filteredCaterers.map((caterer) => formatCatererData(caterer));

  return formattedCaterers;
};

/**
 * Helper function to format caterer data
 */
const formatCatererData = (caterer: any) => {
  const packages = caterer.packages || [];
  const packagePrices = packages.map((pkg: any) => {
    return Number(pkg.total_price) / pkg.minimum_people;
  });

  const minPricePerPerson =
    packagePrices.length > 0 ? Math.min(...packagePrices) : 0;
  const maxPricePerPerson =
    packagePrices.length > 0 ? Math.max(...packagePrices) : 0;

  // Get unique cuisine types from dishes
  const cuisineTypes = [
    ...new Set(
      caterer.dishes
        .filter((dish: any) => dish.cuisine_type?.name)
        .map((dish: any) => dish.cuisine_type.name)
    ),
  ];

  return {
    id: caterer.id,
    name: caterer.catererinfo?.business_name || caterer.company_name || `${caterer.first_name} ${caterer.last_name}`,
    first_name: caterer.first_name,
    last_name: caterer.last_name,
    company_name: caterer.company_name,
    email: caterer.email,
    phone: caterer.phone,
    image_url: caterer.image_url,
    cuisines: cuisineTypes,
    location: Array.isArray(caterer.catererinfo?.region)
      ? caterer.catererinfo.region.join(', ')
      : (caterer.catererinfo?.region || "Unknown"),
    minPrice: minPricePerPerson,
    maxPrice: maxPricePerPerson,
    priceRange: `AED ${Math.round(minPricePerPerson)} – AED ${Math.round(maxPricePerPerson)}`,
    description: caterer.catererinfo?.business_description || "",
    minimum_guests: caterer.catererinfo?.minimum_guests,
    maximum_guests: caterer.catererinfo?.maximum_guests,
    service_area: caterer.catererinfo?.service_area,
    delivery_only: caterer.catererinfo?.delivery_only || false,
    delivery_plus_setup: caterer.catererinfo?.delivery_plus_setup || false,
    full_service: caterer.catererinfo?.full_service || false,
    business_name: caterer.catererinfo?.business_name,
    business_type: caterer.catererinfo?.business_type,
    business_description: caterer.catererinfo?.business_description,
    staff: caterer.catererinfo?.staff,
    servers: caterer.catererinfo?.servers,
    commission_rate: caterer.catererinfo?.commission_rate,
    gallery_images: caterer.catererinfo?.gallery_images || [],
    packages: packages.map((pkg: any) => ({
      id: pkg.id,
      name: pkg.name,
      people_count: pkg.minimum_people,
      total_price: Number(pkg.total_price),
      price_per_person: Number(pkg.total_price) / pkg.minimum_people,
      currency: pkg.currency,
      customisation_type: pkg.customisation_type,
      rating: pkg.rating,
      cover_image_url: pkg.cover_image_url,
      is_available: pkg.is_available,
      occasions: pkg.occasions?.map((po: any) => ({
        id: po.occassion?.id || po.occasion_id,
        name: po.occassion?.name,
      })) || [],
    })),
    packages_count: packages.length,
    dishes: caterer.dishes.map((dish: any) => ({
      id: dish.id,
      name: dish.name,
      image_url: dish.image_url,
      price: Number(dish.price),
      currency: dish.currency,
      quantity: dish.quantity,
      pieces: dish.pieces,
      cuisine_type: dish.cuisine_type?.name || null,
      category: dish.category?.name || null,
    })),
  };
};

/**
 * Get a single caterer by ID
 */
export const getCatererById = async (catererId: string) => {
  const caterer = await prisma.user.findFirst({
    where: {
      id: catererId,
      type: "CATERER",
      catererinfo: {
        status: "APPROVED", // Only return approved caterers
      },
    },
    include: {
      catererinfo: true,
      packages: {
        where: {
          is_active: true,
          is_available: true,
        },
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
          occasions: {
            include: {
              occassion: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      },
      dishes: {
        where: {
          is_active: true,
        },
        include: {
          cuisine_type: true,
          category: true,
          sub_category: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  if (!caterer) {
    throw new Error("Caterer not found or not approved");
  }

  return formatCatererData(caterer);
};

/**
 * Get all dishes by caterer ID
 * Only returns active dishes from approved caterers
 */
export const getDishesByCatererId = async (catererId: string) => {
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

  // Get all active dishes for this caterer
  const dishes = await prisma.dish.findMany({
    where: {
      caterer_id: catererId,
      is_active: true,
    },
    include: {
      cuisine_type: true,
      category: true,
      sub_category: true,
      caterer: {
        include: {
          catererinfo: true,
        },
      },
      free_forms: {
        include: {
          freeform: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  // Format the response
  return dishes.map((dish) => ({
    id: dish.id,
    name: dish.name,
    image_url: dish.image_url,
    cuisine_type: dish.cuisine_type ? {
      id: dish.cuisine_type.id,
      name: dish.cuisine_type.name,
      description: dish.cuisine_type.description,
    } : null,
    category: dish.category ? {
      id: dish.category.id,
      name: dish.category.name,
      description: dish.category.description,
    } : null,
    sub_category: dish.sub_category
      ? {
        id: dish.sub_category.id,
        name: dish.sub_category.name,
        description: dish.sub_category.description,
      }
      : null,
    caterer: dish.caterer
      ? {
        id: dish.caterer.id,
        name: dish.caterer.catererinfo?.business_name || dish.caterer.company_name || 'Unknown',
        location: dish.caterer.catererinfo?.service_area ||
          (Array.isArray(dish.caterer.catererinfo?.region)
            ? dish.caterer.catererinfo.region.join(', ')
            : dish.caterer.catererinfo?.region) || null,
      }
      : null,
    quantity: dish.quantity,
    pieces: dish.pieces,
    price: Number(dish.price),
    currency: dish.currency,
    is_active: dish.is_active,
    free_forms: dish.free_forms.map((df) => ({
      id: df.freeform.id,
      name: df.freeform.name,
      description: df.freeform.description,
    })),
    created_at: dish.created_at,
    updated_at: dish.updated_at,
  }));
};

