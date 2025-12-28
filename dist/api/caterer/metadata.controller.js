"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageTypes = exports.getFreeForms = exports.getSubCategories = exports.getCategories = exports.getCuisineTypes = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
/**
 * Get all cuisine types
 * GET /api/caterer/metadata/cuisine-types
 */
const getCuisineTypes = async (req, res, next) => {
    try {
        const cuisineTypes = await prisma_1.default.cuisineType.findMany({
            orderBy: {
                name: "asc",
            },
        });
        res.status(200).json({
            success: true,
            data: cuisineTypes,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: error.message || "An error occurred",
            },
        });
    }
};
exports.getCuisineTypes = getCuisineTypes;
/**
 * Get all categories
 * GET /api/caterer/metadata/categories
 */
const getCategories = async (req, res, next) => {
    try {
        const categories = await prisma_1.default.category.findMany({
            orderBy: {
                name: "asc",
            },
        });
        res.status(200).json({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: error.message || "An error occurred",
            },
        });
    }
};
exports.getCategories = getCategories;
/**
 * Get subcategories by category ID
 * GET /api/caterer/metadata/subcategories?category_id=xxx
 */
const getSubCategories = async (req, res, next) => {
    try {
        const category_id = req.query.category_id;
        const where = {};
        if (category_id) {
            where.category_id = category_id;
        }
        const subCategories = await prisma_1.default.subCategory.findMany({
            where,
            orderBy: {
                name: "asc",
            },
        });
        res.status(200).json({
            success: true,
            data: subCategories,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: error.message || "An error occurred",
            },
        });
    }
};
exports.getSubCategories = getSubCategories;
/**
 * Get all free forms
 * GET /api/caterer/metadata/freeforms
 */
const getFreeForms = async (req, res, next) => {
    try {
        const freeForms = await prisma_1.default.freeForm.findMany({
            orderBy: {
                name: "asc",
            },
        });
        res.status(200).json({
            success: true,
            data: freeForms,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: error.message || "An error occurred",
            },
        });
    }
};
exports.getFreeForms = getFreeForms;
/**
 * Get all package types
 * GET /api/caterer/metadata/package-types
 */
const getPackageTypes = async (req, res, next) => {
    try {
        const packageTypes = await prisma_1.default.packageType.findMany({
            orderBy: {
                name: "asc",
            },
        });
        res.status(200).json({
            success: true,
            data: packageTypes,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: error.message || "An error occurred",
            },
        });
    }
};
exports.getPackageTypes = getPackageTypes;
