"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
/**
 * Backfill script to set caterer_id on existing PackageItem records
 * based on their related dish.caterer_id
 */
async function backfillPackageItemCatererId() {
    console.log('🔄 Starting backfill of PackageItem.caterer_id...');
    try {
        // Get all package items with null caterer_id
        const packageItems = await prisma_1.default.packageItem.findMany({
            where: {
                caterer_id: null,
            },
            include: {
                dish: {
                    select: {
                        caterer_id: true,
                    },
                },
            },
        });
        console.log(`📦 Found ${packageItems.length} package items without caterer_id`);
        let updated = 0;
        let skipped = 0;
        for (const item of packageItems) {
            if (item.dish.caterer_id) {
                await prisma_1.default.packageItem.update({
                    where: { id: item.id },
                    data: { caterer_id: item.dish.caterer_id },
                });
                updated++;
            }
            else {
                console.warn(`⚠️  PackageItem ${item.id} has dish without caterer_id`);
                skipped++;
            }
        }
        console.log(`✅ Updated ${updated} package items`);
        if (skipped > 0) {
            console.log(`⚠️  Skipped ${skipped} package items (dish has no caterer_id)`);
        }
        console.log('✨ Backfill completed!');
    }
    catch (error) {
        console.error('❌ Error during backfill:', error);
        throw error;
    }
    finally {
        await prisma_1.default.$disconnect();
    }
}
// Run if called directly
if (require.main === module) {
    backfillPackageItemCatererId()
        .then(() => process.exit(0))
        .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
exports.default = backfillPackageItemCatererId;
