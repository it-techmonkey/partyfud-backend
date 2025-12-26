"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackage = exports.createPackage = exports.getPackageById = exports.getPackagesByCatererId = exports.deleteDish = exports.updateDish = exports.createDish = exports.getDishById = exports.getDishesByCatererId = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
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
    // Verify related entities exist
    const [cuisineType, category, subCategory] = await Promise.all([
        prisma_1.default.cuisineType.findUnique({ where: { id: data.cuisine_type_id } }),
        prisma_1.default.category.findUnique({ where: { id: data.category_id } }),
        prisma_1.default.subCategory.findUnique({ where: { id: data.sub_category_id } }),
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
    const dish = await prisma_1.default.dish.create({
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
    // Verify related entities if they're being updated
    if (data.cuisine_type_id) {
        const cuisineType = await prisma_1.default.cuisineType.findUnique({
            where: { id: data.cuisine_type_id },
        });
        if (!cuisineType) {
            throw new Error("Invalid cuisine type");
        }
    }
    if (data.category_id) {
        const category = await prisma_1.default.category.findUnique({
            where: { id: data.category_id },
        });
        if (!category) {
            throw new Error("Invalid category");
        }
    }
    if (data.sub_category_id) {
        const subCategory = await prisma_1.default.subCategory.findUnique({
            where: { id: data.sub_category_id },
        });
        if (!subCategory) {
            throw new Error("Invalid sub category");
        }
    }
    const dish = await prisma_1.default.dish.update({
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
/**
 * Get all packages by caterer ID
 */
const getPackagesByCatererId = async (catererId) => {
    const packages = await prisma_1.default.package.findMany({
        where: {
            caterer_id: catererId,
        },
        include: {
            package_type: true,
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
        orderBy: {
            created_at: "desc",
        },
    });
    return packages;
};
exports.getPackagesByCatererId = getPackagesByCatererId;
/**
 * Get package by ID and verify it belongs to the caterer
 */
const getPackageById = async (packageId, catererId) => {
    const packageData = await prisma_1.default.package.findFirst({
        where: {
            id: packageId,
            caterer_id: catererId,
        },
        include: {
            package_type: true,
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
exports.getPackageById = getPackageById;
/**
 * Create a new package for a caterer
 */
const createPackage = async (catererId, data) => {
    // Verify caterer exists and is a CATERER type
    const caterer = await prisma_1.default.user.findUnique({
        where: { id: catererId },
    });
    if (!caterer || caterer.type !== "CATERER") {
        throw new Error("Invalid caterer");
    }
    // Verify package type exists
    const packageType = await prisma_1.default.packageType.findUnique({
        where: { id: data.package_type_id },
    });
    if (!packageType) {
        throw new Error("Invalid package type");
    }
    const packageData = await prisma_1.default.package.create({
        data: {
            ...data,
            caterer_id: catererId,
            currency: data.currency || "AED",
            is_active: data.is_active ?? true,
            is_available: data.is_available ?? true,
        },
        include: {
            package_type: true,
            items: true,
            category_selections: true,
            occasions: true,
        },
    });
    return packageData;
};
exports.createPackage = createPackage;
/**
 * Update a package (only if it belongs to the caterer)
 */
const updatePackage = async (packageId, catererId, data) => {
    // Verify package exists and belongs to caterer
    const existingPackage = await prisma_1.default.package.findFirst({
        where: {
            id: packageId,
            caterer_id: catererId,
        },
    });
    if (!existingPackage) {
        throw new Error("Package not found or you don't have permission to update it");
    }
    // Verify package type if it's being updated
    if (data.package_type_id) {
        const packageType = await prisma_1.default.packageType.findUnique({
            where: { id: data.package_type_id },
        });
        if (!packageType) {
            throw new Error("Invalid package type");
        }
    }
    const packageData = await prisma_1.default.package.update({
        where: { id: packageId },
        data,
        include: {
            package_type: true,
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
    return packageData;
};
exports.updatePackage = updatePackage;
