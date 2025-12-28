"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDish = exports.updateDish = exports.createDish = exports.getDishById = exports.getDishesByCatererId = void 0;
const prisma_1 = __importDefault(require("../../../lib/prisma"));
/**
 * Get all dishes by caterer ID with optional filters
 */
const getDishesByCatererId = async (catererId, filters) => {
    const where = {
        caterer_id: catererId,
    };
    if (filters?.cuisine_type_id) {
        where.cuisine_type_id = filters.cuisine_type_id;
    }
    if (filters?.category_id) {
        where.category_id = filters.category_id;
    }
    const dishes = await prisma_1.default.dish.findMany({
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
exports.getDishesByCatererId = getDishesByCatererId;
/**
 * Get dish by ID and verify it belongs to the caterer
 */
const getDishById = async (dishId, catererId) => {
    const dish = await prisma_1.default.dish.findFirst({
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
exports.getDishById = getDishById;
/**
 * Create a new dish for a caterer
 */
const createDish = async (catererId, data) => {
    // Verify caterer exists and is a CATERER type
    const caterer = await prisma_1.default.user.findUnique({
        where: { id: catererId },
    });
    if (!caterer || caterer.type !== "CATERER") {
        throw new Error("Invalid caterer");
    }
    // Look up cuisine type by name
    const cuisineType = await prisma_1.default.cuisineType.findUnique({
        where: { name: data.cuisine_type },
    });
    if (!cuisineType) {
        throw new Error(`Cuisine type "${data.cuisine_type}" not found`);
    }
    // Look up category by name
    const category = await prisma_1.default.category.findUnique({
        where: { name: data.category },
    });
    if (!category) {
        throw new Error(`Category "${data.category}" not found`);
    }
    // Look up sub category by name and category_id (since subcategory names are unique per category)
    const subCategory = await prisma_1.default.subCategory.findFirst({
        where: {
            name: data.sub_category,
            category_id: category.id,
        },
    });
    if (!subCategory) {
        throw new Error(`Sub category "${data.sub_category}" not found for category "${data.category}"`);
    }
    const dish = await prisma_1.default.dish.create({
        data: {
            name: data.name,
            image_url: data.image_url,
            cuisine_type_id: cuisineType.id,
            category_id: category.id,
            sub_category_id: subCategory.id,
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
exports.createDish = createDish;
/**
 * Update a dish (only if it belongs to the caterer)
 */
const updateDish = async (dishId, catererId, data) => {
    // Verify dish exists and belongs to caterer
    const existingDish = await prisma_1.default.dish.findFirst({
        where: {
            id: dishId,
            caterer_id: catererId,
        },
    });
    if (!existingDish) {
        throw new Error("Dish not found or you don't have permission to update it");
    }
    // Prepare update data
    const updateData = {
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
        const cuisineType = await prisma_1.default.cuisineType.findUnique({
            where: { name: data.cuisine_type },
        });
        if (!cuisineType) {
            throw new Error(`Cuisine type "${data.cuisine_type}" not found`);
        }
        updateData.cuisine_type_id = cuisineType.id;
    }
    // Look up and update category if provided
    if (data.category) {
        const category = await prisma_1.default.category.findUnique({
            where: { name: data.category },
        });
        if (!category) {
            throw new Error(`Category "${data.category}" not found`);
        }
        updateData.category_id = category.id;
        // If sub_category is also provided, look it up with the category
        if (data.sub_category) {
            const subCategory = await prisma_1.default.subCategory.findFirst({
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
    }
    else if (data.sub_category) {
        // If only sub_category is provided, use existing category
        const subCategory = await prisma_1.default.subCategory.findFirst({
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
    const dish = await prisma_1.default.dish.update({
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
exports.updateDish = updateDish;
/**
 * Delete a dish (only if it belongs to the caterer)
 */
const deleteDish = async (dishId, catererId) => {
    // Verify dish exists and belongs to caterer
    const existingDish = await prisma_1.default.dish.findFirst({
        where: {
            id: dishId,
            caterer_id: catererId,
        },
    });
    if (!existingDish) {
        throw new Error("Dish not found or you don't have permission to delete it");
    }
    // Check if dish is used in any packages
    const packageItems = await prisma_1.default.packageItem.findFirst({
        where: { dish_id: dishId },
    });
    if (packageItems) {
        throw new Error("Cannot delete dish. It is being used in one or more packages");
    }
    await prisma_1.default.dish.delete({
        where: { id: dishId },
    });
    return { message: "Dish deleted successfully" };
};
exports.deleteDish = deleteDish;
