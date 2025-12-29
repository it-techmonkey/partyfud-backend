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
exports.updatePackage = exports.createPackage = exports.getPackageById = exports.getPackages = void 0;
const packagesService = __importStar(require("./packages.services"));
const cloudinary_1 = require("../../../lib/cloudinary");
/**
 * Get all packages by caterer ID
 * GET /api/caterer/packages
 */
const getPackages = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        const packages = await packagesService.getPackagesByCatererId(catererId);
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
    console.log("🔴 [GET PACKAGE BY ID] API hit - This should NOT be called for /packages/items");
    console.log("🔴 [GET PACKAGE BY ID] Request URL:", req.url);
    console.log("🔴 [GET PACKAGE BY ID] Request path:", req.path);
    console.log("🔴 [GET PACKAGE BY ID] Params:", req.params);
    try {
        const user = req.user;
        const catererId = user.userId;
        const packageId = req.params.id;
        console.log("🔴 [GET PACKAGE BY ID] packageId from params:", packageId);
        console.log("🔴 [GET PACKAGE BY ID] catererId:", catererId);
        const packageData = await packagesService.getPackageById(packageId, catererId);
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
        // Handle image upload if provided
        let cover_image_url = req.body.cover_image_url; // Fallback to URL if provided
        if (req.file) {
            try {
                cover_image_url = await (0, cloudinary_1.uploadToCloudinary)(req.file, 'partyfud/packages');
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
        const { name, people_count, package_type_id, total_price, currency, rating, is_active, is_available, package_item_ids, // Array of package item IDs to link
         } = req.body;
        // Convert FormData string values to proper types
        const parsedPeopleCount = typeof people_count === 'string'
            ? parseInt(people_count, 10)
            : (typeof people_count === 'number' ? people_count : 0);
        const parsedTotalPrice = typeof total_price === 'string'
            ? parseFloat(total_price)
            : (typeof total_price === 'number' ? total_price : 0);
        const parsedRating = rating !== undefined
            ? (typeof rating === 'string' ? parseFloat(rating) : rating)
            : undefined;
        const parsedIsActive = is_active !== undefined
            ? (typeof is_active === 'string'
                ? is_active === 'true' || is_active === '1'
                : is_active)
            : undefined;
        const parsedIsAvailable = is_available !== undefined
            ? (typeof is_available === 'string'
                ? is_available === 'true' || is_available === '1'
                : is_available)
            : undefined;
        // Parse package_item_ids (can be string or array from FormData)
        let parsedPackageItemIds;
        if (package_item_ids) {
            if (Array.isArray(package_item_ids)) {
                parsedPackageItemIds = package_item_ids.filter(id => id && typeof id === 'string');
            }
            else if (typeof package_item_ids === 'string') {
                // Handle comma-separated string
                parsedPackageItemIds = package_item_ids.split(',').map(id => id.trim()).filter(id => id);
            }
        }
        // Validate required fields
        if (!name || !parsedPeopleCount || !package_type_id || !parsedTotalPrice) {
            res.status(400).json({
                success: false,
                error: {
                    message: "Missing required fields: name, people_count, package_type_id, total_price",
                },
            });
            return;
        }
        const packageData = await packagesService.createPackage(catererId, {
            name,
            people_count: parsedPeopleCount,
            package_type_id,
            cover_image_url,
            total_price: parsedTotalPrice,
            currency,
            rating: parsedRating,
            is_active: parsedIsActive,
            is_available: parsedIsAvailable,
            package_item_ids: parsedPackageItemIds, // Pass item IDs to link
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
        // Handle image upload if provided
        let cover_image_url = req.body.cover_image_url; // Fallback to URL if provided
        if (req.file) {
            try {
                cover_image_url = await (0, cloudinary_1.uploadToCloudinary)(req.file, 'partyfud/packages');
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
        const { name, people_count, package_type_id, total_price, currency, rating, is_active, is_available, } = req.body;
        const packageData = await packagesService.updatePackage(packageId, catererId, {
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
