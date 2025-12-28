"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDish = exports.updateDish = exports.createDish = exports.getDishById = exports.getDishes = void 0;
const dishesService = __importStar(require("./dishes.services"));
const cloudinary_1 = require("../../../lib/cloudinary");
const prisma_1 = __importDefault(require("../../../lib/prisma"));
/**
 * Get all dishes by caterer ID
 * GET /api/caterer/dishes
 */
const getDishes = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        // Get query parameters for filters
        const cuisine_type_id = req.query.cuisine_type_id;
        const category_id = req.query.category_id;
        const dishes = await dishesService.getDishesByCatererId(catererId, {
            cuisine_type_id,
            category_id,
        });
        res.status(200).json({
            success: true,
            data: dishes,
        });
    }
    catch (error) {
        const statusCode = error.message?.includes("not found") ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            error: {
                message: error.message || "An error occurred",
            },
        });
    }
};
exports.getDishes = getDishes;
/**
 * Get dish by ID
 * GET /api/caterer/dishes/:id
 */
const getDishById = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        const dishId = req.params.id;
        const dish = await dishesService.getDishById(dishId, catererId);
        res.status(200).json({
            success: true,
            data: dish,
        });
    }
    catch (error) {
        res.status(error.message?.includes("not found") ? 404 : 400).json({
            success: false,
            error: {
                message: error.message || "An error occurred",
            },
        });
    }
};
exports.getDishById = getDishById;
/**
 * Create a new dish
 * POST /api/caterer/dishes
 */
const createDish = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        // Handle image upload if provided
        let image_url = req.body.image_url; // Fallback to URL if provided
        if (req.file) {
            try {
                image_url = await (0, cloudinary_1.uploadToCloudinary)(req.file, 'partyfud/dishes');
            }
            catch (uploadError) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: `Image upload failed: ${uploadError.message}`,
                    },
                });
                return;
            }
        }
        const { name, cuisine_type_id, category_id, sub_category_id, quantity_in_gm, pieces, price, currency, is_active, } = req.body;
        // Convert FormData string values to proper types
        // FormData sends all values as strings, so we need to parse them
        const parsedQuantityInGm = quantity_in_gm
            ? (typeof quantity_in_gm === 'string' ? parseInt(quantity_in_gm, 10) : quantity_in_gm)
            : undefined;
        const parsedPieces = pieces
            ? (typeof pieces === 'string' ? parseInt(pieces, 10) : pieces)
            : 1;
        const parsedPrice = typeof price === 'string'
            ? parseFloat(price)
            : (typeof price === 'number' ? price : 0);
        const parsedIsActive = typeof is_active === 'string'
            ? is_active === 'true' || is_active === '1'
            : (typeof is_active === 'boolean' ? is_active : true);
        // Validate required fields
        if (!name || !cuisine_type_id || !category_id || !parsedPrice) {
            res.status(400).json({
                success: false,
                error: {
                    message: "Missing required fields: name, cuisine_type_id, category_id, price",
                },
            });
            return;
        }
        // Look up names from IDs
        const cuisineType = await prisma_1.default.cuisineType.findUnique({
            where: { id: cuisine_type_id },
        });
        if (!cuisineType) {
            res.status(400).json({
                success: false,
                error: { message: `Cuisine type with ID "${cuisine_type_id}" not found` },
            });
            return;
        }
        const category = await prisma_1.default.category.findUnique({
            where: { id: category_id },
        });
        if (!category) {
            res.status(400).json({
                success: false,
                error: { message: `Category with ID "${category_id}" not found` },
            });
            return;
        }
        // Check if category has subcategories
        const subCategoriesCount = await prisma_1.default.subCategory.count({
            where: { category_id: category_id },
        });
        const hasSubCategories = subCategoriesCount > 0;
        // Validate subcategory only if category has subcategories
        if (hasSubCategories && !sub_category_id) {
            res.status(400).json({
                success: false,
                error: {
                    message: "Sub category is required for this category. Please select a sub-category.",
                },
            });
            return;
        }
        let subCategory = null;
        if (sub_category_id) {
            subCategory = await prisma_1.default.subCategory.findUnique({
                where: { id: sub_category_id },
            });
            if (!subCategory) {
                res.status(400).json({
                    success: false,
                    error: { message: `Sub category with ID "${sub_category_id}" not found` },
                });
                return;
            }
            // Verify subcategory belongs to the selected category
            if (subCategory.category_id !== category_id) {
                res.status(400).json({
                    success: false,
                    error: { message: `Sub category does not belong to the selected category` },
                });
                return;
            }
        }
        else if (hasSubCategories) {
            // Category has subcategories but none was provided
            res.status(400).json({
                success: false,
                error: {
                    message: "Sub category is required for this category. Please select a sub-category.",
                },
            });
            return;
        }
        // Note: Schema requires sub_category_id, so if category has no subcategories,
        // we cannot create a dish. Categories without subcategories would need:
        // 1. A default "General" subcategory created in seed, OR
        // 2. Schema migration to make sub_category_id nullable
        // For now, we require sub_category_id for all categories
        if (!subCategory) {
            res.status(400).json({
                success: false,
                error: {
                    message: "This category requires a sub-category. Please ensure the category has subcategories defined.",
                },
            });
            return;
        }
        // Parse freeform_ids if provided (can be string or array)
        // FormData sends multiple values with the same key as an array
        let freeformIdsArray;
        // Check if freeform_ids exists in body (could be array or single value)
        const freeformIdsValue = req.body.freeform_ids;
        if (freeformIdsValue) {
            if (Array.isArray(freeformIdsValue)) {
                freeformIdsArray = freeformIdsValue.filter(id => id && typeof id === 'string');
            }
            else if (typeof freeformIdsValue === 'string') {
                // Handle comma-separated string or single value
                freeformIdsArray = freeformIdsValue.split(',').map(id => id.trim()).filter(id => id);
            }
        }
        const dish = await dishesService.createDish(catererId, {
            name,
            image_url,
            cuisine_type: cuisineType.name,
            category: category.name,
            sub_category: subCategory.name,
            quantity_in_gm: parsedQuantityInGm,
            pieces: parsedPieces,
            price: parsedPrice,
            currency: currency || 'AED',
            is_active: parsedIsActive,
            freeform_ids: freeformIdsArray,
        });
        res.status(201).json({
            success: true,
            data: dish,
        });
    }
    catch (error) {
        res.status(error.message?.includes("not found") ? 404 : 400).json({
            success: false,
            error: {
                message: error.message || "An error occurred",
            },
        });
    }
};
exports.createDish = createDish;
/**
 * Update a dish
 * PUT /api/caterer/dishes/:id
 */
