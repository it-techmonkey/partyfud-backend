import prisma from "../../../lib/prisma";

/**
 * Filter interface for getting all dishes
 */
export interface DishFilters {
  caterer_id?: string;
  cuisine_type_id?: string;
  category_id?: string;
  sub_category_id?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  is_active?: boolean;
}

/**
 * Get all dishes with filters
 * Only returns dishes from approved caterers
 * Supports filtering by caterer, cuisine, category, subcategory, search, price range
 */
export const getAllDishesWithFilters = async (filters: DishFilters = {}) => {
  // Build where clause
  const where: any = {
    is_active: filters.is_active !== undefined ? filters.is_active : true, // Default to active dishes only
    caterer: {
      type: "CATERER",
      catererinfo: {
        status: "APPROVED",
      },
    },
  };

  // Filter by caterer_id
  if (filters.caterer_id) {
    where.caterer_id = filters.caterer_id;
  }

  // Filter by cuisine_type_id
  if (filters.cuisine_type_id) {
    where.cuisine_type_id = filters.cuisine_type_id;
  }

  // Filter by category_id
  if (filters.category_id) {
    where.category_id = filters.category_id;
  }

  // Filter by sub_category_id
  if (filters.sub_category_id) {
    where.sub_category_id = filters.sub_category_id;
  }

  // Filter by search (dish name)
  if (filters.search) {
    where.name = {
      contains: filters.search,
      mode: 'insensitive',
    };
  }

  // Filter by price range
  if (filters.min_price !== undefined || filters.max_price !== undefined) {
    where.price = {};
    if (filters.min_price !== undefined) {
      where.price.gte = filters.min_price;
    }
    if (filters.max_price !== undefined) {
      where.price.lte = filters.max_price;
    }
  }

  // Get dishes with all relations
  const dishes = await prisma.dish.findMany({
    where,
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

/**
 * Get all dishes grouped by category
 * Returns all categories, even if they have no dishes
 */
export const getAllDishesGroupedByCategory = async (filters: DishFilters = {}) => {
  // Get all categories first (to include empty categories)
  const allCategories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  // Build where clause (same as getAllDishesWithFilters)
  const where: any = {
    is_active: filters.is_active !== undefined ? filters.is_active : true,
    caterer: {
      type: "CATERER",
      catererinfo: {
        status: "APPROVED",
      },
    },
  };

  if (filters.caterer_id) {
    where.caterer_id = filters.caterer_id;
  }

  if (filters.cuisine_type_id) {
    where.cuisine_type_id = filters.cuisine_type_id;
  }

  if (filters.category_id) {
    where.category_id = filters.category_id;
  }

  if (filters.sub_category_id) {
    where.sub_category_id = filters.sub_category_id;
  }

  if (filters.search) {
    where.name = {
      contains: filters.search,
      mode: 'insensitive',
    };
  }

  if (filters.min_price !== undefined || filters.max_price !== undefined) {
    where.price = {};
    if (filters.min_price !== undefined) {
      where.price.gte = filters.min_price;
    }
    if (filters.max_price !== undefined) {
      where.price.lte = filters.max_price;
    }
  }

  // Get dishes
  const dishes = await prisma.dish.findMany({
    where,
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

  // Initialize grouped structure with all categories
  const groupedDishes: Array<{
    category: { id: string; name: string; description?: string | null; created_at?: string; updated_at?: string };
    dishes: any[];
  }> = allCategories.map((cat) => ({
    category: {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      created_at: cat.created_at.toISOString(),
      updated_at: cat.updated_at.toISOString(),
    },
    dishes: [] as any[],
  }));

  // Uncategorized group for dishes without a category
  const uncategorizedGroup: {
    category: { id: string; name: string; description: string };
    dishes: any[];
  } = {
    category: { id: 'uncategorized', name: 'Uncategorized', description: 'Dishes without a specific category' },
    dishes: [] as any[],
  };

  // Group dishes by category
  dishes.forEach((dish: any) => {
    const categoryId = dish.category?.id;
    const targetGroup = groupedDishes.find((group) => group.category.id === categoryId);
    
    const formattedDish = {
      id: dish.id,
      name: dish.name,
      image_url: dish.image_url,
      cuisine_type: {
        id: dish.cuisine_type.id,
        name: dish.cuisine_type.name,
        description: dish.cuisine_type.description,
      },
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
      quantity_in_gm: dish.quantity_in_gm,
      pieces: dish.pieces,
      price: Number(dish.price),
      currency: dish.currency,
      is_active: dish.is_active,
      free_forms: dish.free_forms.map((df: any) => ({
        id: df.freeform.id,
        name: df.freeform.name,
        description: df.freeform.description,
      })),
      created_at: dish.created_at,
      updated_at: dish.updated_at,
    };

    if (targetGroup) {
      targetGroup.dishes.push(formattedDish);
    } else {
      uncategorizedGroup.dishes.push(formattedDish);
    }
  });

  // Add uncategorized group if it has dishes
  if (uncategorizedGroup.dishes.length > 0) {
    groupedDishes.push(uncategorizedGroup);
  }

  return { categories: groupedDishes };
};

/**
 * Get dish by ID
 * Only returns dish if it's from an approved caterer
 */
export const getDishById = async (dishId: string) => {
  const dish = await prisma.dish.findFirst({
    where: {
      id: dishId,
      is_active: true,
      caterer: {
        type: "CATERER",
        catererinfo: {
          status: "APPROVED",
        },
      },
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
  });

  if (!dish) {
    throw new Error("Dish not found or not available");
  }

  // Format the response
  return {
    id: dish.id,
    name: dish.name,
    image_url: dish.image_url,
    cuisine_type: {
      id: dish.cuisine_type.id,
      name: dish.cuisine_type.name,
      description: dish.cuisine_type.description,
    },
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
  };
};

