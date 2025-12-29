"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL environment variable is not set!");
    process.exit(1);
}
// Create PostgreSQL pool
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
// Create PrismaClient with adapter
const prisma = new client_1.PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});
// ============================================
// CONFIGURATION - Replace this with your caterer ID
// ============================================
const CATERER_ID = process.env.CATERER_ID || "d2657989-a73f-4df2-9386-b4162fef00f6";
// Unsplash food image URLs - High quality food images (30 unique images)
const FOOD_IMAGES = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80", // Salad
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&q=80", // Pizza
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&q=80", // Burger
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop&q=80", // Pasta
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80", // Food
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop&q=80", // Sushi
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&q=80", // Pasta
    "https://images.unsplash.com/photo-1563379091339-03246963d19a?w=800&h=600&fit=crop&q=80", // Curry
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop&q=80", // Food
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&h=600&fit=crop&q=80", // Burger
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&q=80", // Food
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&q=80", // Burger
    "https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=600&fit=crop&q=80", // Pizza
    "https://images.unsplash.com/photo-1563379091339-03246963d19a?w=800&h=600&fit=crop&q=80", // Curry
    "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop&q=80", // Food
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&q=80", // Pizza
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop&q=80", // Pasta
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80", // Salad
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80", // Food
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop&q=80", // Sushi
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&q=80", // Pasta
    "https://images.unsplash.com/photo-1563379091339-03246963d19a?w=800&h=600&fit=crop&q=80", // Curry
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop&q=80", // Food
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&h=600&fit=crop&q=80", // Burger
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&q=80", // Food
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&q=80", // Burger
    "https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=600&fit=crop&q=80", // Pizza
    "https://images.unsplash.com/photo-1563379091339-03246963d19a?w=800&h=600&fit=crop&q=80", // Curry
    "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop&q=80", // Food
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80", // Food
];
// Dish data with variety
const DISHES_DATA = [
    // Indian Cuisine
    { name: "Butter Chicken", cuisine: "Indian", category: "Main Course", subCategory: "Curry", price: 45.00, quantity_gm: 300, pieces: 1 },
    { name: "Chicken Biryani", cuisine: "Indian", category: "Main Course", subCategory: "Rice Dishes", price: 38.00, quantity_gm: 400, pieces: 1 },
    { name: "Paneer Tikka", cuisine: "Indian", category: "Appetizers", subCategory: "Finger Food", price: 28.00, quantity_gm: 200, pieces: 6 },
    { name: "Dal Makhani", cuisine: "Indian", category: "Main Course", subCategory: "Curry", price: 25.00, quantity_gm: 250, pieces: 1 },
    { name: "Vegetable Samosa", cuisine: "Indian", category: "Appetizers", subCategory: "Finger Food", price: 12.00, quantity_gm: null, pieces: 2 },
    { name: "Gulab Jamun", cuisine: "Indian", category: "Desserts", subCategory: "Pastries", price: 15.00, quantity_gm: null, pieces: 2 },
    // Arabic Cuisine
    { name: "Hummus", cuisine: "Arabic", category: "Appetizers", subCategory: "Dips & Spreads", price: 18.00, quantity_gm: 200, pieces: 1 },
    { name: "Chicken Shawarma", cuisine: "Arabic", category: "Main Course", subCategory: "Grilled", price: 32.00, quantity_gm: null, pieces: 1 },
    { name: "Fattoush Salad", cuisine: "Arabic", category: "Salads", subCategory: "Green Salads", price: 22.00, quantity_gm: 250, pieces: 1 },
    { name: "Baklava", cuisine: "Arabic", category: "Desserts", subCategory: "Pastries", price: 20.00, quantity_gm: null, pieces: 3 },
    { name: "Mutton Mandi", cuisine: "Arabic", category: "Main Course", subCategory: "Rice Dishes", price: 55.00, quantity_gm: 450, pieces: 1 },
    { name: "Falafel", cuisine: "Arabic", category: "Appetizers", subCategory: "Finger Food", price: 16.00, quantity_gm: null, pieces: 4 },
    // Western Cuisine
    { name: "Caesar Salad", cuisine: "Western", category: "Salads", subCategory: "Green Salads", price: 28.00, quantity_gm: 300, pieces: 1 },
    { name: "Grilled Chicken Breast", cuisine: "Western", category: "Main Course", subCategory: "Grilled", price: 42.00, quantity_gm: 250, pieces: 1 },
    { name: "Chocolate Cake", cuisine: "Western", category: "Desserts", subCategory: "Cakes", price: 35.00, quantity_gm: 150, pieces: 1 },
    { name: "Beef Steak", cuisine: "Western", category: "Main Course", subCategory: "Grilled", price: 65.00, quantity_gm: 300, pieces: 1 },
    { name: "Fish and Chips", cuisine: "Western", category: "Main Course", subCategory: "Grilled", price: 38.00, quantity_gm: 350, pieces: 1 },
    { name: "Vanilla Ice Cream", cuisine: "Western", category: "Desserts", subCategory: "Ice Cream", price: 18.00, quantity_gm: 150, pieces: 1 },
    // Chinese Cuisine
    { name: "Vegetable Spring Rolls", cuisine: "Chinese", category: "Appetizers", subCategory: "Finger Food", price: 16.00, quantity_gm: null, pieces: 4 },
    { name: "Chicken Fried Rice", cuisine: "Chinese", category: "Main Course", subCategory: "Rice Dishes", price: 30.00, quantity_gm: 350, pieces: 1 },
    { name: "Sweet and Sour Chicken", cuisine: "Chinese", category: "Main Course", subCategory: "Curry", price: 35.00, quantity_gm: 300, pieces: 1 },
    { name: "Chicken Manchurian", cuisine: "Chinese", category: "Main Course", subCategory: "Curry", price: 32.00, quantity_gm: 280, pieces: 1 },
    { name: "Dim Sum Platter", cuisine: "Chinese", category: "Appetizers", subCategory: "Finger Food", price: 24.00, quantity_gm: null, pieces: 6 },
    // Italian Cuisine
    { name: "Bruschetta", cuisine: "Italian", category: "Appetizers", subCategory: "Finger Food", price: 24.00, quantity_gm: null, pieces: 4 },
    { name: "Spaghetti Carbonara", cuisine: "Italian", category: "Main Course", subCategory: "Pasta", price: 40.00, quantity_gm: 300, pieces: 1 },
    { name: "Tiramisu", cuisine: "Italian", category: "Desserts", subCategory: "Pastries", price: 28.00, quantity_gm: 120, pieces: 1 },
    { name: "Margherita Pizza", cuisine: "Italian", category: "Main Course", subCategory: "Pasta", price: 36.00, quantity_gm: null, pieces: 1 },
    { name: "Risotto", cuisine: "Italian", category: "Main Course", subCategory: "Rice Dishes", price: 38.00, quantity_gm: 320, pieces: 1 },
    // Mediterranean Cuisine
    { name: "Greek Salad", cuisine: "Mediterranean", category: "Salads", subCategory: "Green Salads", price: 26.00, quantity_gm: 280, pieces: 1 },
    { name: "Grilled Salmon", cuisine: "Mediterranean", category: "Main Course", subCategory: "Grilled", price: 48.00, quantity_gm: 250, pieces: 1 },
    { name: "Mediterranean Quinoa Bowl", cuisine: "Mediterranean", category: "Salads", subCategory: "Green Salads", price: 32.00, quantity_gm: 350, pieces: 1 },
    { name: "Lamb Kebab", cuisine: "Mediterranean", category: "Main Course", subCategory: "Grilled", price: 42.00, quantity_gm: 300, pieces: 2 },
    { name: "Baba Ganoush", cuisine: "Mediterranean", category: "Appetizers", subCategory: "Dips & Spreads", price: 20.00, quantity_gm: 200, pieces: 1 },
];
async function main() {
    console.log("🌱 Starting dish seeding script...");
    console.log(`📝 Using Caterer ID: ${CATERER_ID}`);
    if (CATERER_ID === "YOUR_CATERER_ID_HERE") {
        console.error("❌ Error: Please set CATERER_ID environment variable or update the script!");
        console.error("   Example: CATERER_ID=your-caterer-id-here npm run seed:dishes");
        process.exit(1);
    }
    // Verify caterer exists
    const caterer = await prisma.user.findUnique({
        where: { id: CATERER_ID },
    });
    if (!caterer) {
        console.error(`❌ Error: Caterer with ID ${CATERER_ID} not found!`);
        process.exit(1);
    }
    if (caterer.type !== "CATERER") {
        console.error(`❌ Error: User with ID ${CATERER_ID} is not a CATERER!`);
        process.exit(1);
    }
    console.log(`✅ Found caterer: ${caterer.first_name} ${caterer.last_name} (${caterer.company_name})`);
    // Fetch existing cuisine types, categories, and subcategories
    console.log("📋 Fetching existing cuisine types, categories, and subcategories...");
    const cuisineTypes = await prisma.cuisineType.findMany();
    const categories = await prisma.category.findMany();
    const subCategories = await prisma.subCategory.findMany();
    if (cuisineTypes.length === 0 || categories.length === 0 || subCategories.length === 0) {
        console.error("❌ Error: No cuisine types, categories, or subcategories found!");
        console.error("   Please run the main seed script first: npm run seed");
        process.exit(1);
    }
    console.log(`   Found ${cuisineTypes.length} cuisine types, ${categories.length} categories, ${subCategories.length} subcategories`);
    // Create a map for quick lookup
    const cuisineMap = new Map(cuisineTypes.map(ct => [ct.name.toLowerCase(), ct.id]));
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));
    const subCategoryMap = new Map(subCategories.map(sc => [sc.name.toLowerCase(), sc.id]));
    // Create dishes
    console.log("🍽️  Creating dishes...");
    const createdDishes = [];
    const dishesToCreate = Math.min(DISHES_DATA.length, 30);
    for (let i = 0; i < dishesToCreate; i++) {
        const dishData = DISHES_DATA[i];
        const imageUrl = FOOD_IMAGES[i % FOOD_IMAGES.length];
        // Find matching IDs
        const cuisineTypeId = cuisineMap.get(dishData.cuisine.toLowerCase());
        const categoryId = categoryMap.get(dishData.category.toLowerCase());
        const subCategoryId = subCategoryMap.get(dishData.subCategory.toLowerCase());
        if (!cuisineTypeId || !categoryId || !subCategoryId) {
            console.warn(`⚠️  Skipping ${dishData.name}: Missing required IDs`);
            console.warn(`   Cuisine: ${cuisineTypeId ? '✓' : '✗'}, Category: ${categoryId ? '✓' : '✗'}, SubCategory: ${subCategoryId ? '✓' : '✗'}`);
            continue;
        }
        try {
            const dish = await prisma.dish.create({
                data: {
                    name: dishData.name,
                    image_url: imageUrl,
                    cuisine_type_id: cuisineTypeId,
                    category_id: categoryId,
                    sub_category_id: subCategoryId,
                    caterer_id: CATERER_ID,
                    quantity_in_gm: dishData.quantity_gm || null,
                    pieces: dishData.pieces || 1,
                    price: dishData.price,
                    currency: "AED",
                    is_active: true,
                },
            });
            createdDishes.push(dish);
            console.log(`   ✓ Created: ${dish.name} (${dish.price} AED)`);
        }
        catch (error) {
            console.error(`   ✗ Failed to create ${dishData.name}:`, error.message);
        }
    }
    console.log("\n✅ Dish seeding completed!");
    console.log(`📊 Summary:`);
    console.log(`   - Total dishes created: ${createdDishes.length}`);
    console.log(`   - Caterer: ${caterer.company_name || caterer.first_name + ' ' + caterer.last_name}`);
}
main()
    .catch((e) => {
    console.error("❌ Error during dish seeding:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