const updateDish = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        const dishId = req.params.id;
        // Handle image upload if provided
        let image_url = req.body.image_url; // Fallback to URL if provided
        if (req.file) {
            try {
                image_url = await (0, cloudinary_1.uploadToCloudinary)(req.file, 'partyfud/dishes');
            }
            catch (uploadError) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: `Image upload failed: ${uploadError.message}`,
                    },
                });
                return;
            }
        }
        const { name, cuisine_type_id, category_id, sub_category_id, quantity_in_gm, pieces, price, currency, is_active, } = req.body;
        // Convert FormData string values to proper types (if provided)
        // FormData sends all values as strings, so we need to parse them
        const parsedQuantityInGm = quantity_in_gm !== undefined
            ? (typeof quantity_in_gm === 'string' ? parseInt(quantity_in_gm, 10) : quantity_in_gm)
            : undefined;
        const parsedPieces = pieces !== undefined
            ? (typeof pieces === 'string' ? parseInt(pieces, 10) : pieces)
            : undefined;
        const parsedPrice = price !== undefined
            ? (typeof price === 'string' ? parseFloat(price) : price)
            : undefined;
        const parsedIsActive = is_active !== undefined
            ? (typeof is_active === 'string'
                ? is_active === 'true' || is_active === '1'
                : is_active)
            : undefined;
        // Prepare update data
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (image_url !== undefined)
            updateData.image_url = image_url;
        if (parsedQuantityInGm !== undefined)
            updateData.quantity_in_gm = parsedQuantityInGm;
        if (parsedPieces !== undefined)
            updateData.pieces = parsedPieces;
        if (parsedPrice !== undefined)
            updateData.price = parsedPrice;
        if (currency !== undefined)
            updateData.currency = currency;
        if (parsedIsActive !== undefined)
            updateData.is_active = parsedIsActive;
        // Look up names from IDs if provided
        if (cuisine_type_id) {
            const cuisineType = await prisma_1.default.cuisineType.findUnique({
                where: { id: cuisine_type_id },
            });
            if (!cuisineType) {
                res.status(400).json({
                    success: false,
                    error: { message: `Cuisine type with ID "${cuisine_type_id}" not found` },
                });
                return;
            }
            updateData.cuisine_type = cuisineType.name;
        }
        if (category_id) {
            const category = await prisma_1.default.category.findUnique({
                where: { id: category_id },
            });
            if (!category) {
                res.status(400).json({
                    success: false,
                    error: { message: `Category with ID "${category_id}" not found` },
                });
                return;
            }
            updateData.category = category.name;
            // If sub_category_id is also provided, look it up
            if (sub_category_id) {
                const subCategory = await prisma_1.default.subCategory.findUnique({
                    where: { id: sub_category_id },
                });
                if (!subCategory) {
                    res.status(400).json({
                        success: false,
                        error: { message: `Sub category with ID "${sub_category_id}" not found` },
                    });
                    return;
                }
                updateData.sub_category = subCategory.name;
            }
        }
        else if (sub_category_id) {
            // If only sub_category_id is provided, we need the existing category
            const existingDish = await prisma_1.default.dish.findUnique({
                where: { id: dishId },
                select: { category_id: true },
            });
            if (existingDish) {
                const subCategory = await prisma_1.default.subCategory.findUnique({
                    where: { id: sub_category_id },
                });
                if (!subCategory) {
                    res.status(400).json({
                        success: false,
                        error: { message: `Sub category with ID "${sub_category_id}" not found` },
                    });
                    return;
                }
                updateData.sub_category = subCategory.name;
            }
        }
        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        const dish = await dishesService.updateDish(dishId, catererId, updateData);
        res.status(200).json({
            success: true,
            data: dish,
        });
    }
    catch (error) {
        res.status(error.message?.includes("not found") ? 404 : 400).json({
            success: false,
            error: {
                message: error.message || "An error occurred",
            },
        });
    }
};
exports.updateDish = updateDish;
/**
 * Delete a dish
 * DELETE /api/caterer/dishes/:id
 */
const deleteDish = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        const dishId = req.params.id;
        await dishesService.deleteDish(dishId, catererId);
        res.status(200).json({
            success: true,
            message: "Dish deleted successfully",
        });
    }
    catch (error) {
        res.status(error.message?.includes("not found") ? 404 : 400).json({
            success: false,
            error: {
                message: error.message || "An error occurred",
            },
        });
    }
};
exports.deleteDish = deleteDish;
