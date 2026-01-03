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

  // Get all active and available packages for this caterer
  const packages = await prisma.package.findMany({
    where: {
      caterer_id: catererId,
      is_active: true,
      is_available: true,
    },
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
    orderBy: {
      created_at: "desc",
    },
  });

  // Format the response
  return packages.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    people_count: pkg.people_count,
    package_type: {
      id: pkg.package_type.id,
      name: pkg.package_type.name,
      description: pkg.package_type.description,
    },
    cover_image_url: pkg.cover_image_url,
    total_price: Number(pkg.total_price),
    price_per_person: Number(pkg.total_price) / pkg.people_count,
    currency: pkg.currency,
    rating: pkg.rating,
    is_available: pkg.is_available,
    items: pkg.items.map((item) => ({
      id: item.id,
      dish: {
        id: item.dish.id,
        name: item.dish.name,
        image_url: item.dish.image_url,
        price: Number(item.dish.price),
        currency: item.dish.currency,
        quantity_in_gm: item.dish.quantity_in_gm,
        pieces: item.dish.pieces,
        cuisine_type: item.dish.cuisine_type.name,
        category: item.dish.category.name,
        sub_category: item.dish.sub_category?.name || null,
      },
      people_count: item.people_count,
      quantity: item.quantity,
      is_optional: item.is_optional,
      is_addon: item.is_addon,
      price_at_time: item.price_at_time ? Number(item.price_at_time) : null,
    })),
    category_selections: pkg.category_selections.map((selection) => ({
      id: selection.id,
      category: {
        id: selection.category.id,
        name: selection.category.name,
        description: selection.category.description,
      },
      num_dishes_to_select: selection.num_dishes_to_select,
    })),
    occasions: pkg.occasions.map((occ) => ({
      id: occ.id,
      occasion: {
        id: occ.occassion.id,
        name: occ.occassion.name,
        description: occ.occassion.description,
      },
    })),
    created_at: pkg.created_at,
    updated_at: pkg.updated_at,
  }));
};

/**
 * Get a single package by ID
 * Only returns package if it's active, available, and from an approved caterer
 */
