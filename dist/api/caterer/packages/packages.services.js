"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackage = exports.createPackage = exports.getPackageById = exports.getPackagesByCatererId = void 0;
const prisma_1 = __importDefault(require("../../../lib/prisma"));
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
    // Extract package_item_ids before creating package (it's not a Package field)
    const { package_item_ids, ...packageDataWithoutItems } = data;
    // Create the package
    const packageData = await prisma_1.default.package.create({
        data: {
            ...packageDataWithoutItems,
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
    // Link package items if provided
    if (package_item_ids && package_item_ids.length > 0) {
        // Verify all items belong to caterer
        const items = await prisma_1.default.packageItem.findMany({
            where: {
                id: { in: package_item_ids },
                dish: {
                    caterer_id: catererId,
                },
            },
        });
        if (items.length !== package_item_ids.length) {
            throw new Error("Some package items not found or do not belong to this caterer");
        }
        // Link items to the package
        await prisma_1.default.packageItem.updateMany({
            where: {
                id: { in: package_item_ids },
            },
            data: {
                package_id: packageData.id,
            },
        });
        // Fetch updated package with linked items
        const updatedPackage = await prisma_1.default.package.findUnique({
            where: { id: packageData.id },
            include: {
                package_type: true,
                items: {
                    include: {
                        dish: {
                            include: {
                                cuisine_type: true,
                                category: true,
                                sub_category: true,
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
        return updatedPackage;
    }
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
