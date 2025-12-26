import prisma from "../../../lib/prisma";

export interface CreateDishData {
  name: string;
  image_url?: string;
  cuisine_type_id: string;
  category_id: string;
  sub_category_id: string;
  quantity_in_gm?: number;
  pieces?: number;
  price: number;
  currency?: string;
  is_active?: boolean;
}

export interface UpdateDishData {
  name?: string;
  image_url?: string;
  cuisine_type_id?: string;
  category_id?: string;
  sub_category_id?: string;
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

  // Verify related entities exist
  const [cuisineType, category, subCategory] = await Promise.all([
    prisma.cuisineType.findUnique({ where: { id: data.cuisine_type_id } }),
    prisma.category.findUnique({ where: { id: data.category_id } }),
    prisma.subCategory.findUnique({ where: { id: data.sub_category_id } }),
  ]);

  if (!cuisineType) {
    throw new Error("Invalid cuisine type");
  }
  if (!category) {
    throw new Error("Invalid category");
  }
  if (!subCategory) {
    throw new Error("Invalid sub category");
  }

  const dish = await prisma.dish.create({
    data: {
      ...data,
      caterer_id: catererId,
      currency: data.currency || "AED",
      pieces: data.pieces ?? 1,
      is_active: data.is_active ?? true,
    },
    include: {
      cuisine_type: true,
      category: true,
      sub_category: true,
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

  // Verify related entities if they're being updated
  if (data.cuisine_type_id) {
    const cuisineType = await prisma.cuisineType.findUnique({
      where: { id: data.cuisine_type_id },
    });
    if (!cuisineType) {
      throw new Error("Invalid cuisine type");
    }
  }

  if (data.category_id) {
    const category = await prisma.category.findUnique({
      where: { id: data.category_id },
    });
    if (!category) {
      throw new Error("Invalid category");
    }
  }

  if (data.sub_category_id) {
    const subCategory = await prisma.subCategory.findUnique({
      where: { id: data.sub_category_id },
    });
    if (!subCategory) {
      throw new Error("Invalid sub category");
    }
  }

  const dish = await prisma.dish.update({
    where: { id: dishId },
    data,
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