export const getPackageById = async (packageId: string) => {
  // Get the package with all relations
  const pkg = await prisma.package.findFirst({
    where: {
      id: packageId,
      is_active: true,
      is_available: true,
      caterer: {
        type: "CATERER",
        catererinfo: {
          status: "APPROVED",
        },
      },
    },
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

  if (!pkg) {
    throw new Error("Package not found or not available");
  }

  // Format the response (same format as getPackagesByCatererId)
  return {
    id: pkg.id,
    name: pkg.name,
    people_count: pkg.people_count,
    package_type: {
      id: pkg.package_type.id,
      name: pkg.package_type.name,
      description: pkg.package_type.description,
    },
    cover_image_url: pkg.cover_image_url,
    total_price: Number(pkg.total_price),
    price_per_person: Number(pkg.total_price) / pkg.people_count,
    currency: pkg.currency,
    rating: pkg.rating,
    is_available: pkg.is_available,
    items: pkg.items.map((item) => ({
      id: item.id,
      dish: {
        id: item.dish.id,
        name: item.dish.name,
        image_url: item.dish.image_url,
        price: Number(item.dish.price),
        currency: item.dish.currency,
        quantity_in_gm: item.dish.quantity_in_gm,
        pieces: item.dish.pieces,
        cuisine_type: item.dish.cuisine_type.name,
        category: item.dish.category.name,
        sub_category: item.dish.sub_category?.name || null,
      },
      people_count: item.people_count,
      quantity: item.quantity,
      is_optional: item.is_optional,
      is_addon: item.is_addon,
      price_at_time: item.price_at_time ? Number(item.price_at_time) : null,
    })),
    category_selections: pkg.category_selections.map((selection) => ({
      id: selection.id,
      category: {
        id: selection.category.id,
        name: selection.category.name,
        description: selection.category.description,
      },
      num_dishes_to_select: selection.num_dishes_to_select,
    })),
    occasions: pkg.occasions.map((occ) => ({
      id: occ.id,
      occasion: {
        id: occ.occassion.id,
        name: occ.occassion.name,
        description: occ.occassion.description,
      },
    })),
    created_at: pkg.created_at,
    updated_at: pkg.updated_at,
  };
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
  cuisine_type_id?: string;
  category_id?: string;
  search?: string;
  menu_type?: 'fixed' | 'customizable';
  sort_by?: 'price_asc' | 'price_desc' | 'rating_desc' | 'created_desc';
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

  // Filter by caterer_id
  if (filters.caterer_id) {
    packageWhere.caterer_id = filters.caterer_id;
  }

  // Filter by people_count (guests)
  if (filters.min_guests !== undefined || filters.max_guests !== undefined) {
    packageWhere.people_count = {};
    if (filters.min_guests !== undefined) {
      packageWhere.people_count.gte = filters.min_guests;
    }
    if (filters.max_guests !== undefined) {
      packageWhere.people_count.lte = filters.max_guests;
    }
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
      locationFilters.push({ region: { contains: filters.region, mode: 'insensitive' } });
    }
    
    packageWhere.caterer = {
      ...packageWhere.caterer,
      catererinfo: {
        ...packageWhere.caterer.catererinfo,
        ...(locationFilters.length > 0 ? { OR: locationFilters } : {}),
      },
    };
  }

  // Filter by occasion
  if (filters.occasion_id) {
    packageWhere.occasions = {
      some: {
        occasion_id: filters.occasion_id,
      },
    };
  }

  // Filter by cuisine_type and/or category (through package items -> dishes)
  if (filters.cuisine_type_id || filters.category_id) {
    const dishFilters: any = {};
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

  // Filter by menu type
  if (filters.menu_type === 'customizable') {
    // Customizable means package has optional items or category selections
    packageWhere.OR = [
      { items: { some: { is_optional: true } } },
      { category_selections: { some: {} } },
    ];
  } else if (filters.menu_type === 'fixed') {
    // Fixed means no optional items and no category selections
    packageWhere.items = {
      ...(packageWhere.items || {}),
      none: { is_optional: true },
    };
    packageWhere.category_selections = {
      none: {},
    };
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
      package_type: true,
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
  return packages.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    people_count: pkg.people_count,
    package_type: {
      id: pkg.package_type.id,
      name: pkg.package_type.name,
      description: pkg.package_type.description,
    },
    cover_image_url: pkg.cover_image_url,
    total_price: Number(pkg.total_price),
    price_per_person: Number(pkg.total_price) / pkg.people_count,
    currency: pkg.currency,
    rating: pkg.rating,
    is_available: pkg.is_available,
    caterer: {
      id: pkg.caterer.id,
      name: pkg.caterer.catererinfo?.business_name || pkg.caterer.company_name || 'Unknown',
      location: pkg.caterer.catererinfo?.service_area || pkg.caterer.catererinfo?.region || null,
    },
    items: pkg.items.map((item) => ({
      id: item.id,
      dish: {
        id: item.dish.id,
        name: item.dish.name,
        image_url: item.dish.image_url,
        price: Number(item.dish.price),
        currency: item.dish.currency,
        quantity_in_gm: item.dish.quantity_in_gm,
        pieces: item.dish.pieces,
        cuisine_type: item.dish.cuisine_type.name,
        category: item.dish.category.name,
        sub_category: item.dish.sub_category?.name || null,
      },
      people_count: item.people_count,
      quantity: item.quantity,
      is_optional: item.is_optional,
      is_addon: item.is_addon,
      price_at_time: item.price_at_time ? Number(item.price_at_time) : null,
    })),
    category_selections: pkg.category_selections.map((selection) => ({
      id: selection.id,
      category: {
        id: selection.category.id,
        name: selection.category.name,
        description: selection.category.description,
      },
      num_dishes_to_select: selection.num_dishes_to_select,
    })),
    occasions: pkg.occasions.map((occ) => ({
      id: occ.id,
      occasion: {
        id: occ.occassion.id,
        name: occ.occassion.name,
        description: occ.occassion.description,
      },
    })),
    created_at: pkg.created_at,
    updated_at: pkg.updated_at,
  }));
};

