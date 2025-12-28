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
exports.linkPackageItemsToPackage = exports.deletePackageItem = exports.updatePackageItem = exports.getPackageItemById = exports.getPackageItems = exports.createPackageItem = void 0;
const packageItemsService = __importStar(require("./package-items.services"));
/**
 * Create a new package item
 * POST /api/caterer/packages/items
 */
const createPackageItem = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        const { dish_id, people_count, quantity, price_at_time, is_optional, is_addon, package_id, // Optional - can be null for draft items
         } = req.body;
        // Convert FormData string values to proper types
        const parsedPeopleCount = typeof people_count === 'string'
            ? parseInt(people_count, 10)
            : (typeof people_count === 'number' ? people_count : 0);
        const parsedQuantity = quantity !== undefined
            ? (typeof quantity === 'string' ? parseInt(quantity, 10) : quantity)
            : undefined;
        const parsedPriceAtTime = price_at_time !== undefined
            ? (typeof price_at_time === 'string' ? parseFloat(price_at_time) : price_at_time)
            : undefined;
        const parsedIsOptional = is_optional !== undefined
            ? (typeof is_optional === 'string'
                ? is_optional === 'true' || is_optional === '1'
                : is_optional)
            : undefined;
        const parsedIsAddon = is_addon !== undefined
            ? (typeof is_addon === 'string'
                ? is_addon === 'true' || is_addon === '1'
                : is_addon)
            : undefined;
        // Validate required fields
        if (!dish_id || !parsedPeopleCount) {
            res.status(400).json({
                success: false,
                error: {
                    message: "Missing required fields: dish_id, people_count",
                },
            });
            return;
        }
        const packageItem = await packageItemsService.createPackageItem(catererId, {
            dish_id,
            people_count: parsedPeopleCount,
            quantity: parsedQuantity,
            price_at_time: parsedPriceAtTime,
            is_optional: parsedIsOptional,
            is_addon: parsedIsAddon,
            package_id: package_id || undefined,
        });
        res.status(201).json({
            success: true,
            data: packageItem,
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
exports.createPackageItem = createPackageItem;
/**
 * Get all package items for the authenticated caterer
 * GET /api/caterer/packages/items?draft=true (optional: filter only draft items without package_id)
 */
const getPackageItems = async (req, res, next) => {
    console.log("🔵 [GET PACKAGE ITEMS] API hit");
    console.log("🔵 [GET PACKAGE ITEMS] Request URL:", req.url);
    console.log("🔵 [GET PACKAGE ITEMS] Request method:", req.method);
    console.log("🔵 [GET PACKAGE ITEMS] Query params:", req.query);
    console.log("🔵 [GET PACKAGE ITEMS] Headers:", JSON.stringify(req.headers, null, 2));
    try {
        const user = req.user;
        console.log("🔵 [GET PACKAGE ITEMS] Decoded user from token:", JSON.stringify(user, null, 2));
        if (!user || !user.userId) {
            console.log("❌ [GET PACKAGE ITEMS] No user or userId found");
            res.status(401).json({
                success: false,
                error: {
                    message: "Unauthorized",
                },
            });
            return;
        }
        const catererId = user.userId;
        const draftOnly = req.query.draft === 'true' || req.query.draft === '1';
        console.log("🔵 [GET PACKAGE ITEMS] Extracted catererId:", catererId);
        console.log("🔵 [GET PACKAGE ITEMS] User type:", user.type);
        console.log("🔵 [GET PACKAGE ITEMS] User email:", user.email);
        console.log("🔵 [GET PACKAGE ITEMS] Draft only filter:", draftOnly);
        console.log("🔵 [GET PACKAGE ITEMS] Calling service.getPackageItems with catererId:", catererId, "draftOnly:", draftOnly);
        const packageItems = await packageItemsService.getPackageItems(catererId, draftOnly);
        console.log("✅ [GET PACKAGE ITEMS] Service returned", packageItems?.length || 0, "items");
        res.status(200).json({
            success: true,
            data: packageItems,
        });
    }
    catch (error) {
        console.error("❌ [GET PACKAGE ITEMS] Error occurred:");
        console.error("❌ [GET PACKAGE ITEMS] Error message:", error.message);
        console.error("❌ [GET PACKAGE ITEMS] Error stack:", error.stack);
        console.error("❌ [GET PACKAGE ITEMS] Full error:", JSON.stringify(error, null, 2));
        res.status(error.message?.includes("not found") ? 404 : 400).json({
            success: false,
            error: {
                message: error.message || "An error occurred",
            },
        });
    }
};
exports.getPackageItems = getPackageItems;
/**
 * Get package item by ID
 * GET /api/caterer/packages/items/:id
 */
const getPackageItemById = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        const itemId = req.params.id;
        const packageItem = await packageItemsService.getPackageItemById(itemId, catererId);
        res.status(200).json({
            success: true,
            data: packageItem,
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
exports.getPackageItemById = getPackageItemById;
/**
 * Update a package item
 * PUT /api/caterer/packages/items/:id
 */
const updatePackageItem = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        const itemId = req.params.id;
        const { dish_id, people_count, quantity, price_at_time, is_optional, is_addon, package_id, } = req.body;
        // Convert FormData string values to proper types
        const parsedPeopleCount = people_count !== undefined
            ? (typeof people_count === 'string' ? parseInt(people_count, 10) : people_count)
            : undefined;
        const parsedQuantity = quantity !== undefined
            ? (typeof quantity === 'string' ? parseInt(quantity, 10) : quantity)
            : undefined;
        const parsedPriceAtTime = price_at_time !== undefined
            ? (typeof price_at_time === 'string' ? parseFloat(price_at_time) : price_at_time)
            : undefined;
        const parsedIsOptional = is_optional !== undefined
            ? (typeof is_optional === 'string'
                ? is_optional === 'true' || is_optional === '1'
                : is_optional)
            : undefined;
        const parsedIsAddon = is_addon !== undefined
            ? (typeof is_addon === 'string'
                ? is_addon === 'true' || is_addon === '1'
                : is_addon)
            : undefined;
        const packageItem = await packageItemsService.updatePackageItem(itemId, catererId, {
            dish_id,
            people_count: parsedPeopleCount,
            quantity: parsedQuantity,
            price_at_time: parsedPriceAtTime,
            is_optional: parsedIsOptional,
            is_addon: parsedIsAddon,
            package_id: package_id || undefined,
        });
        res.status(200).json({
            success: true,
            data: packageItem,
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
exports.updatePackageItem = updatePackageItem;
/**
 * Delete a package item
 * DELETE /api/caterer/packages/items/:id
 */
const deletePackageItem = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        const itemId = req.params.id;
        await packageItemsService.deletePackageItem(itemId, catererId);
        res.status(200).json({
            success: true,
            message: "Package item deleted successfully",
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
exports.deletePackageItem = deletePackageItem;
/**
 * Link package items to a package
 * POST /api/caterer/packages/:id/items/link
 */
const linkPackageItemsToPackage = async (req, res, next) => {
    try {
        const user = req.user;
        const catererId = user.userId;
        // Get packageId from params (route: /packages/:id/items/link)
        const packageId = req.params.id;
        const { item_ids } = req.body;
        if (!item_ids || !Array.isArray(item_ids) || item_ids.length === 0) {
            res.status(400).json({
                success: false,
                error: {
                    message: "item_ids array is required",
                },
            });
            return;
        }
        const updatedItems = await packageItemsService.linkPackageItemsToPackage(packageId, item_ids, catererId);
        res.status(200).json({
            success: true,
            data: updatedItems,
            message: "Package items linked successfully",
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
exports.linkPackageItemsToPackage = linkPackageItemsToPackage;
