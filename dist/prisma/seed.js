"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL environment variable is not set!");
    console.error("Please create a .env file with your DATABASE_URL.");
    console.error("Example: DATABASE_URL=postgresql://user:password@localhost:5432/partyfud");
    process.exit(1);
}
// Create PostgreSQL pool
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
// Create PrismaClient with adapter - Prisma 7.x with custom output requires adapter
const prisma = new client_1.PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
async function main() {
    console.log("🌱 Starting seed...");
    // Clear existing data (in reverse order of dependencies)
    // Wrap in try-catch to handle cases where tables don't exist yet
    console.log("🧹 Cleaning existing data...");
    try {
        await prisma.packageOccassion.deleteMany();
        await prisma.packageCategorySelection.deleteMany();
        await prisma.packageItem.deleteMany();
        await prisma.package.deleteMany();
        await prisma.dishFreeForm.deleteMany();
        await prisma.dish.deleteMany();
        await prisma.subCategory.deleteMany();
        await prisma.category.deleteMany();
        await prisma.freeForm.deleteMany();
        await prisma.cuisineType.deleteMany();
        await prisma.occassion.deleteMany();
        await prisma.packageType.deleteMany();
        await prisma.user.deleteMany();
    }
    catch (error) {
        // If tables don't exist, that's okay - we'll create them
        if (error.code === "P2021" || error.message?.includes("does not exist")) {
            console.log("⚠️  Some tables don't exist yet. This is normal if running seed for the first time.");
            console.log("💡 Make sure to run 'npx prisma migrate dev' first to create the database schema.");
        }
        else {
            throw error;
        }
    }
    // 1. Create Users
    console.log("👥 Creating users...");
    const admin = await prisma.user.create({
        data: {
            first_name: "Ahmed",
            last_name: "Al-Mansoori",
            phone: "+971501234567",
            email: "admin@partyfud.ae",
            password: "$2b$10$hashedpassword", // In real app, use bcrypt
            type: "ADMIN",
        },
    });
    const caterer1 = await prisma.user.create({
        data: {
            first_name: "Fatima",
            last_name: "Hassan",
            phone: "+971502345678",
            email: "fatima@royalcatering.ae",
            password: "$2b$10$hashedpassword",
            company_name: "Royal Catering Services",
            type: "CATERER",
        },
    });
    const caterer2 = await prisma.user.create({
        data: {
            first_name: "Mohammed",
            last_name: "Ibrahim",
            phone: "+971503456789",
            email: "mohammed@delightcatering.ae",
            password: "$2b$10$hashedpassword",
            company_name: "Delight Catering Co.",
            type: "CATERER",
        },
    });
    const user1 = await prisma.user.create({
        data: {
            first_name: "Sarah",
            last_name: "Johnson",
            phone: "+971504567890",
            email: "sarah.johnson@email.com",
            password: "$2b$10$hashedpassword",
            type: "USER",
        },
    });
    const user2 = await prisma.user.create({
        data: {
            first_name: "David",
            last_name: "Smith",
            phone: "+971505678901",
            email: "david.smith@email.com",
            password: "$2b$10$hashedpassword",
            type: "USER",
        },
    });
    // 2. Create Cuisine Types
    console.log("🍽️ Creating cuisine types...");
    const indian = await prisma.cuisineType.create({
        data: {
            name: "Indian",
            description: "Authentic Indian cuisine with rich spices and flavors",
        },
    });
    const arabic = await prisma.cuisineType.create({
        data: {
            name: "Arabic",
            description: "Traditional Middle Eastern and Arabic dishes",
        },
    });
    const western = await prisma.cuisineType.create({
        data: {
            name: "Western",
            description: "European and American style cuisine",
        },
    });
    const chinese = await prisma.cuisineType.create({
        data: {
            name: "Chinese",
            description: "Traditional Chinese cuisine",
        },
    });
    const italian = await prisma.cuisineType.create({
        data: {
            name: "Italian",
            description: "Classic Italian dishes and pasta",
        },
    });
    const mediterranean = await prisma.cuisineType.create({
        data: {
            name: "Mediterranean",
            description: "Fresh Mediterranean flavors and ingredients",
        },
    });
    // 3. Create Categories
    console.log("📂 Creating categories...");
    const appetizers = await prisma.category.create({
        data: {
            name: "Appetizers",
            description: "Starters and small plates",
        },
    });
    const mainCourse = await prisma.category.create({
        data: {
            name: "Main Course",
            description: "Main dishes and entrees",
        },
    });
    const desserts = await prisma.category.create({
        data: {
            name: "Desserts",
            description: "Sweet treats and desserts",
        },
    });
    const beverages = await prisma.category.create({
        data: {
            name: "Beverages",
            description: "Drinks and refreshments",
        },
    });
    const salads = await prisma.category.create({
        data: {
            name: "Salads",
            description: "Fresh salads and sides",
        },
    });
    const soups = await prisma.category.create({
        data: {
            name: "Soups",
            description: "Hot and cold soups",
        },
    });
    // 4. Create SubCategories
    console.log("📁 Creating subcategories...");
    // Appetizers subcategories
    const dips = await prisma.subCategory.create({
        data: {
            name: "Dips & Spreads",
            category_id: appetizers.id,
            description: "Hummus, baba ganoush, and other dips",
        },
    });
    const fingerFood = await prisma.subCategory.create({
        data: {
            name: "Finger Food",
            category_id: appetizers.id,
            description: "Small bite-sized appetizers",
        },
    });
    // Main Course subcategories
    const grilled = await prisma.subCategory.create({
        data: {
            name: "Grilled",
            category_id: mainCourse.id,
            description: "Grilled meats and vegetables",
        },
    });
    const curry = await prisma.subCategory.create({
        data: {
            name: "Curry",
            category_id: mainCourse.id,
            description: "Curry dishes",
        },
    });
    const pasta = await prisma.subCategory.create({
        data: {
            name: "Pasta",
            category_id: mainCourse.id,
            description: "Pasta dishes",
        },
    });
    const rice = await prisma.subCategory.create({
        data: {
            name: "Rice Dishes",
            category_id: mainCourse.id,
            description: "Biryani, fried rice, and rice-based dishes",
        },
    });
    // Desserts subcategories
    const cakes = await prisma.subCategory.create({
        data: {
            name: "Cakes",
            category_id: desserts.id,
            description: "Various cake varieties",
        },
    });
    const iceCream = await prisma.subCategory.create({
        data: {
            name: "Ice Cream",
            category_id: desserts.id,
            description: "Ice cream and frozen desserts",
        },
    });
    const pastries = await prisma.subCategory.create({
        data: {
            name: "Pastries",
            category_id: desserts.id,
            description: "Sweet pastries and baked goods",
        },
    });
    // Salads subcategories
    const greenSalads = await prisma.subCategory.create({
        data: {
            name: "Green Salads",
            category_id: salads.id,
            description: "Fresh green salads",
        },
    });
    const fruitSalads = await prisma.subCategory.create({
        data: {
            name: "Fruit Salads",
            category_id: salads.id,
            description: "Fresh fruit salads",
        },
    });
    // 5. Create FreeForms (Dietary restrictions)
    console.log("🌿 Creating dietary restrictions...");
    const vegan = await prisma.freeForm.create({
        data: {
            name: "Vegan",
            description: "No animal products",
        },
    });
    const glutenFree = await prisma.freeForm.create({
        data: {
            name: "Gluten-Free",
            description: "No gluten-containing ingredients",
        },
    });
    const halal = await prisma.freeForm.create({
        data: {
            name: "Halal",
            description: "Prepared according to Islamic dietary laws",
        },
    });
    const sugarFree = await prisma.freeForm.create({
        data: {
            name: "Sugar-Free",
            description: "No added sugar",
        },
    });
    const dairyFree = await prisma.freeForm.create({
        data: {
            name: "Dairy-Free",
            description: "No dairy products",
        },
    });
    const nutFree = await prisma.freeForm.create({
        data: {
            name: "Nut-Free",
            description: "No nuts or nut products",
        },
    });
    // 6. Create Dishes
    console.log("🍲 Creating dishes...");
    const dishes = [];
    // Indian dishes
    const butterChicken = await prisma.dish.create({
        data: {
            name: "Butter Chicken",
            cuisine_type_id: indian.id,
            category_id: mainCourse.id,
            sub_category_id: curry.id,
            price: 45.00,
            quantity_in_gm: 300,
            pieces: 1,
            is_active: true,
        },
    });
    dishes.push(butterChicken);
    const chickenBiryani = await prisma.dish.create({
        data: {
            name: "Chicken Biryani",
            cuisine_type_id: indian.id,
            category_id: mainCourse.id,
            sub_category_id: rice.id,
            price: 38.00,
            quantity_in_gm: 400,
            pieces: 1,
            is_active: true,
        },
    });
    dishes.push(chickenBiryani);
    const samosa = await prisma.dish.create({
        data: {
            name: "Vegetable Samosa",
            cuisine_type_id: indian.id,
            category_id: appetizers.id,
            sub_category_id: fingerFood.id,
            price: 12.00,
            pieces: 2,
            is_active: true,
        },
    });
    dishes.push(samosa);
    const gulabJamun = await prisma.dish.create({
        data: {
            name: "Gulab Jamun",
            cuisine_type_id: indian.id,
            category_id: desserts.id,
            sub_category_id: pastries.id,
            price: 15.00,
            pieces: 2,
            is_active: true,
        },
    });
    dishes.push(gulabJamun);
    // Arabic dishes
    const hummus = await prisma.dish.create({
        data: {
            name: "Hummus",
            cuisine_type_id: arabic.id,
            category_id: appetizers.id,
            sub_category_id: dips.id,
            price: 18.00,
            quantity_in_gm: 200,
            pieces: 1,
            is_active: true,
        },
    });
    dishes.push(hummus);
    const shawarma = await prisma.dish.create({
        data: {
            name: "Chicken Shawarma",
            cuisine_type_id: arabic.id,
            category_id: mainCourse.id,
            sub_category_id: grilled.id,
            price: 32.00,
            pieces: 1,
            is_active: true,
        },
    });
    dishes.push(shawarma);
    const fattoush = await prisma.dish.create({
        data: {
            name: "Fattoush Salad",
            cuisine_type_id: arabic.id,
            category_id: salads.id,
            sub_category_id: greenSalads.id,
            price: 22.00,
            quantity_in_gm: 250,
            pieces: 1,
            is_active: true,
        },
    });
    dishes.push(fattoush);
    const baklava = await prisma.dish.create({
        data: {
            name: "Baklava",
            cuisine_type_id: arabic.id,
            category_id: desserts.id,
            sub_category_id: pastries.id,
            price: 20.00,
            pieces: 3,
            is_active: true,
        },
    });
    dishes.push(baklava);
    // Western dishes
    const caesarSalad = await prisma.dish.create({
        data: {
            name: "Caesar Salad",
            cuisine_type_id: western.id,
            category_id: salads.id,
            sub_category_id: greenSalads.id,
            price: 28.00,
            quantity_in_gm: 300,
            pieces: 1,
            is_active: true,
        },
    });
    dishes.push(caesarSalad);
    const grilledChicken = await prisma.dish.create({
        data: {
            name: "Grilled Chicken Breast",
            cuisine_type_id: western.id,
            category_id: mainCourse.id,
            sub_category_id: grilled.id,
            price: 42.00,
            quantity_in_gm: 250,
            pieces: 1,
            is_active: true,
        },
    });
    dishes.push(grilledChicken);
    const chocolateCake = await prisma.dish.create({
        data: {
            name: "Chocolate Cake",
            cuisine_type_id: western.id,
            category_id: desserts.id,
            sub_category_id: cakes.id,
            price: 35.00,
            quantity_in_gm: 150,
            pieces: 1,
            is_active: true,
        },
    });
    dishes.push(chocolateCake);
    // Chinese dishes
    const springRolls = await prisma.dish.create({
        data: {
            name: "Vegetable Spring Rolls",
            cuisine_type_id: chinese.id,
            category_id: appetizers.id,
            sub_category_id: fingerFood.id,
            price: 16.00,
            pieces: 4,
            is_active: true,
        },
    });
    dishes.push(springRolls);
    const friedRice = await prisma.dish.create({
        data: {
            name: "Chicken Fried Rice",
            cuisine_type_id: chinese.id,
            category_id: mainCourse.id,
            sub_category_id: rice.id,
            price: 30.00,
            quantity_in_gm: 350,
            pieces: 1,
            is_active: true,
        },
    });
    dishes.push(friedRice);
    // Italian dishes
    const bruschetta = await prisma.dish.create({
        data: {
            name: "Bruschetta",
            cuisine_type_id: italian.id,
            category_id: appetizers.id,
            sub_category_id: fingerFood.id,
            price: 24.00,
            pieces: 4,
            is_active: true,
        },
    });
    dishes.push(bruschetta);
    const spaghetti = await prisma.dish.create({
        data: {
            name: "Spaghetti Carbonara",
            cuisine_type_id: italian.id,
            category_id: mainCourse.id,
            sub_category_id: pasta.id,
            price: 40.00,
            quantity_in_gm: 300,
            pieces: 1,
            is_active: true,
        },
    });
    dishes.push(spaghetti);
    const tiramisu = await prisma.dish.create({
        data: {
            name: "Tiramisu",
            cuisine_type_id: italian.id,
            category_id: desserts.id,
            sub_category_id: pastries.id,
            price: 28.00,
            quantity_in_gm: 120,
            pieces: 1,
            is_active: true,
        },
    });
    dishes.push(tiramisu);
    // Mediterranean dishes
    const greekSalad = await prisma.dish.create({
        data: {
            name: "Greek Salad",
            cuisine_type_id: mediterranean.id,
            category_id: salads.id,
            sub_category_id: greenSalads.id,
            price: 26.00,
            quantity_in_gm: 280,
            pieces: 1,
            is_active: true,
        },
    });
    dishes.push(greekSalad);
    // 7. Link Dishes to FreeForms
    console.log("🔗 Linking dishes to dietary restrictions...");
    await prisma.dishFreeForm.createMany({
        data: [
            { dish_id: hummus.id, freeform_id: vegan.id },
            { dish_id: hummus.id, freeform_id: halal.id },
            { dish_id: fattoush.id, freeform_id: vegan.id },
            { dish_id: fattoush.id, freeform_id: halal.id },
            { dish_id: caesarSalad.id, freeform_id: glutenFree.id },
            { dish_id: greekSalad.id, freeform_id: vegan.id },
            { dish_id: greekSalad.id, freeform_id: halal.id },
            { dish_id: springRolls.id, freeform_id: halal.id },
            { dish_id: samosa.id, freeform_id: vegan.id },
            { dish_id: samosa.id, freeform_id: halal.id },
        ],
    });
    // 8. Create Package Types
    console.log("📦 Creating package types...");
    const fixedMenu = await prisma.packageType.create({
        data: {
            name: "Fixed Menu",
            description: "Pre-set menu with no customization options",
        },
    });
    const customizable = await prisma.packageType.create({
        data: {
            name: "Customizable",
            description: "Choose dishes from selected categories",
        },
    });
    const buffetStyle = await prisma.packageType.create({
        data: {
            name: "Buffet Style",
            description: "All-you-can-eat buffet with multiple options",
        },
    });
    // 9. Create Occasions
    console.log("🎉 Creating occasions...");
    const wedding = await prisma.occassion.create({
        data: {
            name: "Wedding",
            description: "Wedding celebrations and receptions",
        },
    });
    const corporate = await prisma.occassion.create({
        data: {
            name: "Corporate Event",
            description: "Business meetings, conferences, and corporate gatherings",
        },
    });
    const birthday = await prisma.occassion.create({
        data: {
            name: "Birthday Party",
            description: "Birthday celebrations",
        },
    });
    const afternoonTea = await prisma.occassion.create({
        data: {
            name: "Afternoon Tea",
            description: "Elegant afternoon tea service",
        },
    });
    const graduation = await prisma.occassion.create({
        data: {
            name: "Graduation",
            description: "Graduation ceremonies and celebrations",
        },
    });
    // 10. Create Packages
    console.log("🎁 Creating packages...");
    // Package 1: Wedding Package by Caterer 1
    const weddingPackage = await prisma.package.create({
        data: {
            name: "Royal Wedding Package",
            people_count: 100,
            package_type_id: buffetStyle.id,
            total_price: 8500.00,
            caterer_id: caterer1.id,
            rating: 4.8,
            is_active: true,
            is_available: true,
        },
    });
    // Add dishes to wedding package
    await prisma.packageItem.createMany({
        data: [
            { package_id: weddingPackage.id, dish_id: hummus.id, people_count: 100, quantity: 10, is_optional: false, price_at_time: 18.00 },
            { package_id: weddingPackage.id, dish_id: fattoush.id, people_count: 100, quantity: 8, is_optional: false, price_at_time: 22.00 },
            { package_id: weddingPackage.id, dish_id: shawarma.id, people_count: 100, quantity: 50, is_optional: false, price_at_time: 32.00 },
            { package_id: weddingPackage.id, dish_id: butterChicken.id, people_count: 100, quantity: 30, is_optional: false, price_at_time: 45.00 },
            { package_id: weddingPackage.id, dish_id: chickenBiryani.id, people_count: 100, quantity: 25, is_optional: false, price_at_time: 38.00 },
            { package_id: weddingPackage.id, dish_id: baklava.id, people_count: 100, quantity: 15, is_optional: false, price_at_time: 20.00 },
            { package_id: weddingPackage.id, dish_id: chocolateCake.id, people_count: 100, quantity: 5, is_optional: false, price_at_time: 35.00 },
        ],
    });
    // Link package to occasions
    await prisma.packageOccassion.create({
        data: {
            package_id: weddingPackage.id,
            occasion_id: wedding.id,
        },
    });
    // Package 2: Corporate Package by Caterer 1
    const corporatePackage = await prisma.package.create({
        data: {
            name: "Executive Corporate Lunch",
            people_count: 50,
            package_type_id: fixedMenu.id,
            total_price: 3200.00,
            caterer_id: caterer1.id,
            rating: 4.5,
            is_active: true,
            is_available: true,
        },
    });
    await prisma.packageItem.createMany({
        data: [
            { package_id: corporatePackage.id, dish_id: caesarSalad.id, people_count: 50, quantity: 20, is_optional: false, price_at_time: 28.00 },
            { package_id: corporatePackage.id, dish_id: grilledChicken.id, people_count: 50, quantity: 30, is_optional: false, price_at_time: 42.00 },
            { package_id: corporatePackage.id, dish_id: greekSalad.id, people_count: 50, quantity: 15, is_optional: true, price_at_time: 26.00 },
            { package_id: corporatePackage.id, dish_id: tiramisu.id, people_count: 50, quantity: 25, is_optional: false, price_at_time: 28.00 },
        ],
    });
    await prisma.packageOccassion.create({
        data: {
            package_id: corporatePackage.id,
            occasion_id: corporate.id,
        },
    });
    // Package 3: Customizable Birthday Package by Caterer 2
    const birthdayPackage = await prisma.package.create({
        data: {
            name: "Kids Birthday Party Package",
            people_count: 30,
            package_type_id: customizable.id,
            total_price: 1800.00,
            caterer_id: caterer2.id,
            rating: 4.7,
            is_active: true,
            is_available: true,
        },
    });
    await prisma.packageItem.createMany({
        data: [
            { package_id: birthdayPackage.id, dish_id: springRolls.id, people_count: 30, quantity: 8, is_optional: false, price_at_time: 16.00 },
            { package_id: birthdayPackage.id, dish_id: friedRice.id, people_count: 30, quantity: 15, is_optional: false, price_at_time: 30.00 },
            { package_id: birthdayPackage.id, dish_id: chocolateCake.id, people_count: 30, quantity: 3, is_optional: false, price_at_time: 35.00 },
            { package_id: birthdayPackage.id, dish_id: samosa.id, people_count: 30, quantity: 10, is_optional: true, price_at_time: 12.00 },
        ],
    });
    // Add category selection rules (customizable package)
    await prisma.packageCategorySelection.create({
        data: {
            package_id: birthdayPackage.id,
            category_id: appetizers.id,
            num_dishes_to_select: 2,
        },
    });
    await prisma.packageCategorySelection.create({
        data: {
            package_id: birthdayPackage.id,
            category_id: desserts.id,
            num_dishes_to_select: 1,
        },
    });
    await prisma.packageOccassion.createMany({
        data: [
            { package_id: birthdayPackage.id, occasion_id: birthday.id },
            { package_id: birthdayPackage.id, occasion_id: graduation.id },
        ],
    });
    // Package 4: Afternoon Tea Package by Caterer 2
    const afternoonTeaPackage = await prisma.package.create({
        data: {
            name: "Elegant Afternoon Tea",
            people_count: 20,
            package_type_id: fixedMenu.id,
            total_price: 950.00,
            caterer_id: caterer2.id,
            rating: 4.9,
            is_active: true,
            is_available: true,
        },
    });
    await prisma.packageItem.createMany({
        data: [
            { package_id: afternoonTeaPackage.id, dish_id: bruschetta.id, people_count: 20, quantity: 10, is_optional: false, price_at_time: 24.00 },
            { package_id: afternoonTeaPackage.id, dish_id: baklava.id, people_count: 20, quantity: 8, is_optional: false, price_at_time: 20.00 },
            { package_id: afternoonTeaPackage.id, dish_id: tiramisu.id, people_count: 20, quantity: 12, is_optional: false, price_at_time: 28.00 },
        ],
    });
    await prisma.packageOccassion.create({
        data: {
            package_id: afternoonTeaPackage.id,
            occasion_id: afternoonTea.id,
        },
    });
    console.log("✅ Seed completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Users: 5 (1 Admin, 2 Caterers, 2 Users)`);
    console.log(`   - Cuisine Types: 6`);
    console.log(`   - Categories: 6`);
    console.log(`   - SubCategories: 10`);
    console.log(`   - FreeForms: 6`);
    console.log(`   - Dishes: ${dishes.length}`);
    console.log(`   - Package Types: 3`);
    console.log(`   - Occasions: 5`);
    console.log(`   - Packages: 4`);
}
main()
    .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
