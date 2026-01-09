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
  indianDishes: [
    // Salads
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop",
    // Soups
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop",
    // Appetizers
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop",
    // Main Courses
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
    // Desserts
    "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=600&fit=crop",
  ],
};

async function main() {
  console.log("🌱 Starting comprehensive seed...");

  // Clear existing data
  console.log("🧹 Cleaning existing data...");
  try {
    // Delete in order respecting foreign key constraints
    // First delete items that reference packages
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    // Then delete package-related data
    await prisma.packageOccassion.deleteMany();
    await prisma.packageCategorySelection.deleteMany();
    await prisma.packageItem.deleteMany();
    await prisma.package.deleteMany();
    // Delete other related data
    await prisma.dishFreeForm.deleteMany();
    await prisma.dish.deleteMany();
    await prisma.subCategory.deleteMany();
    await prisma.category.deleteMany();
    await prisma.freeForm.deleteMany();
    await prisma.cuisineType.deleteMany();
    await prisma.occassion.deleteMany();
    await prisma.packageType.deleteMany();
    await prisma.catererinfo.deleteMany();
    // Delete orders and carts before users
    await prisma.order.deleteMany();
    await prisma.cart.deleteMany();
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

  // 2. Create 15 Caterers (including Jehangir Restaurant with Indian Premier Buffet, Abela & Co., and The Lime Tree Cafe & Kitchen)
  // Ordered with top 3: Jehangir Restaurant (0), The Lime Tree Cafe & Kitchen (1), Abela & Co. (2)
  console.log("👥 Creating 15 caterers...");
  const catererData = [
    {
      first_name: "Jehangir",
      last_name: "Ahmed",
      phone: "+971501111111",
      email: "caterer@partyfud.ae",
      company_name: "Jehangir Restaurant",
      service_area: "Dubai",
      region: "Dubai",
      business_type: "Cafe & Kitchen",
      min_guests: 10,
      max_guests: 100,
    },
    {
      first_name: "Lime",
      last_name: "Tree",
      phone: "+971515678901",
      email: "info@limetreecafe.ae",
      company_name: "The Lime Tree Cafe & Kitchen",
      service_area: "All over UAE",
      region: "Dubai",
      business_type: "Cafe & Kitchen",
      min_guests: 10,
      max_guests: 200,
    },
    {
      first_name: "Abela",
      last_name: "Al-Rashid",
      phone: "+971514567890",
      email: "abela@abelaco.ae",
      company_name: "Abela & Co.",
      service_area: "Dubai, Abu Dhabi",
      region: "Dubai",
      business_type: "Arabic Buffet Catering",
      min_guests: 25,
      max_guests: 500,
    },
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
            business_description: i === 0
              ? `Jehangir Restaurant - A premium Cafe & Kitchen offering authentic Indian cuisine and premier buffet services in ${data.region}. We specialize in traditional Indian dishes with rich spices and flavors for events of all sizes.`
              : `Premium ${data.business_type.toLowerCase()} services in ${data.region}. We specialize in creating memorable dining experiences for events of all sizes.`,
            service_area: data.service_area,
            region: data.region,
            minimum_guests: data.min_guests,
            maximum_guests: data.max_guests,
            delivery_only: i === 0 ? true : (i % 3 === 0), // Jehangir Restaurant offers delivery
            delivery_plus_setup: i === 0 ? false : (i % 3 === 1),
            full_service: i === 0 ? false : (i % 3 === 2),
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
    prisma.cuisineType.create({ data: { name: "British", description: "Traditional British cuisine including afternoon tea and high tea" } }),
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
    prisma.subCategory.create({ data: { name: "Finger Sandwiches", category_id: categories[0].id, description: "Traditional British finger sandwiches" } }),
    prisma.subCategory.create({ data: { name: "Grilled", category_id: categories[1].id, description: "Grilled meats and vegetables" } }),
    prisma.subCategory.create({ data: { name: "Curry", category_id: categories[1].id, description: "Curry dishes" } }),
    prisma.subCategory.create({ data: { name: "Pasta", category_id: categories[1].id, description: "Pasta dishes" } }),
    prisma.subCategory.create({ data: { name: "Rice Dishes", category_id: categories[1].id, description: "Biryani, fried rice, and rice-based dishes" } }),
    prisma.subCategory.create({ data: { name: "Cakes", category_id: categories[2].id, description: "Various cake varieties" } }),
    prisma.subCategory.create({ data: { name: "Ice Cream", category_id: categories[2].id, description: "Ice cream and frozen desserts" } }),
    prisma.subCategory.create({ data: { name: "Pastries", category_id: categories[2].id, description: "Sweet pastries and baked goods" } }),
    prisma.subCategory.create({ data: { name: "Scones & Quiches", category_id: categories[4].id, description: "British scones and quiches" } }),
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
    // Indian Premier Buffet dishes for Jehangir Restaurant (caterer index 0)
    // Salads (Choose 2) - Price: 5 each
    { name: "Kachumbari Salad", cuisine: 1, category: 4, subCategory: 12, price: 5.00, qty: 200, pieces: 1, caterer: 0 },
    { name: "Fattoush", cuisine: 1, category: 4, subCategory: 12, price: 5.00, qty: 200, pieces: 1, caterer: 0 },
    { name: "Mixed Veg. Raitha", cuisine: 1, category: 4, subCategory: 12, price: 5.00, qty: 200, pieces: 1, caterer: 0 },
    { name: "Laccha pyaz", cuisine: 1, category: 4, subCategory: 12, price: 5.00, qty: 150, pieces: 1, caterer: 0 },
    { name: "Lemon", cuisine: 1, category: 4, subCategory: 12, price: 5.00, qty: null, pieces: 1, caterer: 0 },
    { name: "Green Chillies", cuisine: 1, category: 4, subCategory: 12, price: 5.00, qty: null, pieces: 1, caterer: 0 },
    { name: "Assorted Poppadum", cuisine: 1, category: 4, subCategory: 12, price: 5.00, qty: null, pieces: 4, caterer: 0 },
    { name: "Yoghart Raita", cuisine: 1, category: 4, subCategory: 12, price: 5.00, qty: 200, pieces: 1, caterer: 0 },
    // Soup - Price: 10 each
    { name: "Dal Shorba", cuisine: 1, category: 5, subCategory: null, price: 10.00, qty: 250, pieces: 1, caterer: 0 },
    { name: "Tamatar Dhaniya ka Shorba", cuisine: 1, category: 5, subCategory: null, price: 10.00, qty: 250, pieces: 1, caterer: 0 },
    // Appetizer - Price: 10 each
    { name: "Lasooni Murgh Tikka", cuisine: 1, category: 0, subCategory: 1, price: 10.00, qty: 200, pieces: 4, caterer: 0 },
    { name: "Mutton Seekh Kebab", cuisine: 1, category: 0, subCategory: 1, price: 10.00, qty: 200, pieces: 4, caterer: 0 },
    // Main Courses (Choose any 3) - Price: 20 each
    { name: "Murgh Nizami", cuisine: 1, category: 1, subCategory: 4, price: 20.00, qty: 300, pieces: 1, caterer: 0 },
    { name: "Kali Mirch ka Gosht", cuisine: 1, category: 1, subCategory: 4, price: 20.00, qty: 300, pieces: 1, caterer: 0 },
    { name: "Subz Kadai", cuisine: 1, category: 1, subCategory: 4, price: 20.00, qty: 300, pieces: 1, caterer: 0 },
    { name: "Dal Makhani", cuisine: 1, category: 1, subCategory: 4, price: 20.00, qty: 300, pieces: 1, caterer: 0 },
    { name: "Hyderabadi Murgh Biryani", cuisine: 1, category: 1, subCategory: 6, price: 20.00, qty: 400, pieces: 1, caterer: 0 },
    // Desserts - Price: 10 each
    { name: "Gajar Ka Halwa", cuisine: 1, category: 2, subCategory: 9, price: 10.00, qty: 150, pieces: 1, caterer: 0 },
    { name: "Rasmalai", cuisine: 1, category: 2, subCategory: 9, price: 10.00, qty: 120, pieces: 1, caterer: 0 },
    { name: "Gulab Jamun", cuisine: 1, category: 2, subCategory: 9, price: 10.00, qty: null, pieces: 2, caterer: 0 },

    // Other Indian dishes (caterer index 3)
    { name: "Butter Chicken", cuisine: 1, category: 1, subCategory: 4, price: 45.00, qty: 300, pieces: 1, caterer: 3 },
    { name: "Chicken Biryani", cuisine: 1, category: 1, subCategory: 6, price: 38.00, qty: 400, pieces: 1, caterer: 3 },
    { name: "Vegetable Samosa", cuisine: 1, category: 0, subCategory: 1, price: 12.00, qty: null, pieces: 2, caterer: 3 },
    { name: "Paneer Tikka", cuisine: 1, category: 0, subCategory: 1, price: 28.00, qty: 200, pieces: 4, caterer: 3 },
    { name: "Dal Makhani", cuisine: 1, category: 1, subCategory: 4, price: 25.00, qty: 250, pieces: 1, caterer: 3 },
    { name: "Gulab Jamun", cuisine: 1, category: 2, subCategory: 9, price: 15.00, qty: null, pieces: 2, caterer: 3 },
    { name: "Chicken Curry", cuisine: 1, category: 1, subCategory: 4, price: 42.00, qty: 300, pieces: 1, caterer: 3 },
    { name: "Naan Bread", cuisine: 1, category: 6, subCategory: null, price: 8.00, qty: null, pieces: 2, caterer: 3 },

    // Arabic dishes (caterer index 4)
    { name: "Hummus", cuisine: 2, category: 0, subCategory: 0, price: 18.00, qty: 200, pieces: 1, caterer: 4 },
    { name: "Chicken Shawarma", cuisine: 2, category: 1, subCategory: 3, price: 32.00, qty: null, pieces: 1, caterer: 4 },
    { name: "Fattoush Salad", cuisine: 2, category: 4, subCategory: 12, price: 22.00, qty: 250, pieces: 1, caterer: 4 },
    { name: "Baklava", cuisine: 2, category: 2, subCategory: 9, price: 20.00, qty: null, pieces: 3, caterer: 4 },
    { name: "Mutton Mandi", cuisine: 2, category: 1, subCategory: 6, price: 55.00, qty: 500, pieces: 1, caterer: 4 },
    { name: "Tabbouleh", cuisine: 2, category: 4, subCategory: 12, price: 20.00, qty: 200, pieces: 1, caterer: 4 },
    { name: "Kunafa", cuisine: 2, category: 2, subCategory: 9, price: 25.00, qty: null, pieces: 1, caterer: 4 },
    { name: "Lamb Kebab", cuisine: 2, category: 1, subCategory: 3, price: 48.00, qty: 300, pieces: 4, caterer: 4 },

    // Western dishes (caterer index 5)
    { name: "Caesar Salad", cuisine: 3, category: 4, subCategory: 12, price: 28.00, qty: 300, pieces: 1, caterer: 5 },
    { name: "Grilled Chicken Breast", cuisine: 3, category: 1, subCategory: 3, price: 42.00, qty: 250, pieces: 1, caterer: 5 },
    { name: "Chocolate Cake", cuisine: 3, category: 2, subCategory: 7, price: 35.00, qty: 150, pieces: 1, caterer: 5 },
    { name: "Beef Steak", cuisine: 3, category: 1, subCategory: 3, price: 65.00, qty: 300, pieces: 1, caterer: 5 },
    { name: "Fish & Chips", cuisine: 3, category: 1, subCategory: 3, price: 38.00, qty: 350, pieces: 1, caterer: 5 },
    { name: "Chicken Wings", cuisine: 3, category: 0, subCategory: 1, price: 32.00, qty: null, pieces: 8, caterer: 5 },
    { name: "Cheesecake", cuisine: 3, category: 2, subCategory: 7, price: 30.00, qty: 120, pieces: 1, caterer: 5 },

    // Chinese dishes (caterer index 7)
    { name: "Vegetable Spring Rolls", cuisine: 4, category: 0, subCategory: 1, price: 16.00, qty: null, pieces: 4, caterer: 7 },
    { name: "Chicken Fried Rice", cuisine: 4, category: 1, subCategory: 6, price: 30.00, qty: 350, pieces: 1, caterer: 7 },
    { name: "Sweet and Sour Chicken", cuisine: 4, category: 1, subCategory: null, price: 35.00, qty: 300, pieces: 1, caterer: 7 },
    { name: "Chicken Dim Sum", cuisine: 4, category: 0, subCategory: 1, price: 22.00, qty: null, pieces: 6, caterer: 7 },
    { name: "Beef Noodles", cuisine: 4, category: 1, subCategory: 5, price: 32.00, qty: 400, pieces: 1, caterer: 7 },
    { name: "Prawn Dumplings", cuisine: 4, category: 0, subCategory: 1, price: 28.00, qty: null, pieces: 4, caterer: 7 },

    // Italian dishes (caterer index 8)
    { name: "Bruschetta", cuisine: 5, category: 0, subCategory: 1, price: 24.00, qty: null, pieces: 4, caterer: 8 },
    { name: "Spaghetti Carbonara", cuisine: 5, category: 1, subCategory: 5, price: 40.00, qty: 300, pieces: 1, caterer: 8 },
    { name: "Tiramisu", cuisine: 5, category: 2, subCategory: 9, price: 28.00, qty: 120, pieces: 1, caterer: 8 },
    { name: "Margherita Pizza", cuisine: 5, category: 1, subCategory: null, price: 35.00, qty: null, pieces: 1, caterer: 8 },
    { name: "Lasagna", cuisine: 5, category: 1, subCategory: 5, price: 38.00, qty: 350, pieces: 1, caterer: 8 },
    { name: "Penne Arrabbiata", cuisine: 5, category: 1, subCategory: 5, price: 32.00, qty: 300, pieces: 1, caterer: 8 },
    { name: "Panna Cotta", cuisine: 5, category: 2, subCategory: 8, price: 22.00, qty: 100, pieces: 1, caterer: 8 },

    // Mediterranean dishes (caterer index 6)
    { name: "Greek Salad", cuisine: 6, category: 4, subCategory: 12, price: 26.00, qty: 280, pieces: 1, caterer: 6 },
    { name: "Grilled Halloumi", cuisine: 6, category: 1, subCategory: 3, price: 32.00, qty: 200, pieces: 4, caterer: 6 },
    { name: "Moussaka", cuisine: 6, category: 1, subCategory: null, price: 42.00, qty: 350, pieces: 1, caterer: 6 },
    { name: "Baba Ganoush", cuisine: 6, category: 0, subCategory: 0, price: 20.00, qty: 200, pieces: 1, caterer: 6 },
    { name: "Falafel", cuisine: 6, category: 0, subCategory: 1, price: 18.00, qty: null, pieces: 6, caterer: 6 },

    // Asian Fusion (caterer index 7)
    { name: "Sushi Platter", cuisine: 7, category: 1, subCategory: null, price: 55.00, qty: null, pieces: 12, caterer: 7 },
    { name: "Thai Green Curry", cuisine: 7, category: 1, subCategory: 4, price: 38.00, qty: 300, pieces: 1, caterer: 7 },
    { name: "Pad Thai", cuisine: 7, category: 1, subCategory: 5, price: 32.00, qty: 350, pieces: 1, caterer: 7 },
    { name: "Korean BBQ Beef", cuisine: 7, category: 1, subCategory: 3, price: 48.00, qty: 300, pieces: 1, caterer: 7 },

    // Seafood (caterer index 12)
    { name: "Grilled Salmon", cuisine: 8, category: 1, subCategory: 3, price: 52.00, qty: 300, pieces: 1, caterer: 12 },
    { name: "Fish Tacos", cuisine: 8, category: 1, subCategory: null, price: 35.00, qty: null, pieces: 3, caterer: 12 },
    { name: "Lobster Thermidor", cuisine: 8, category: 1, subCategory: null, price: 85.00, qty: 400, pieces: 1, caterer: 12 },
    { name: "Prawn Biryani", cuisine: 8, category: 1, subCategory: 6, price: 45.00, qty: 400, pieces: 1, caterer: 12 },
    { name: "Crab Cakes", cuisine: 8, category: 0, subCategory: 1, price: 38.00, qty: null, pieces: 4, caterer: 12 },

    // Arabic Buffet by Abela & Co. (caterer index 2)
    // Salad (Choose 2)
    { name: "Hummos", cuisine: 2, category: 4, subCategory: 12, price: 15.00, qty: 200, pieces: 1, caterer: 2 },
    { name: "Moutable", cuisine: 2, category: 4, subCategory: 12, price: 15.00, qty: 200, pieces: 1, caterer: 2 },
    { name: "Tabouleh", cuisine: 2, category: 4, subCategory: 12, price: 15.00, qty: 200, pieces: 1, caterer: 2 },
    { name: "Suffed Baby Marrow Bil Zeit", cuisine: 2, category: 4, subCategory: 12, price: 18.00, qty: 200, pieces: 1, caterer: 2 },
    { name: "Grilled baby corn salad with feta cheese", cuisine: 2, category: 4, subCategory: 12, price: 20.00, qty: 250, pieces: 1, caterer: 2 },
    { name: "Sausage & Cabbage Salad", cuisine: 2, category: 4, subCategory: 12, price: 18.00, qty: 200, pieces: 1, caterer: 2 },
    // Main
    { name: "Lasagna Verdi", cuisine: 5, category: 1, subCategory: 5, price: 35.00, qty: 300, pieces: 1, caterer: 2 },
    { name: "Mandi Chicken", cuisine: 2, category: 1, subCategory: 6, price: 45.00, qty: 400, pieces: 1, caterer: 2 },
    { name: "Chicken Tikka Masala", cuisine: 1, category: 1, subCategory: 4, price: 38.00, qty: 300, pieces: 1, caterer: 2 },
    { name: "Vegetable Fried Rice", cuisine: 4, category: 1, subCategory: 6, price: 25.00, qty: 350, pieces: 1, caterer: 2 },
    { name: "Beef Strognaoff", cuisine: 3, category: 1, subCategory: 5, price: 48.00, qty: 300, pieces: 1, caterer: 2 },
    { name: "Grilled Hamour With Lemo & Butter Sauce", cuisine: 8, category: 1, subCategory: 3, price: 55.00, qty: 300, pieces: 1, caterer: 2 },
    { name: "Stir Fried Vegetable", cuisine: 4, category: 1, subCategory: null, price: 22.00, qty: 250, pieces: 1, caterer: 2 },
    { name: "Kobeda Kebab", cuisine: 2, category: 1, subCategory: 3, price: 42.00, qty: 300, pieces: 4, caterer: 2 },
    // Dessert
    { name: "Umm Ali", cuisine: 2, category: 2, subCategory: 9, price: 18.00, qty: 150, pieces: 1, caterer: 2 },
    { name: "Cream Caramel", cuisine: 5, category: 2, subCategory: 9, price: 20.00, qty: 120, pieces: 1, caterer: 2 },
    { name: "Rasmalai", cuisine: 1, category: 2, subCategory: 9, price: 22.00, qty: 120, pieces: 1, caterer: 2 },
    { name: "Exotic Fresh Fruit Slices", cuisine: 2, category: 2, subCategory: null, price: 25.00, qty: 300, pieces: 1, caterer: 2 },
    // Beverages
    { name: "Assorted Soft Drinks", cuisine: 2, category: 3, subCategory: null, price: 8.00, qty: null, pieces: 1, caterer: 2 },
    { name: "Mineral Water", cuisine: 2, category: 3, subCategory: null, price: 5.00, qty: null, pieces: 1, caterer: 2 },

    // The Lime Tree Cafe & Kitchen - Traditional Afternoon Tea (caterer index 1)
    // Finger Sandwiches (Choose any 3) - Price: 10 each
    { name: "Egg and Cress", cuisine: 3, category: 0, subCategory: 2, price: 10.00, qty: null, pieces: 2, caterer: 1 },
    { name: "Tuna and Sweetcorn", cuisine: 3, category: 0, subCategory: 2, price: 10.00, qty: null, pieces: 2, caterer: 1 },
    { name: "Beef and Horseradish", cuisine: 3, category: 0, subCategory: 2, price: 10.00, qty: null, pieces: 2, caterer: 1 },
    { name: "Cucumber and Cream Cheese", cuisine: 3, category: 0, subCategory: 2, price: 10.00, qty: null, pieces: 2, caterer: 1 },
    { name: "Ham and Cheese", cuisine: 3, category: 0, subCategory: 2, price: 10.00, qty: null, pieces: 2, caterer: 1 },
    { name: "Ham and Mustard", cuisine: 3, category: 0, subCategory: 2, price: 10.00, qty: null, pieces: 2, caterer: 1 },
    { name: "Smoked Salmon and Cream Cheese", cuisine: 3, category: 0, subCategory: 2, price: 10.00, qty: null, pieces: 2, caterer: 1 },
    { name: "Cheese and Tomato", cuisine: 3, category: 0, subCategory: 2, price: 10.00, qty: null, pieces: 2, caterer: 1 },
    // Side Dish (Choose 3) - Price: 15 each
    { name: "Scones with Clotted Cream and Jam", cuisine: 3, category: 0, subCategory: 10, price: 15.00, qty: null, pieces: 2, caterer: 1 },
    { name: "Pork Sausage Rolls", cuisine: 3, category: 0, subCategory: 1, price: 15.00, qty: null, pieces: 4, caterer: 1 },
    { name: "Ham and Leek Quiche", cuisine: 3, category: 0, subCategory: 10, price: 15.00, qty: null, pieces: 1, caterer: 1 },
    { name: "Broccoli and Asparagus Quiche", cuisine: 3, category: 0, subCategory: 10, price: 15.00, qty: null, pieces: 1, caterer: 1 },
    // Dessert (Choose 1) - Price: 15 each
    { name: "Victoria Sponge Cake", cuisine: 3, category: 2, subCategory: 7, price: 15.00, qty: 150, pieces: 1, caterer: 1 },
    { name: "Chocolate Brownie", cuisine: 3, category: 2, subCategory: 7, price: 15.00, qty: 120, pieces: 1, caterer: 1 },
    { name: "Battenberg", cuisine: 3, category: 2, subCategory: 9, price: 15.00, qty: null, pieces: 4, caterer: 1 },
    { name: "Lemon Drizzle Cake", cuisine: 3, category: 2, subCategory: 7, price: 15.00, qty: 150, pieces: 1, caterer: 1 },
    { name: "Coffee Cake", cuisine: 3, category: 2, subCategory: 7, price: 15.00, qty: 150, pieces: 1, caterer: 1 },
    // Drinks (Choose 1) - Price: 10 each
    { name: "Americano / Black Coffee", cuisine: 3, category: 3, subCategory: null, price: 10.00, qty: null, pieces: 1, caterer: 1 },
    { name: "British High Tea", cuisine: 3, category: 3, subCategory: null, price: 10.00, qty: null, pieces: 1, caterer: 1 },
    { name: "Green Tea / Camomile / Mint Tea", cuisine: 3, category: 3, subCategory: null, price: 10.00, qty: null, pieces: 1, caterer: 1 },
  ];

  type DishType = {
    id: string;
    name: string;
    caterer_id: string | null;
    price: any;
    category_id: string;
    pieces?: number | null;
    quantity_in_gm?: number | null;
    [key: string]: any; // Allow other properties
  };

  const dishes: DishType[] = [];
  // Organize dishes by caterer for easy access later
  const dishesByCaterer: { [catererIndex: number]: DishType[] } = {};

  for (let i = 0; i < dishData.length; i++) {
    const d = dishData[i];
    // Use Indian dishes images for first 18 dishes (Indian Premier Buffet items for Jehangir Restaurant)
    let imageUrl;
    if (i < 18 && d.caterer === 0) {
      imageUrl = UNSplashImages.indianDishes[i % UNSplashImages.indianDishes.length];
    } else {
      imageUrl = UNSplashImages.dishes[(i - 18) % UNSplashImages.dishes.length];
    }

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
        image_url: imageUrl,
      },
    });
    dishes.push(dish);

    // Organize by caterer
    if (!dishesByCaterer[d.caterer]) {
      dishesByCaterer[d.caterer] = [];
    }
    dishesByCaterer[d.caterer].push(dish);
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
    // Arabic Buffet by Abela & Co. dishes
    { dish: "Hummos", forms: [0, 2] }, // Vegetarian, Vegan, Halal (assuming Vegan includes vegetarian)
    { dish: "Moutable", forms: [0, 2] }, // Vegetarian, Vegan, Halal
    { dish: "Tabouleh", forms: [0, 2] }, // Vegetarian, Vegan, Halal
    { dish: "Suffed Baby Marrow Bil Zeit", forms: [0, 2] }, // Vegetarian, Vegan, Halal
    { dish: "Grilled baby corn salad with feta cheese", forms: [2] }, // Vegetarian, Halal (not vegan due to feta)
    { dish: "Sausage & Cabbage Salad", forms: [2] }, // Halal
    // The Lime Tree Cafe & Kitchen - Traditional Afternoon Tea dishes
    { dish: "Egg and Cress", forms: [0, 2] }, // Vegetarian, Vegan
    { dish: "Cucumber and Cream Cheese", forms: [2] }, // Vegetarian (not vegan due to cream cheese)
    { dish: "Cheese and Tomato", forms: [2] }, // Vegetarian (not vegan due to cheese)
    { dish: "Broccoli and Asparagus Quiche", forms: [0, 2] }, // Vegetarian, Vegan (assuming no animal products)
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
    prisma.occassion.create({
      data: {
        name: "Arabic Theme Night",
        description: "Authentic Arabic buffet experience with traditional Middle Eastern cuisine",
        image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop"
      }
    }),
    prisma.occassion.create({
      data: {
        name: "Traditional afternoon tea",
        description: "Elegant traditional afternoon tea service with finger sandwiches, scones, and pastries",
        image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
      }
    }),
    prisma.occassion.create({
      data: {
        name: "Indian Buffet",
        description: "Authentic Indian buffet experience with traditional Indian cuisine and premier buffet services",
        image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop"
      }
    }),
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

    // Special handling for first caterer (Jehangir Restaurant - Indian Premier Buffet)
    if (catererIndex === 0) {
      // Create the Indian Premier Buffet package
      const indianDishes = dishes.slice(0, 18); // First 18 dishes are Indian Premier Buffet
      const peopleCount = 25;
      // Price: 2500 for 25 people = 100 per person
      const pricePerPerson = 100;
      const totalPrice = pricePerPerson * peopleCount;

      const indianPackage = await prisma.package.create({
        data: {
          name: "Jehangir Restaurant - Indian Premier Buffet",
          people_count: peopleCount,
          package_type_id: packageTypes[3].id, // Customizable package type
          cover_image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
          total_price: totalPrice,
          caterer_id: caterer.id,
          rating: 4.9,
          is_active: true,
          is_available: true,
          customisation_type: "FIXED", // FIXED package with category selection limits
        },
      });

      // Add all Indian dishes to the package
      const packageItems = [];
      for (const dish of indianDishes) {
        // Salads and Main Courses are optional selections (Choose 2 salads, Choose 3 main courses)
        const isOptional = dish.category_id === categories[4].id || dish.category_id === categories[1].id;
        packageItems.push({
          package_id: indianPackage.id,
          caterer_id: caterer.id,
          dish_id: dish.id,
          people_count: peopleCount,
          quantity: dish.pieces || 1,
          is_optional: isOptional,
          is_addon: false,
          price_at_time: dish.price,
        });
      }
      await prisma.packageItem.createMany({ data: packageItems });

      // Link to Indian Buffet occasion (index 9)
      await prisma.packageOccassion.create({
        data: {
          package_id: indianPackage.id,
          occasion_id: occasions[9].id, // Indian Buffet
        },
      });

      // Add category selections for FIXED package (only FIXED packages have category limits)
      await prisma.packageCategorySelection.createMany({
        data: [
          { package_id: indianPackage.id, category_id: categories[4].id, num_dishes_to_select: 2 }, // Salads: Choose 2
          { package_id: indianPackage.id, category_id: categories[1].id, num_dishes_to_select: 3 }, // Main Courses: Choose 3
          { package_id: indianPackage.id, category_id: categories[0].id, num_dishes_to_select: 1 }, // Appetizers: Choose 1
          { package_id: indianPackage.id, category_id: categories[5].id, num_dishes_to_select: 1 }, // Soups: Choose 1
          { package_id: indianPackage.id, category_id: categories[2].id, num_dishes_to_select: 1 }, // Desserts: Choose 1
        ],
      });

      allPackages.push(indianPackage);

      // Add 2-3 more regular packages for this caterer
      const additionalPackages = Math.floor(Math.random() * 2) + 2; // 2 or 3 packages
      for (let pkgIndex = 0; pkgIndex < additionalPackages; pkgIndex++) {
        const template = packageTemplates[(pkgIndex + 1) % packageTemplates.length];
        const peopleCount = template.people + Math.floor(Math.random() * 50) - 25;
        const totalPrice = template.price * (peopleCount / template.people);

        // Determine customisation type based on package type
        // template.type === 3 means "Customizable" package type, but we want it to be CUSTOMISABLE customisation_type
        // Other package types should be FIXED
        const customisationType = template.type === 3 ? "CUSTOMISABLE" : "FIXED";

        const pkg = await prisma.package.create({
          data: {
            name: `${caterer.company_name} - ${template.name}`,
            people_count: peopleCount,
            package_type_id: packageTypes[template.type].id,
            cover_image_url: UNSplashImages.packages[(pkgIndex) % UNSplashImages.packages.length],
            total_price: totalPrice,
            caterer_id: caterer.id,
            rating: template.rating + (Math.random() * 0.3 - 0.15),
            is_active: true,
            is_available: true,
            customisation_type: customisationType,
          },
        });

        // Get only this caterer's dishes (excluding Indian Premier Buffet dishes which are already used)
        const catererDishes = dishesByCaterer[0] || [];
        const availableDishes = catererDishes.filter(d => !indianDishes.find(id => id.id === d.id));

        // Ensure we have enough dishes
        if (availableDishes.length === 0) {
          console.warn(`⚠️  Warning: Caterer ${caterer.company_name} has no additional dishes for package ${pkg.name}`);
        }

        // Add dishes to package (only from this caterer, skip Indian Premier Buffet dishes)
        const numDishes = Math.min(Math.floor(Math.random() * 5) + 6, availableDishes.length);
        const packageItems = [];
        const usedDishIds = new Set<string>();

        // Shuffle available dishes for random selection
        const shuffledDishes = [...availableDishes].sort(() => Math.random() - 0.5);

        for (let i = 0; i < numDishes && i < shuffledDishes.length; i++) {
          const dish = shuffledDishes[i];

          // Skip if already used
          if (usedDishIds.has(dish.id)) continue;
          usedDishIds.add(dish.id);

          // Double-check dish belongs to this caterer
          if (dish.caterer_id !== caterer.id) {
            console.warn(`⚠️  Warning: Dish ${dish.name} does not belong to caterer ${caterer.company_name}`);
            continue;
          }

          const quantity = Math.floor(Math.random() * 20) + 5;
          const isOptional = Math.random() > 0.7;
          const isAddon = Math.random() > 0.9;

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

        if (packageItems.length === 0) {
          console.warn(`⚠️  Warning: No dishes added to package ${pkg.name} for caterer ${caterer.company_name}`);
        } else {
          await prisma.packageItem.createMany({ data: packageItems });
        }

        await prisma.packageOccassion.create({
          data: {
            package_id: pkg.id,
            occasion_id: occasions[template.occasion].id,
          },
        });

        // Only add category selections for FIXED packages (not CUSTOMISABLE)
        // CUSTOMISABLE packages allow unlimited selection, so no limits needed
        if (customisationType === "FIXED" && Math.random() > 0.5) {
          // Randomly add category selections to some FIXED packages to demonstrate the feature
          const selections = [];
          if (Math.random() > 0.3) {
            selections.push({ package_id: pkg.id, category_id: categories[0].id, num_dishes_to_select: Math.floor(Math.random() * 2) + 1 }); // Appetizers: 1-2
          }
          if (Math.random() > 0.3) {
            selections.push({ package_id: pkg.id, category_id: categories[1].id, num_dishes_to_select: Math.floor(Math.random() * 2) + 1 }); // Main Course: 1-2
          }
          if (Math.random() > 0.3) {
            selections.push({ package_id: pkg.id, category_id: categories[2].id, num_dishes_to_select: 1 }); // Desserts: 1
          }
          if (selections.length > 0) {
            await prisma.packageCategorySelection.createMany({ data: selections });
          }
        }

        allPackages.push(pkg);
      }
      continue; // Skip to next caterer
    }

    // Special handling for Abela & Co. (caterer index 2) - Arabic Buffet
    if (catererIndex === 2) {
      // Get all Abela & Co. dishes
      const abelaDishes = dishesByCaterer[2] || [];

      if (abelaDishes.length === 0) {
        console.warn(`⚠️  Warning: Abela & Co. has no dishes for Arabic Buffet package`);
        continue;
      }

      // Create the Arabic Buffet package
      const peopleCount = 35;
      const pricePerPerson = 110;
      const totalPrice = pricePerPerson * peopleCount;

      const arabicBuffetPackage = await prisma.package.create({
        data: {
          name: "Arabic Buffet by Abela & Co.",
          people_count: peopleCount,
          package_type_id: packageTypes[3].id, // Customizable package type
          cover_image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop",
          total_price: totalPrice,
          caterer_id: caterer.id,
          rating: 4.8,
          is_active: true,
          is_available: true,
          customisation_type: "CUSTOMISABLE",
        },
      });

      // Add all Abela & Co. dishes to the package
      const packageItems = [];
      for (const dish of abelaDishes) {
        // Salad items are optional selections (Choose 2)
        const isOptional = dish.category_id === categories[4].id; // Salads category
        packageItems.push({
          package_id: arabicBuffetPackage.id,
          caterer_id: caterer.id,
          dish_id: dish.id,
          people_count: peopleCount,
          quantity: dish.pieces || 1,
          is_optional: isOptional,
          is_addon: false,
          price_at_time: dish.price,
        });
      }
      await prisma.packageItem.createMany({ data: packageItems });

      // Link to Arabic Theme Night occasion (index 7)
      await prisma.packageOccassion.create({
        data: {
          package_id: arabicBuffetPackage.id,
          occasion_id: occasions[7].id, // Arabic Theme Night
        },
      });

      // CUSTOMISABLE packages don't have category selection limits - users can select unlimited items
      // No category selections needed for CUSTOMISABLE packages

      allPackages.push(arabicBuffetPackage);
      continue; // Skip to next caterer - no additional packages for Abela & Co.
    }

    // Special handling for The Lime Tree Cafe & Kitchen (caterer index 1) - Traditional Afternoon Tea
    if (catererIndex === 1) {
      // Get all The Lime Tree Cafe & Kitchen dishes
      const limeTreeDishes = dishesByCaterer[1] || [];

      if (limeTreeDishes.length === 0) {
        console.warn(`⚠️  Warning: The Lime Tree Cafe & Kitchen has no dishes for Traditional Afternoon Tea package`);
        continue;
      }

      // Create the Traditional Afternoon Tea package
      // Calculate price: Choose 3 sandwiches (10 each) + 3 side dishes (15 each) + 1 dessert (15) + 1 drink (10) = 30 + 45 + 15 + 10 = 100 per person
      const peopleCount = 25; // Default for afternoon tea
      const pricePerPerson = 100;
      const totalPrice = pricePerPerson * peopleCount;

      const afternoonTeaPackage = await prisma.package.create({
        data: {
          name: "The Lime Tree Cafe & Kitchen - Traditional Afternoon Tea",
          people_count: peopleCount,
          package_type_id: packageTypes[3].id, // Customizable package type
          cover_image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
          total_price: totalPrice,
          caterer_id: caterer.id,
          rating: 4.8,
          is_active: true,
          is_available: true,
          customisation_type: "CUSTOMISABLE",
        },
      });

      // Add all The Lime Tree Cafe & Kitchen dishes to the package
      const packageItems = [];
      for (const dish of limeTreeDishes) {
        // Finger Sandwiches, Side Dish, Dessert, and Drinks are optional selections
        const isOptional = dish.category_id === categories[0].id || // Appetizers (Finger Sandwiches and Side Dish)
          dish.category_id === categories[2].id || // Desserts
          dish.category_id === categories[3].id;   // Beverages (Drinks)

        packageItems.push({
          package_id: afternoonTeaPackage.id,
          caterer_id: caterer.id,
          dish_id: dish.id,
          people_count: peopleCount,
          quantity: dish.pieces || 1,
          is_optional: isOptional,
          is_addon: false,
          price_at_time: dish.price,
        });
      }
      await prisma.packageItem.createMany({ data: packageItems });

      // Link to Traditional afternoon tea occasion (index 8)
      await prisma.packageOccassion.create({
        data: {
          package_id: afternoonTeaPackage.id,
          occasion_id: occasions[8].id, // Traditional afternoon tea
        },
      });

      // CUSTOMISABLE packages don't have category selection limits - users can select unlimited items
      // No category selections needed for CUSTOMISABLE packages

      allPackages.push(afternoonTeaPackage);
      continue; // Skip to next caterer - no additional packages for The Lime Tree Cafe & Kitchen
    }

    // Each other caterer gets 3-4 packages
    const packagesForCaterer = Math.floor(Math.random() * 2) + 3; // 3 or 4 packages

    for (let pkgIndex = 0; pkgIndex < packagesForCaterer; pkgIndex++) {
      const template = packageTemplates[((catererIndex - 1) * 4 + pkgIndex) % packageTemplates.length];
      const peopleCount = template.people + Math.floor(Math.random() * 50) - 25; // Vary by ±25
      const totalPrice = template.price * (peopleCount / template.people); // Scale price

      // Determine customisation type based on package type
      // template.type === 3 means "Customizable" package type, should be CUSTOMISABLE customisation_type
      // Other package types should be FIXED
      const customisationType = template.type === 3 ? "CUSTOMISABLE" : "FIXED";

      const pkg = await prisma.package.create({
        data: {
          name: `${caterer.company_name} - ${template.name}`,
          people_count: peopleCount,
          package_type_id: packageTypes[template.type].id,
          cover_image_url: UNSplashImages.packages[((catererIndex - 1) * 4 + pkgIndex) % UNSplashImages.packages.length],
          total_price: totalPrice,
          caterer_id: caterer.id,
          rating: template.rating + (Math.random() * 0.3 - 0.15), // Vary rating slightly
          is_active: true,
          is_available: true,
          customisation_type: customisationType,
        },
      });

      // Get only this caterer's dishes
      const catererDishes = dishesByCaterer[catererIndex] || [];

      // Ensure we have enough dishes
      if (catererDishes.length === 0) {
        console.warn(`⚠️  Warning: Caterer ${caterer.company_name} has no dishes for package ${pkg.name}`);
        continue;
      }

      // Add 6-10 dishes to each package (only from this caterer)
      const numDishes = Math.min(Math.floor(Math.random() * 5) + 6, catererDishes.length); // 6-10 dishes, max available
      const packageItems = [];
      const usedDishIds = new Set<string>();

      // Shuffle caterer's dishes for random selection
      const shuffledDishes = [...catererDishes].sort(() => Math.random() - 0.5);

      for (let i = 0; i < numDishes && i < shuffledDishes.length; i++) {
        const dish = shuffledDishes[i];

        // Skip if already used
        if (usedDishIds.has(dish.id)) continue;
        usedDishIds.add(dish.id);

        // Double-check dish belongs to this caterer
        if (dish.caterer_id !== caterer.id) {
          console.warn(`⚠️  Warning: Dish ${dish.name} does not belong to caterer ${caterer.company_name}`);
          continue;
        }

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

      if (packageItems.length === 0) {
        console.warn(`⚠️  Warning: No dishes added to package ${pkg.name} for caterer ${caterer.company_name}`);
      } else {
        await prisma.packageItem.createMany({ data: packageItems });
      }

      // Link package to occasions
      await prisma.packageOccassion.create({
        data: {
          package_id: pkg.id,
          occasion_id: occasions[template.occasion].id,
        },
      });

      // Only add category selections for FIXED packages (not CUSTOMISABLE)
      // CUSTOMISABLE packages allow unlimited selection, so no limits needed
      if (customisationType === "FIXED" && Math.random() > 0.5) {
        // Randomly add category selections to some FIXED packages to demonstrate the feature
        const selections = [];
        if (Math.random() > 0.3) {
          selections.push({ package_id: pkg.id, category_id: categories[0].id, num_dishes_to_select: Math.floor(Math.random() * 2) + 1 }); // Appetizers: 1-2
        }
        if (Math.random() > 0.3) {
          selections.push({ package_id: pkg.id, category_id: categories[1].id, num_dishes_to_select: Math.floor(Math.random() * 2) + 1 }); // Main Course: 1-2
        }
        if (Math.random() > 0.3) {
          selections.push({ package_id: pkg.id, category_id: categories[2].id, num_dishes_to_select: 1 }); // Desserts: 1
        }
        if (selections.length > 0) {
          await prisma.packageCategorySelection.createMany({ data: selections });
        }
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
        email: "user@partyfud.ae",
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
  console.log(`   - Caterers: ${caterers.length} (all approved, including Jehangir Restaurant with Indian Premier Buffet, Abela & Co. with Arabic Buffet, and The Lime Tree Cafe & Kitchen with Traditional Afternoon Tea)`);
  console.log(`   - Regular Users: 2`);
  console.log(`   - Cuisine Types: ${cuisineTypes.length}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - SubCategories: ${subCategories.length}`);
  console.log(`   - FreeForms: ${freeForms.length}`);
  console.log(`   - Dishes: ${dishes.length}`);
  console.log(`   - Package Types: ${packageTypes.length}`);
  console.log(`   - Occasions: ${occasions.length} (including Arabic Theme Night, Traditional afternoon tea, and Indian Buffet)`);
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
