import prisma from "../../../lib/prisma";

export interface FilterCaterersParams {
  location?: string;
  guests?: number;
  date?: string; // ISO date string
  minBudget?: number;
  maxBudget?: number;
  menuType?: {
    fixed?: boolean;
    customizable?: boolean;
    liveStations?: boolean;
  };
  search?: string;
}

/**
 * Filter and fetch all approved caterers based on criteria
 */
export const filterCaterers = async (params: FilterCaterersParams) => {
  const {
    location,
    guests,
    date,
    minBudget,
    maxBudget,
    menuType,
    search,
  } = params;

  // Build where clause for catererinfo
  const whereClause: any = {
    status: "APPROVED", // Only show approved caterers
  };

  // Filter by location/region
  if (location && location !== "All") {
    whereClause.region = location;
  }

  // Build AND conditions array for complex filters
  const andConditions: any[] = [];

  // Filter by guest count (check if caterer can handle the number of guests)
  if (guests) {
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

  if (minBudget !== undefined || maxBudget !== undefined) {
    filteredCaterers = caterers.filter((caterer) => {
      if (!caterer.packages || caterer.packages.length === 0) {
        return true; // Include caterers with no packages (don't filter by budget)
      }

      // Calculate price per person for each package
      const packagePrices = caterer.packages.map((pkg) => {
        const pricePerPerson = Number(pkg.total_price) / pkg.minimum_people;
        return pricePerPerson;
      });

      // Get min and max price per person
      const minPrice = Math.min(...packagePrices);
      const maxPrice = Math.max(...packagePrices);

      // Check if price range matches filter
      if (minBudget !== undefined && maxPrice < minBudget) {
        return false;
      }
      if (maxBudget !== undefined && minPrice > maxBudget) {
        return false;
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

        // Check if caterer matches selected menu types
        if (menuType.fixed && !menuType.customizable && !menuType.liveStations) {
          return hasFixedPackages;
        }
        if (menuType.customizable && !menuType.fixed && !menuType.liveStations) {
          return hasCustomizablePackages;
        }
        if (menuType.fixed && menuType.customizable && !menuType.liveStations) {
          return hasFixedPackages || hasCustomizablePackages;
        }
        return true;
      });
    }
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
      caterer.dishes.map((dish: any) => dish.cuisine_type.name)
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
    location: caterer.catererinfo?.region || "Unknown",
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
    })),
    packages_count: packages.length,
    dishes: caterer.dishes.map((dish: any) => ({
      id: dish.id,
      name: dish.name,
      image_url: dish.image_url,
      price: Number(dish.price),
      currency: dish.currency,
      quantity_in_gm: dish.quantity_in_gm,
      pieces: dish.pieces,
      cuisine_type: dish.cuisine_type.name,
      category: dish.category.name,
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
    cuisine_type: {
      id: dish.cuisine_type.id,
      name: dish.cuisine_type.name,
      description: dish.cuisine_type.description,
    },
    category: {
      id: dish.category.id,
      name: dish.category.name,
      description: dish.category.description,
    },
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
          location: dish.caterer.catererinfo?.service_area || dish.caterer.catererinfo?.region || null,
        }
      : null,
    quantity_in_gm: dish.quantity_in_gm,
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

