import prisma from "../../../lib/prisma";

export interface CreateDishData {
  name: string;
  image_url?: string;
  cuisine_type: string; // Changed from cuisine_type_id to cuisine_type (name)
  category?: string; // Changed from category_id to category (name) - now optional
  sub_category?: string; // Changed from sub_category_id to sub_category (name) - now optional
  quantity_in_gm?: number;
  pieces?: number;
  price: number;
  currency?: string;
  is_active?: boolean;
  freeform_ids?: string[]; // Array of FreeForm IDs
}

export interface UpdateDishData {
  name?: string;
  image_url?: string;
  cuisine_type?: string; // Changed from cuisine_type_id to cuisine_type (name)
  category?: string; // Changed from category_id to category (name)
  sub_category?: string; // Changed from sub_category_id to sub_category (name)
  quantity_in_gm?: number;
  pieces?: number;
  price?: number;
  currency?: string;
  is_active?: boolean;
}

/**
 * Get all dishes by caterer ID with optional filters
 */
export const getDishesByCatererId = async (
  catererId: string,
  filters?: {
    cuisine_type_id?: string;
    category_id?: string;
  }
) => {
  const where: any = {
    caterer_id: catererId,
  };

  if (filters?.cuisine_type_id) {
    where.cuisine_type_id = filters.cuisine_type_id;
  }

  if (filters?.category_id) {
    where.category_id = filters.category_id;
  }

  const dishes = await prisma.dish.findMany({
    where,
    include: {
      cuisine_type: true,
      category: true,
      sub_category: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return dishes;
};

/**
 * Get all dishes by caterer ID grouped by category
 * Returns all categories, even if they have no dishes
 */
export const getDishesByCatererIdGrouped = async (
  catererId: string,
  filters?: {
    cuisine_type_id?: string;
    category_id?: string;
  }
) => {
  // Get all categories first (to include empty categories)
  const allCategories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Build where clause for dishes
  const where: any = {
    caterer_id: catererId,
  };

  if (filters?.cuisine_type_id) {
    where.cuisine_type_id = filters.cuisine_type_id;
  }

  if (filters?.category_id) {
    where.category_id = filters.category_id;
  }

  // Get all dishes for this caterer
  const dishes = await prisma.dish.findMany({
    where,
    include: {
      cuisine_type: true,
      category: true,
      sub_category: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  // Group dishes by category_id
  const dishesByCategory = new Map<string, any[]>();
  const uncategorizedDishes: any[] = [];

  dishes.forEach((dish: any) => {
    const categoryId = dish.category_id;
    if (categoryId) {
      if (!dishesByCategory.has(categoryId)) {
        dishesByCategory.set(categoryId, []);
      }
      dishesByCategory.get(categoryId)!.push(dish);
    } else {
      uncategorizedDishes.push(dish);
    }
  });

  // Build response structure with all categories
  const categoriesWithDishes = allCategories.map((category) => {
    const categoryDishes = dishesByCategory.get(category.id) || [];
    return {
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        created_at: category.created_at,
        updated_at: category.updated_at,
      },
      dishes: categoryDishes,
    };
  });

  // Add uncategorized dishes if any exist
  if (uncategorizedDishes.length > 0) {
    categoriesWithDishes.push({
      category: {
        id: 'uncategorized',
        name: 'Uncategorized',
        description: 'Dishes without a valid category',
        created_at: new Date(),
        updated_at: new Date(),
      },
      dishes: uncategorizedDishes,
    });
  }

  return { categories: categoriesWithDishes };
};

/**
 * Get dish by ID and verify it belongs to the caterer
 */
export const getDishById = async (dishId: string, catererId: string) => {
  const dish = await prisma.dish.findFirst({
    where: {
      id: dishId,
      caterer_id: catererId,
    },
    include: {
      cuisine_type: true,
      category: true,
      sub_category: true,
    },
  });

  if (!dish) {
    throw new Error("Dish not found or you don't have permission to access it");
  }

  return dish;
};

/**
 * Create a new dish for a caterer
 */
export const createDish = async (catererId: string, data: CreateDishData) => {
  // Verify caterer exists and is a CATERER type
  const caterer = await prisma.user.findUnique({
    where: { id: catererId },
  });

  if (!caterer || caterer.type !== "CATERER") {
    throw new Error("Invalid caterer");
  }

  // Look up cuisine type by name
  const cuisineType = await prisma.cuisineType.findUnique({
    where: { name: data.cuisine_type },
  });

  if (!cuisineType) {
    throw new Error(`Cuisine type "${data.cuisine_type}" not found`);
  }

  // Look up category by name (optional)
  let category = null;
  if (data.category) {
    category = await prisma.category.findUnique({
      where: { name: data.category },
    });

    if (!category) {
      throw new Error(`Category "${data.category}" not found`);
    }
  }

  // Look up sub category by name and category_id (since subcategory names are unique per category)
  // Only if sub_category is provided
  let subCategory = null;
  if (data.sub_category) {
    if (!category) {
      throw new Error(`Sub category requires a category to be selected`);
    }
    subCategory = await prisma.subCategory.findFirst({
      where: {
        name: data.sub_category,
        category_id: category.id,
      },
    });

    if (!subCategory) {
      throw new Error(`Sub category "${data.sub_category}" not found for category "${data.category}"`);
    }
  }

  const dish = await prisma.dish.create({
    data: {
      name: data.name,
      image_url: data.image_url,
      cuisine_type_id: cuisineType.id,
      category_id: category?.id || null, // Allow null if category is not provided
      sub_category_id: subCategory?.id || null, // Allow null if category has no subcategories
      caterer_id: catererId,
      quantity_in_gm: data.quantity_in_gm,
      pieces: data.pieces ?? 1,
      price: data.price,
      currency: data.currency || "AED",
      is_active: data.is_active ?? true,
      free_forms: data.freeform_ids && data.freeform_ids.length > 0 ? {
        create: data.freeform_ids.map(freeformId => ({
          freeform_id: freeformId,
        })),
      } : undefined,
    },
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
  });

  return dish;
};

/**
 * Update a dish (only if it belongs to the caterer)
 */
export const updateDish = async (
  dishId: string,
  catererId: string,
  data: UpdateDishData
) => {
  // Verify dish exists and belongs to caterer
  const existingDish = await prisma.dish.findFirst({
    where: {
      id: dishId,
      caterer_id: catererId,
    },
  });

  if (!existingDish) {
    throw new Error("Dish not found or you don't have permission to update it");
  }

  // Prepare update data
  const updateData: any = {
    name: data.name,
    image_url: data.image_url,
    quantity_in_gm: data.quantity_in_gm,
    pieces: data.pieces,
    price: data.price,
    currency: data.currency,
    is_active: data.is_active,
  };

  // Look up and update cuisine type if provided
  if (data.cuisine_type) {
    const cuisineType = await prisma.cuisineType.findUnique({
      where: { name: data.cuisine_type },
    });
    if (!cuisineType) {
      throw new Error(`Cuisine type "${data.cuisine_type}" not found`);
    }
    updateData.cuisine_type_id = cuisineType.id;
  }

  // Look up and update category if provided
  if (data.category) {
    const category = await prisma.category.findUnique({
      where: { name: data.category },
    });
    if (!category) {
      throw new Error(`Category "${data.category}" not found`);
    }
    updateData.category_id = category.id;

    // If sub_category is also provided, look it up with the category
    if (data.sub_category) {
      const subCategory = await prisma.subCategory.findFirst({
        where: {
          name: data.sub_category,
          category_id: category.id,
        },
      });
      if (!subCategory) {
        throw new Error(`Sub category "${data.sub_category}" not found for category "${data.category}"`);
      }
      updateData.sub_category_id = subCategory.id;
    }
  } else if (data.sub_category) {
    // If only sub_category is provided, use existing category
    if (!existingDish.category_id) {
      throw new Error(`Sub category requires a category to be selected. The dish does not have a category.`);
    }
    const subCategory = await prisma.subCategory.findFirst({
      where: {
        name: data.sub_category,
        category_id: existingDish.category_id,
      },
    });
    if (!subCategory) {
      throw new Error(`Sub category "${data.sub_category}" not found for the dish's current category`);
    }
    updateData.sub_category_id = subCategory.id;
  }

  // Remove undefined values
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  const dish = await prisma.dish.update({
    where: { id: dishId },
    data: updateData,
    include: {
      cuisine_type: true,
      category: true,
      sub_category: true,
    },
  });

  return dish;
};

/**
 * Delete a dish (only if it belongs to the caterer)
 */
export const deleteDish = async (dishId: string, catererId: string) => {
  // Verify dish exists and belongs to caterer
  const existingDish = await prisma.dish.findFirst({
    where: {
      id: dishId,
      caterer_id: catererId,
    },
  });

  if (!existingDish) {
    throw new Error("Dish not found or you don't have permission to delete it");
  }

  // Check if dish is used in any packages
  const packageItems = await prisma.packageItem.findFirst({
    where: { dish_id: dishId },
  });

  if (packageItems) {
    throw new Error(
      "Cannot delete dish. It is being used in one or more packages"
    );
  }

  await prisma.dish.delete({
    where: { id: dishId },
  });

  return { message: "Dish deleted successfully" };
};

