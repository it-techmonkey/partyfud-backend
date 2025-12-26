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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackage = exports.createPackage = exports.getPackageById = exports.getPackages = exports.deleteDish = exports.updateDish = exports.createDish = exports.getDishById = exports.getDishes = void 0;
const catererService = __importStar(require("./caterer.services"));
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
        const dishes = await catererService.getDishesByCatererId(catererId, {
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
        const dish = await catererService.getDishById(dishId, catererId);
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
        const { name, image_url, cuisine_type_id, category_id, sub_category_id, quantity_in_gm, pieces, price, currency, is_active, } = req.body;
        // Validate required fields
        if (!name || !cuisine_type_id || !category_id || !sub_category_id || !price) {
            res.status(400).json({
                success: false,
                error: {
                    message: "Missing required fields: name, cuisine_type_id, category_id, sub_category_id, price",
                },
            });
            return;
        }
        const dish = await catererService.createDish(catererId, {
            name,
            image_url,
            cuisine_type_id,
            category_id,
            sub_category_id,
            quantity_in_gm,
            pieces,
            price,
            currency,
            is_active,
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
        const { name, image_url, cuisine_type_id, category_id, sub_category_id, quantity_in_gm, pieces, price, currency, is_active, } = req.body;
        const dish = await catererService.updateDish(dishId, catererId, {
            name,
            image_url,
            cuisine_type_id,
            category_id,
            sub_category_id,
            quantity_in_gm,
            pieces,
            price,
            currency,
            is_active,
        });
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
        await catererService.deleteDish(dishId, catererId);
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
/**
 * Get all packages by caterer ID
 * GET /api/caterer/packages
 */
const getPackages = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        const packages = await catererService.getPackagesByCatererId(catererId);
        res.status(200).json({
            success: true,
            data: packages,
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
exports.getPackages = getPackages;
/**
 * Get package by ID
 * GET /api/caterer/packages/:id
 */
const getPackageById = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        const packageId = req.params.id;
        const packageData = await catererService.getPackageById(packageId, catererId);
        res.status(200).json({
            success: true,
            data: packageData,
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
exports.getPackageById = getPackageById;
/**
 * Create a new package
 * POST /api/caterer/packages
 */
const createPackage = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        const { name, people_count, package_type_id, cover_image_url, total_price, currency, rating, is_active, is_available, } = req.body;
        // Validate required fields
        if (!name || !people_count || !package_type_id || !total_price) {
            res.status(400).json({
                success: false,
                error: {
                    message: "Missing required fields: name, people_count, package_type_id, total_price",
                },
            });
            return;
        }
        const packageData = await catererService.createPackage(catererId, {
            name,
            people_count,
            package_type_id,
            cover_image_url,
            total_price,
            currency,
            rating,
            is_active,
            is_available,
        });
        res.status(201).json({
            success: true,
            data: packageData,
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
exports.createPackage = createPackage;
/**
 * Update a package
 * PUT /api/caterer/packages/:id
 */
const updatePackage = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        const packageId = req.params.id;
        const { name, people_count, package_type_id, cover_image_url, total_price, currency, rating, is_active, is_available, } = req.body;
        const packageData = await catererService.updatePackage(packageId, catererId, {
            name,
            people_count,
            package_type_id,
            cover_image_url,
            total_price,
            currency,
            rating,
            is_active,
            is_available,
        });
        res.status(200).json({
            success: true,
            data: packageData,
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
exports.updatePackage = updatePackage;
