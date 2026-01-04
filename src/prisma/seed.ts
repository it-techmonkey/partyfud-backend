import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("❌ Error: DATABASE_URL environment variable is not set!");
  console.error("Please create a .env file with your DATABASE_URL.");
  console.error("Example: DATABASE_URL=postgresql://user:password@localhost:5432/partyfud");
  process.exit(1);
}

// Create PostgreSQL pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Create PrismaClient with adapter
const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// Helper function to hash passwords
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Unsplash image URLs for different categories
const UNSplashImages = {
  caterers: [
    "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
  ],
  packages: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
  ],
  dishes: [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
  ],
  packageTypes: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
  ],
};

async function main() {
  console.log("🌱 Starting comprehensive seed...");

  // Clear existing data
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
    await prisma.catererinfo.deleteMany();
    await prisma.user.deleteMany();
  } catch (error: any) {
    if (error.code === "P2021" || error.message?.includes("does not exist")) {
      console.log("⚠️  Some tables don't exist yet. This is normal if running seed for the first time.");
    } else {
      throw error;
    }
  }

  const hashedPassword = await hashPassword("password123");

  // 1. Create Admin User
  console.log("👤 Creating admin user...");
  const admin = await prisma.user.create({
    data: {
      first_name: "Ahmed",
      last_name: "Al-Mansoori",
      phone: "+971501234567",
      email: "admin@partyfud.ae",
      password: hashedPassword,
      type: "ADMIN",
      verified: true,
      profile_completed: true,
    },
  });

  // 2. Create 12 Caterers
  console.log("👥 Creating 12 caterers...");
  const catererData = [
    {
      first_name: "Fatima",
      last_name: "Hassan",
      phone: "+971502345678",
      email: "fatima@royalcatering.ae",
      company_name: "Royal Catering Services",
      service_area: "Dubai Marina, JBR, Palm Jumeirah",
      region: "Dubai",
      business_type: "Full Service Catering",
      min_guests: 20,
      max_guests: 500,
    },
    {
      first_name: "Mohammed",
      last_name: "Ibrahim",
      phone: "+971503456789",
      email: "mohammed@delightcatering.ae",
      company_name: "Delight Catering Co.",
      service_area: "Downtown Dubai, Business Bay",
      region: "Dubai",
      business_type: "Premium Catering",
      min_guests: 30,
      max_guests: 300,
    },
    {
      first_name: "Sarah",
      last_name: "Al-Zahra",
      phone: "+971504567890",
      email: "sarah@elegantevents.ae",
      company_name: "Elegant Events Catering",
      service_area: "Abu Dhabi, Al Ain",
      region: "Abu Dhabi",
      business_type: "Luxury Catering",
      min_guests: 50,
      max_guests: 1000,
    },
    {
      first_name: "Omar",
      last_name: "Khalil",
      phone: "+971505678901",
      email: "omar@spicekitchen.ae",
      company_name: "Spice Kitchen",
      service_area: "Deira, Bur Dubai",
      region: "Dubai",
      business_type: "Traditional Catering",
      min_guests: 15,
      max_guests: 200,
    },
    {
      first_name: "Layla",
      last_name: "Mahmoud",
      phone: "+971506789012",
      email: "layla@mediterraneantaste.ae",
      company_name: "Mediterranean Taste",
      service_area: "Jumeirah, Umm Suqeim",
      region: "Dubai",
      business_type: "Mediterranean Catering",
      min_guests: 25,
      max_guests: 400,
    },
    {
      first_name: "Youssef",
      last_name: "Nasser",
      phone: "+971507890123",
      email: "youssef@asianfusion.ae",
      company_name: "Asian Fusion Catering",
      service_area: "Dubai Media City, Internet City",
      region: "Dubai",
      business_type: "Asian Fusion",
      min_guests: 20,
      max_guests: 350,
    },
    {
      first_name: "Amina",
      last_name: "Rashid",
      phone: "+971508901234",
      email: "amina@italianbistro.ae",
      company_name: "Italian Bistro Catering",
      service_area: "Dubai Hills, Emirates Hills",
      region: "Dubai",
      business_type: "Italian Catering",
      min_guests: 30,
      max_guests: 250,
    },
    {
      first_name: "Khalid",
      last_name: "Saeed",
      phone: "+971509012345",
      email: "khalid@bbqmaster.ae",
      company_name: "BBQ Master Catering",
      service_area: "Al Barsha, Al Quoz",
      region: "Dubai",
      business_type: "BBQ & Grill",
      min_guests: 40,
      max_guests: 600,
    },
    {
      first_name: "Noor",
      last_name: "Al-Mazrouei",
      phone: "+971510123456",
      email: "noor@dessertdreams.ae",
      company_name: "Dessert Dreams Catering",
      service_area: "Sharjah, Ajman",
      region: "Sharjah",
      business_type: "Dessert & Bakery",
      min_guests: 10,
      max_guests: 150,
    },
    {
      first_name: "Tariq",
      last_name: "Haddad",
      phone: "+971511234567",
      email: "tariq@veggieparadise.ae",
      company_name: "Veggie Paradise",
      service_area: "Dubai Silicon Oasis, Academic City",
      region: "Dubai",
      business_type: "Vegetarian & Vegan",
      min_guests: 15,
      max_guests: 200,
    },
    {
      first_name: "Mariam",
      last_name: "Al-Hashimi",
      phone: "+971512345678",
      email: "mariam@seafoodspecialists.ae",
      company_name: "Seafood Specialists",
      service_area: "Dubai Creek, Old Dubai",
      region: "Dubai",
      business_type: "Seafood Catering",
      min_guests: 25,
      max_guests: 300,
    },
    {
      first_name: "Hassan",
      last_name: "Al-Otaiba",
      phone: "+971513456789",
      email: "hassan@premiumcatering.ae",
      company_name: "Premium Catering Solutions",
      service_area: "Dubai International Financial Centre",
      region: "Dubai",
      business_type: "Corporate Catering",
      min_guests: 50,
      max_guests: 500,
    },
  ];

  const caterers = [];
  for (let i = 0; i < catererData.length; i++) {
    const data = catererData[i];
    const caterer = await prisma.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        email: data.email,
        password: hashedPassword,
        company_name: data.company_name,
        type: "CATERER",
        verified: true,
        profile_completed: true,
        image_url: UNSplashImages.caterers[i],
        catererinfo: {
          create: {
            business_name: data.company_name,
            business_type: data.business_type,
            business_description: `Premium ${data.business_type.toLowerCase()} services in ${data.region}. We specialize in creating memorable dining experiences for events of all sizes.`,
            service_area: data.service_area,
            region: data.region,
            minimum_guests: data.min_guests,
            maximum_guests: data.max_guests,
            delivery_only: i % 3 === 0,
            delivery_plus_setup: i % 3 === 1,
            full_service: i % 3 === 2,
            staff: 10 + (i * 2),
            servers: 5 + i,
            food_license: `FL-${String(i + 1).padStart(4, "0")}-2024`,
            Registration: `REG-${String(i + 1).padStart(6, "0")}-UAE`,
            status: "APPROVED",
          },
        },
      },
    });
    caterers.push(caterer);
  }

  // 3. Create Cuisine Types
  console.log("🍽️ Creating cuisine types...");
  const cuisineTypes = await Promise.all([
    prisma.cuisineType.create({ data: { name: "Indian", description: "Authentic Indian cuisine with rich spices and flavors" } }),
    prisma.cuisineType.create({ data: { name: "Arabic", description: "Traditional Middle Eastern and Arabic dishes" } }),
    prisma.cuisineType.create({ data: { name: "Western", description: "European and American style cuisine" } }),
    prisma.cuisineType.create({ data: { name: "Chinese", description: "Traditional Chinese cuisine" } }),
    prisma.cuisineType.create({ data: { name: "Italian", description: "Classic Italian dishes and pasta" } }),
    prisma.cuisineType.create({ data: { name: "Mediterranean", description: "Fresh Mediterranean flavors and ingredients" } }),
    prisma.cuisineType.create({ data: { name: "Asian Fusion", description: "Modern Asian fusion cuisine" } }),
    prisma.cuisineType.create({ data: { name: "Seafood", description: "Fresh seafood specialties" } }),
  ]);

  // 4. Create Categories
  console.log("📂 Creating categories...");
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Appetizers", description: "Starters and small plates" } }),
    prisma.category.create({ data: { name: "Main Course", description: "Main dishes and entrees" } }),
    prisma.category.create({ data: { name: "Desserts", description: "Sweet treats and desserts" } }),
    prisma.category.create({ data: { name: "Beverages", description: "Drinks and refreshments" } }),
    prisma.category.create({ data: { name: "Salads", description: "Fresh salads and sides" } }),
    prisma.category.create({ data: { name: "Soups", description: "Hot and cold soups" } }),
    prisma.category.create({ data: { name: "Breads", description: "Fresh breads and flatbreads" } }),
  ]);

  // 5. Create SubCategories
  console.log("📁 Creating subcategories...");
  const subCategories = await Promise.all([
    prisma.subCategory.create({ data: { name: "Dips & Spreads", category_id: categories[0].id, description: "Hummus, baba ganoush, and other dips" } }),
    prisma.subCategory.create({ data: { name: "Finger Food", category_id: categories[0].id, description: "Small bite-sized appetizers" } }),
    prisma.subCategory.create({ data: { name: "Grilled", category_id: categories[1].id, description: "Grilled meats and vegetables" } }),
    prisma.subCategory.create({ data: { name: "Curry", category_id: categories[1].id, description: "Curry dishes" } }),
    prisma.subCategory.create({ data: { name: "Pasta", category_id: categories[1].id, description: "Pasta dishes" } }),
    prisma.subCategory.create({ data: { name: "Rice Dishes", category_id: categories[1].id, description: "Biryani, fried rice, and rice-based dishes" } }),
    prisma.subCategory.create({ data: { name: "Cakes", category_id: categories[2].id, description: "Various cake varieties" } }),
    prisma.subCategory.create({ data: { name: "Ice Cream", category_id: categories[2].id, description: "Ice cream and frozen desserts" } }),
    prisma.subCategory.create({ data: { name: "Pastries", category_id: categories[2].id, description: "Sweet pastries and baked goods" } }),
    prisma.subCategory.create({ data: { name: "Green Salads", category_id: categories[4].id, description: "Fresh green salads" } }),
    prisma.subCategory.create({ data: { name: "Fruit Salads", category_id: categories[4].id, description: "Fresh fruit salads" } }),
  ]);

  // 6. Create FreeForms
  console.log("🌿 Creating dietary restrictions...");
  const freeForms = await Promise.all([
    prisma.freeForm.create({ data: { name: "Vegan", description: "No animal products" } }),
    prisma.freeForm.create({ data: { name: "Gluten-Free", description: "No gluten-containing ingredients" } }),
    prisma.freeForm.create({ data: { name: "Halal", description: "Prepared according to Islamic dietary laws" } }),
    prisma.freeForm.create({ data: { name: "Sugar-Free", description: "No added sugar" } }),
    prisma.freeForm.create({ data: { name: "Dairy-Free", description: "No dairy products" } }),
    prisma.freeForm.create({ data: { name: "Nut-Free", description: "No nuts or nut products" } }),
  ]);

  // 7. Create Dishes (comprehensive list)
  console.log("🍲 Creating dishes...");
  const dishData = [
    // Indian dishes
    { name: "Butter Chicken", cuisine: 0, category: 1, subCategory: 3, price: 45.00, qty: 300, pieces: 1, caterer: 0 },
    { name: "Chicken Biryani", cuisine: 0, category: 1, subCategory: 5, price: 38.00, qty: 400, pieces: 1, caterer: 0 },
    { name: "Vegetable Samosa", cuisine: 0, category: 0, subCategory: 1, price: 12.00, qty: null, pieces: 2, caterer: 0 },
    { name: "Paneer Tikka", cuisine: 0, category: 0, subCategory: 2, price: 28.00, qty: 200, pieces: 4, caterer: 0 },
    { name: "Dal Makhani", cuisine: 0, category: 1, subCategory: 3, price: 25.00, qty: 250, pieces: 1, caterer: 0 },
    { name: "Gulab Jamun", cuisine: 0, category: 2, subCategory: 8, price: 15.00, qty: null, pieces: 2, caterer: 0 },
    { name: "Chicken Curry", cuisine: 0, category: 1, subCategory: 3, price: 42.00, qty: 300, pieces: 1, caterer: 0 },
    { name: "Naan Bread", cuisine: 0, category: 6, subCategory: null, price: 8.00, qty: null, pieces: 2, caterer: 0 },
    
    // Arabic dishes
    { name: "Hummus", cuisine: 1, category: 0, subCategory: 0, price: 18.00, qty: 200, pieces: 1, caterer: 1 },
    { name: "Chicken Shawarma", cuisine: 1, category: 1, subCategory: 2, price: 32.00, qty: null, pieces: 1, caterer: 1 },
    { name: "Fattoush Salad", cuisine: 1, category: 4, subCategory: 9, price: 22.00, qty: 250, pieces: 1, caterer: 1 },
    { name: "Baklava", cuisine: 1, category: 2, subCategory: 8, price: 20.00, qty: null, pieces: 3, caterer: 1 },
    { name: "Mutton Mandi", cuisine: 1, category: 1, subCategory: 5, price: 55.00, qty: 500, pieces: 1, caterer: 1 },
    { name: "Tabbouleh", cuisine: 1, category: 4, subCategory: 9, price: 20.00, qty: 200, pieces: 1, caterer: 1 },
    { name: "Kunafa", cuisine: 1, category: 2, subCategory: 8, price: 25.00, qty: null, pieces: 1, caterer: 1 },
    { name: "Lamb Kebab", cuisine: 1, category: 1, subCategory: 2, price: 48.00, qty: 300, pieces: 4, caterer: 1 },
    
    // Western dishes
    { name: "Caesar Salad", cuisine: 2, category: 4, subCategory: 9, price: 28.00, qty: 300, pieces: 1, caterer: 2 },
    { name: "Grilled Chicken Breast", cuisine: 2, category: 1, subCategory: 2, price: 42.00, qty: 250, pieces: 1, caterer: 2 },
    { name: "Chocolate Cake", cuisine: 2, category: 2, subCategory: 6, price: 35.00, qty: 150, pieces: 1, caterer: 2 },
    { name: "Beef Steak", cuisine: 2, category: 1, subCategory: 2, price: 65.00, qty: 300, pieces: 1, caterer: 2 },
    { name: "Fish & Chips", cuisine: 2, category: 1, subCategory: 2, price: 38.00, qty: 350, pieces: 1, caterer: 2 },
    { name: "Chicken Wings", cuisine: 2, category: 0, subCategory: 1, price: 32.00, qty: null, pieces: 8, caterer: 2 },
    { name: "Cheesecake", cuisine: 2, category: 2, subCategory: 6, price: 30.00, qty: 120, pieces: 1, caterer: 2 },
    
    // Chinese dishes
    { name: "Vegetable Spring Rolls", cuisine: 3, category: 0, subCategory: 1, price: 16.00, qty: null, pieces: 4, caterer: 5 },
    { name: "Chicken Fried Rice", cuisine: 3, category: 1, subCategory: 5, price: 30.00, qty: 350, pieces: 1, caterer: 5 },
    { name: "Sweet and Sour Chicken", cuisine: 3, category: 1, subCategory: null, price: 35.00, qty: 300, pieces: 1, caterer: 5 },
    { name: "Chicken Dim Sum", cuisine: 3, category: 0, subCategory: 1, price: 22.00, qty: null, pieces: 6, caterer: 5 },
    { name: "Beef Noodles", cuisine: 3, category: 1, subCategory: 4, price: 32.00, qty: 400, pieces: 1, caterer: 5 },
    { name: "Prawn Dumplings", cuisine: 3, category: 0, subCategory: 1, price: 28.00, qty: null, pieces: 4, caterer: 5 },
    
    // Italian dishes
    { name: "Bruschetta", cuisine: 4, category: 0, subCategory: 1, price: 24.00, qty: null, pieces: 4, caterer: 6 },
    { name: "Spaghetti Carbonara", cuisine: 4, category: 1, subCategory: 4, price: 40.00, qty: 300, pieces: 1, caterer: 6 },
    { name: "Tiramisu", cuisine: 4, category: 2, subCategory: 8, price: 28.00, qty: 120, pieces: 1, caterer: 6 },
    { name: "Margherita Pizza", cuisine: 4, category: 1, subCategory: null, price: 35.00, qty: null, pieces: 1, caterer: 6 },
    { name: "Lasagna", cuisine: 4, category: 1, subCategory: 4, price: 38.00, qty: 350, pieces: 1, caterer: 6 },
    { name: "Penne Arrabbiata", cuisine: 4, category: 1, subCategory: 4, price: 32.00, qty: 300, pieces: 1, caterer: 6 },
    { name: "Panna Cotta", cuisine: 4, category: 2, subCategory: 7, price: 22.00, qty: 100, pieces: 1, caterer: 6 },
    
    // Mediterranean dishes
    { name: "Greek Salad", cuisine: 5, category: 4, subCategory: 9, price: 26.00, qty: 280, pieces: 1, caterer: 4 },
    { name: "Grilled Halloumi", cuisine: 5, category: 1, subCategory: 2, price: 32.00, qty: 200, pieces: 4, caterer: 4 },
    { name: "Moussaka", cuisine: 5, category: 1, subCategory: null, price: 42.00, qty: 350, pieces: 1, caterer: 4 },
    { name: "Baba Ganoush", cuisine: 5, category: 0, subCategory: 0, price: 20.00, qty: 200, pieces: 1, caterer: 4 },
    { name: "Falafel", cuisine: 5, category: 0, subCategory: 1, price: 18.00, qty: null, pieces: 6, caterer: 4 },
    
    // Asian Fusion
    { name: "Sushi Platter", cuisine: 6, category: 1, subCategory: null, price: 55.00, qty: null, pieces: 12, caterer: 5 },
    { name: "Thai Green Curry", cuisine: 6, category: 1, subCategory: 3, price: 38.00, qty: 300, pieces: 1, caterer: 5 },
    { name: "Pad Thai", cuisine: 6, category: 1, subCategory: 4, price: 32.00, qty: 350, pieces: 1, caterer: 5 },
    { name: "Korean BBQ Beef", cuisine: 6, category: 1, subCategory: 2, price: 48.00, qty: 300, pieces: 1, caterer: 5 },
    
    // Seafood
    { name: "Grilled Salmon", cuisine: 7, category: 1, subCategory: 2, price: 52.00, qty: 300, pieces: 1, caterer: 10 },
    { name: "Fish Tacos", cuisine: 7, category: 1, subCategory: null, price: 35.00, qty: null, pieces: 3, caterer: 10 },
    { name: "Lobster Thermidor", cuisine: 7, category: 1, subCategory: null, price: 85.00, qty: 400, pieces: 1, caterer: 10 },
    { name: "Prawn Biryani", cuisine: 7, category: 1, subCategory: 5, price: 45.00, qty: 400, pieces: 1, caterer: 10 },
    { name: "Crab Cakes", cuisine: 7, category: 0, subCategory: 1, price: 38.00, qty: null, pieces: 4, caterer: 10 },
  ];

  const dishes = [];
  for (let i = 0; i < dishData.length; i++) {
    const d = dishData[i];
    const dish = await prisma.dish.create({
      data: {
        name: d.name,
        cuisine_type_id: cuisineTypes[d.cuisine].id,
        category_id: categories[d.category].id,
        sub_category_id: d.subCategory !== null ? subCategories[d.subCategory].id : null,
        caterer_id: caterers[d.caterer].id,
        price: d.price,
        quantity_in_gm: d.qty,
        pieces: d.pieces,
        is_active: true,
        image_url: UNSplashImages.dishes[i % UNSplashImages.dishes.length],
      },
    });
    dishes.push(dish);
  }

  // Link some dishes to free forms
  console.log("🔗 Linking dishes to dietary restrictions...");
  const dishFreeFormLinks = [
    { dish: "Hummus", forms: [0, 2] }, // Vegan, Halal
    { dish: "Fattoush Salad", forms: [0, 2] },
    { dish: "Greek Salad", forms: [0, 2] },
    { dish: "Vegetable Samosa", forms: [0, 2] },
    { dish: "Falafel", forms: [0, 2] },
    { dish: "Caesar Salad", forms: [1] }, // Gluten-Free
    { dish: "Baba Ganoush", forms: [0, 2] },
    { dish: "Tabbouleh", forms: [0, 2] },
  ];

  for (const link of dishFreeFormLinks) {
    const dish = dishes.find((d) => d.name === link.dish);
    if (dish) {
      for (const formIndex of link.forms) {
        await prisma.dishFreeForm.create({
          data: {
            dish_id: dish.id,
            freeform_id: freeForms[formIndex].id,
          },
        });
      }
    }
  }

  // 8. Create Package Types (4-5 options)
  console.log("📦 Creating package types...");
  const packageTypes = await Promise.all([
    prisma.packageType.create({
      data: {
        name: "Premium",
        description: "Luxury packages with premium ingredients and full service",
        image_url: UNSplashImages.packageTypes[0],
      },
    }),
    prisma.packageType.create({
      data: {
        name: "Standard",
        description: "Standard packages with quality ingredients and standard service",
        image_url: UNSplashImages.packageTypes[1],
      },
    }),
    prisma.packageType.create({
      data: {
        name: "Economy",
        description: "Budget-friendly packages perfect for small gatherings",
        image_url: UNSplashImages.packageTypes[2],
      },
    }),
    prisma.packageType.create({
      data: {
        name: "Customizable",
        description: "Flexible packages where you choose dishes from selected categories",
        image_url: UNSplashImages.packageTypes[3],
      },
    }),
    prisma.packageType.create({
      data: {
        name: "Buffet Style",
        description: "All-you-can-eat buffet with multiple options and live stations",
        image_url: UNSplashImages.packageTypes[4],
      },
    }),
  ]);

  // 9. Create Occasions
  console.log("🎉 Creating occasions...");
  const occasions = await Promise.all([
    prisma.occassion.create({ data: { name: "Wedding", description: "Wedding celebrations and receptions" } }),
    prisma.occassion.create({ data: { name: "Corporate Event", description: "Business meetings, conferences, and corporate gatherings" } }),
    prisma.occassion.create({ data: { name: "Birthday Party", description: "Birthday celebrations" } }),
    prisma.occassion.create({ data: { name: "Afternoon Tea", description: "Elegant afternoon tea service" } }),
    prisma.occassion.create({ data: { name: "Graduation", description: "Graduation ceremonies and celebrations" } }),
    prisma.occassion.create({ data: { name: "Engagement", description: "Engagement parties and celebrations" } }),
    prisma.occassion.create({ data: { name: "Anniversary", description: "Anniversary celebrations" } }),
  ]);

  // 10. Create Packages for each caterer (3-4 packages per caterer)
  console.log("🎁 Creating packages for all caterers...");
  const packageTemplates = [
    { name: "Royal Wedding Package", type: 0, people: 100, price: 8500, occasion: 0, rating: 4.8 },
    { name: "Executive Corporate Lunch", type: 1, people: 50, price: 3200, occasion: 1, rating: 4.5 },
    { name: "Kids Birthday Party Package", type: 2, people: 30, price: 1800, occasion: 2, rating: 4.7 },
    { name: "Elegant Afternoon Tea", type: 0, people: 20, price: 950, occasion: 3, rating: 4.9 },
    { name: "Graduation Celebration", type: 1, people: 60, price: 4200, occasion: 4, rating: 4.6 },
    { name: "Engagement Party Package", type: 0, people: 80, price: 6800, occasion: 5, rating: 4.8 },
    { name: "Anniversary Dinner", type: 1, people: 40, price: 2800, occasion: 6, rating: 4.7 },
    { name: "Corporate Buffet", type: 4, people: 150, price: 12000, occasion: 1, rating: 4.5 },
    { name: "Customizable Party Package", type: 3, people: 50, price: 3500, occasion: 2, rating: 4.6 },
    { name: "Premium Wedding Reception", type: 0, people: 200, price: 18000, occasion: 0, rating: 4.9 },
  ];

  const allPackages = [];
  for (let catererIndex = 0; catererIndex < caterers.length; catererIndex++) {
    const caterer = caterers[catererIndex];
    // Each caterer gets 3-4 packages
    const packagesForCaterer = Math.floor(Math.random() * 2) + 3; // 3 or 4 packages
    
    for (let pkgIndex = 0; pkgIndex < packagesForCaterer; pkgIndex++) {
      const template = packageTemplates[(catererIndex * 4 + pkgIndex) % packageTemplates.length];
      const peopleCount = template.people + Math.floor(Math.random() * 50) - 25; // Vary by ±25
      const totalPrice = template.price * (peopleCount / template.people); // Scale price
      
      const pkg = await prisma.package.create({
        data: {
          name: `${caterer.company_name} - ${template.name}`,
          people_count: peopleCount,
          package_type_id: packageTypes[template.type].id,
          cover_image_url: UNSplashImages.packages[(catererIndex * 4 + pkgIndex) % UNSplashImages.packages.length],
          total_price: totalPrice,
          caterer_id: caterer.id,
          rating: template.rating + (Math.random() * 0.3 - 0.15), // Vary rating slightly
          is_active: true,
          is_available: true,
        },
      });

      // Add 6-10 dishes to each package
      const numDishes = Math.floor(Math.random() * 5) + 6; // 6-10 dishes
      const packageItems = [];
      const usedDishIndices = new Set<number>();
      
      for (let i = 0; i < numDishes; i++) {
        let dishIndex;
        do {
          dishIndex = Math.floor(Math.random() * dishes.length);
        } while (usedDishIndices.has(dishIndex));
        usedDishIndices.add(dishIndex);
        
        const dish = dishes[dishIndex];
        const quantity = Math.floor(Math.random() * 20) + 5; // 5-25 items
        const isOptional = Math.random() > 0.7; // 30% chance of being optional
        const isAddon = Math.random() > 0.9; // 10% chance of being addon
        
        packageItems.push({
          package_id: pkg.id,
          caterer_id: caterer.id,
          dish_id: dish.id,
          people_count: peopleCount,
          quantity: quantity,
          is_optional: isOptional,
          is_addon: isAddon,
          price_at_time: dish.price,
        });
      }
      
      await prisma.packageItem.createMany({ data: packageItems });

      // Link package to occasions
      await prisma.packageOccassion.create({
        data: {
          package_id: pkg.id,
          occasion_id: occasions[template.occasion].id,
        },
      });

      // If it's a customizable package, add category selections
      if (template.type === 3) {
        await prisma.packageCategorySelection.createMany({
          data: [
            { package_id: pkg.id, category_id: categories[0].id, num_dishes_to_select: 2 }, // Appetizers: 2
            { package_id: pkg.id, category_id: categories[1].id, num_dishes_to_select: 3 }, // Main Course: 3
            { package_id: pkg.id, category_id: categories[2].id, num_dishes_to_select: 1 }, // Desserts: 1
          ],
        });
      }

      allPackages.push(pkg);
    }
  }

  // 11. Create Regular Users
  console.log("👥 Creating regular users...");
  await Promise.all([
    prisma.user.create({
      data: {
        first_name: "Sarah",
        last_name: "Johnson",
        phone: "+971504567890",
        email: "sarah.johnson@email.com",
        password: hashedPassword,
        type: "USER",
        verified: true,
      },
    }),
    prisma.user.create({
      data: {
        first_name: "David",
        last_name: "Smith",
        phone: "+971505678901",
        email: "david.smith@email.com",
        password: hashedPassword,
        type: "USER",
        verified: true,
      },
    }),
  ]);

  console.log("✅ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Admin Users: 1`);
  console.log(`   - Caterers: ${caterers.length} (all approved)`);
  console.log(`   - Regular Users: 2`);
  console.log(`   - Cuisine Types: ${cuisineTypes.length}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - SubCategories: ${subCategories.length}`);
  console.log(`   - FreeForms: ${freeForms.length}`);
  console.log(`   - Dishes: ${dishes.length}`);
  console.log(`   - Package Types: ${packageTypes.length}`);
  console.log(`   - Occasions: ${occasions.length}`);
  console.log(`   - Packages: ${allPackages.length}`);
  console.log(`   - Package Items: ~${allPackages.length * 8} (average 8 per package)`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
