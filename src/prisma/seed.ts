import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

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

async function main() {
  console.log("🌱 Starting database seed from exported data...");

  // Clear existing data
  console.log("🧹 Cleaning existing data...");
  try {
    // Delete in order respecting foreign key constraints
    await prisma.proposal.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
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
    await prisma.catererCertification.deleteMany();
    await prisma.certification.deleteMany();
    await prisma.catererinfo.deleteMany();
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

  // 1. Create Users
  console.log("👤 Creating users...");
  await prisma.user.create({
    data: {
      id: "0b5a47b0-6e4c-49d8-be85-83b4ce0c3ba8",
      first_name: "Ahmed",
      last_name: "Al-Mansoori",
      phone: "+971501234567",
      email: "admin@partyfud.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: null,
      image_url: null,
      profile_completed: true,
      verified: true,
      type: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      id: "ec834308-57dc-45df-b7e1-3c49f0822e58",
      first_name: "Sarah",
      last_name: "Johnson",
      phone: "+971504567890",
      email: "user@partyfud.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: null,
      image_url: null,
      profile_completed: false,
      verified: true,
      type: "USER",
    },
  });

  await prisma.user.create({
    data: {
      id: "68938fc4-7de4-41bc-8f2b-96e6d8cbfd77",
      first_name: "David",
      last_name: "Smith",
      phone: "+971505678901",
      email: "david.smith@email.com",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: null,
      image_url: null,
      profile_completed: false,
      verified: true,
      type: "USER",
    },
  });

  await prisma.user.create({
    data: {
      id: "874c8acd-1ef6-4379-b087-9e0b0dbc5b49",
      first_name: "Dipesh",
      last_name: "Savani",
      phone: "0585302928",
      email: "dsavani1111@hotmail.com",
      password: "\$2b\$10\$1TisWCK9Kh082DOqUxlBkO4/Z5EUwtOG6eoRT/Da06zpzp9AINMOu",
      company_name: null,
      image_url: null,
      profile_completed: false,
      verified: false,
      type: "USER",
    },
  });

  // 2. Create Caterers with catererinfo
  console.log("👥 Creating caterers...");
  await prisma.user.create({
    data: {
      id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      first_name: "Lime",
      last_name: "Tree",
      phone: "+971515678901",
      email: "info@limetreecafe.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "The Lime Tree Cafe & Kitchen",
      image_url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "e7f5f2d7-4c79-4f6b-99b9-794bc50452a0",
          business_name: "The Lime Tree Cafe & Kitchen",
          business_type: "Cafe & Kitchen",
          business_description: "Premium cafe & kitchen services in Dubai. We specialize in creating memorable dining experiences for events of all sizes.",
          service_area: "All over UAE",
          minimum_guests: 10,
          maximum_guests: 200,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: false,
          delivery_plus_setup: true,
          full_service: false,
          staff: 12,
          servers: 6,
          preparation_time: null,
          food_license: "FL-0002-2024",
          Registration: "REG-000002-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      first_name: "Abela",
      last_name: "Al-Rashid",
      phone: "+971514567890",
      email: "abela@abelaco.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "Abela & Co.",
      image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "bb8ad6b1-0511-4f21-a157-1a8578528a58",
          business_name: "Abela & Co.",
          business_type: "Arabic Buffet Catering",
          business_description: "Premium arabic buffet catering services in Dubai. We specialize in creating memorable dining experiences for events of all sizes.",
          service_area: "Dubai, Abu Dhabi",
          minimum_guests: 25,
          maximum_guests: 500,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: false,
          delivery_plus_setup: false,
          full_service: true,
          staff: 14,
          servers: 7,
          preparation_time: null,
          food_license: "FL-0003-2024",
          Registration: "REG-000003-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      first_name: "Fatima",
      last_name: "Hassan",
      phone: "+971502345678",
      email: "fatima@royalcatering.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "Royal Catering Services",
      image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "e10ac0fc-dba4-42ba-bf52-f3206e36fe85",
          business_name: "Royal Catering Services",
          business_type: "Full Service Catering",
          business_description: "Premium full service catering services in Dubai. We specialize in creating memorable dining experiences for events of all sizes.",
          service_area: "Dubai Marina, JBR, Palm Jumeirah",
          minimum_guests: 20,
          maximum_guests: 500,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: true,
          delivery_plus_setup: false,
          full_service: false,
          staff: 16,
          servers: 8,
          preparation_time: null,
          food_license: "FL-0004-2024",
          Registration: "REG-000004-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "01effc0f-30c7-42df-8974-d507baa73da0",
      first_name: "Mohammed",
      last_name: "Ibrahim",
      phone: "+971503456789",
      email: "mohammed@delightcatering.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "Delight Catering Co.",
      image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "e1a6ed95-baa6-4c3f-bd1d-80f1bfcc4263",
          business_name: "Delight Catering Co.",
          business_type: "Premium Catering",
          business_description: "Premium premium catering services in Dubai. We specialize in creating memorable dining experiences for events of all sizes.",
          service_area: "Downtown Dubai, Business Bay",
          minimum_guests: 30,
          maximum_guests: 300,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: false,
          delivery_plus_setup: true,
          full_service: false,
          staff: 18,
          servers: 9,
          preparation_time: null,
          food_license: "FL-0005-2024",
          Registration: "REG-000005-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      first_name: "Sarah",
      last_name: "Al-Zahra",
      phone: "+971504567890",
      email: "sarah@elegantevents.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "Elegant Events Catering",
      image_url: "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=600&fit=crop",
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "b1d1681b-868f-4593-bb3c-42fc9e4344de",
          business_name: "Elegant Events Catering",
          business_type: "Luxury Catering",
          business_description: "Premium luxury catering services in Abu Dhabi. We specialize in creating memorable dining experiences for events of all sizes.",
          service_area: "Abu Dhabi, Al Ain",
          minimum_guests: 50,
          maximum_guests: 1000,
          region: ["Abu Dhabi"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: false,
          delivery_plus_setup: false,
          full_service: true,
          staff: 20,
          servers: 10,
          preparation_time: null,
          food_license: "FL-0006-2024",
          Registration: "REG-000006-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      first_name: "Omar",
      last_name: "Khalil",
      phone: "+971505678901",
      email: "omar@spicekitchen.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "Spice Kitchen",
      image_url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "1fbadece-4dbb-4b4d-9d27-368288046387",
          business_name: "Spice Kitchen",
          business_type: "Traditional Catering",
          business_description: "Premium traditional catering services in Dubai. We specialize in creating memorable dining experiences for events of all sizes.",
          service_area: "Deira, Bur Dubai",
          minimum_guests: 15,
          maximum_guests: 200,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: true,
          delivery_plus_setup: false,
          full_service: false,
          staff: 22,
          servers: 11,
          preparation_time: null,
          food_license: "FL-0007-2024",
          Registration: "REG-000007-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      first_name: "Layla",
      last_name: "Mahmoud",
      phone: "+971506789012",
      email: "layla@mediterraneantaste.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "Mediterranean Taste",
      image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "8eed5247-0747-4117-aa4d-1cdc36a1e874",
          business_name: "Mediterranean Taste",
          business_type: "Mediterranean Catering",
          business_description: "Premium mediterranean catering services in Dubai. We specialize in creating memorable dining experiences for events of all sizes.",
          service_area: "Jumeirah, Umm Suqeim",
          minimum_guests: 25,
          maximum_guests: 400,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: false,
          delivery_plus_setup: true,
          full_service: false,
          staff: 24,
          servers: 12,
          preparation_time: null,
          food_license: "FL-0008-2024",
          Registration: "REG-000008-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      first_name: "Youssef",
      last_name: "Nasser",
      phone: "+971507890123",
      email: "youssef@asianfusion.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "Asian Fusion Catering",
      image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "46107457-1c53-40f8-8d93-5c47641728b1",
          business_name: "Asian Fusion Catering",
          business_type: "Asian Fusion",
          business_description: "Premium asian fusion services in Dubai. We specialize in creating memorable dining experiences for events of all sizes.",
          service_area: "Dubai Media City, Internet City",
          minimum_guests: 20,
          maximum_guests: 350,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: false,
          delivery_plus_setup: false,
          full_service: true,
          staff: 26,
          servers: 13,
          preparation_time: null,
          food_license: "FL-0009-2024",
          Registration: "REG-000009-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "062e1b49-c510-43a9-b2f2-80e5c45d4c95",
      first_name: "Amina",
      last_name: "Rashid",
      phone: "+971508901234",
      email: "amina@italianbistro.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "Italian Bistro Catering",
      image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "49c44fed-7827-4e43-8177-6e26f6045b4a",
          business_name: "Italian Bistro Catering",
          business_type: "Italian Catering",
          business_description: "Premium italian catering services in Dubai. We specialize in creating memorable dining experiences for events of all sizes.",
          service_area: "Dubai Hills, Emirates Hills",
          minimum_guests: 30,
          maximum_guests: 250,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: true,
          delivery_plus_setup: false,
          full_service: false,
          staff: 28,
          servers: 14,
          preparation_time: null,
          food_license: "FL-0010-2024",
          Registration: "REG-000010-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "b7aeba66-23db-4493-949d-0e82e0f3549a",
      first_name: "Khalid",
      last_name: "Saeed",
      phone: "+971509012345",
      email: "khalid@bbqmaster.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "BBQ Master Catering",
      image_url: "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=600&fit=crop",
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "26bd48e7-dbe6-49a7-97c5-63dbb6ffd134",
          business_name: "BBQ Master Catering",
          business_type: "BBQ & Grill",
          business_description: "Premium bbq & grill services in Dubai. We specialize in creating memorable dining experiences for events of all sizes.",
          service_area: "Al Barsha, Al Quoz",
          minimum_guests: 40,
          maximum_guests: 600,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: false,
          delivery_plus_setup: true,
          full_service: false,
          staff: 30,
          servers: 15,
          preparation_time: null,
          food_license: "FL-0011-2024",
          Registration: "REG-000011-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "647740d9-7885-4205-b56d-cd4087ae6a58",
      first_name: "Noor",
      last_name: "Al-Mazrouei",
      phone: "+971510123456",
      email: "noor@dessertdreams.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "Dessert Dreams Catering",
      image_url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "dc6ef6f9-d037-4153-ba04-7d73fb621afe",
          business_name: "Dessert Dreams Catering",
          business_type: "Dessert & Bakery",
          business_description: "Premium dessert & bakery services in Sharjah. We specialize in creating memorable dining experiences for events of all sizes.",
          service_area: "Sharjah, Ajman",
          minimum_guests: 10,
          maximum_guests: 150,
          region: ["Sharjah"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: false,
          delivery_plus_setup: false,
          full_service: true,
          staff: 32,
          servers: 16,
          preparation_time: null,
          food_license: "FL-0012-2024",
          Registration: "REG-000012-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      first_name: "Tariq",
      last_name: "Haddad",
      phone: "+971511234567",
      email: "tariq@veggieparadise.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "Veggie Paradise",
      image_url: null,
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "083d45f9-50c2-417a-8e44-2fe638c8b88d",
          business_name: "Veggie Paradise",
          business_type: "Vegetarian & Vegan",
          business_description: "Premium vegetarian & vegan services in Dubai. We specialize in creating memorable dining experiences for events of all sizes.",
          service_area: "Dubai Silicon Oasis, Academic City",
          minimum_guests: 15,
          maximum_guests: 200,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: true,
          delivery_plus_setup: false,
          full_service: false,
          staff: 34,
          servers: 17,
          preparation_time: null,
          food_license: "FL-0013-2024",
          Registration: "REG-000013-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "ba55496c-e65d-4c7a-82e2-d981bb44fa7d",
      first_name: "Mariam",
      last_name: "Al-Hashimi",
      phone: "+971512345678",
      email: "mariam@seafoodspecialists.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "Seafood Specialists",
      image_url: null,
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "323ef669-5bd3-4f83-8e3e-5f5523d55019",
          business_name: "Seafood Specialists",
          business_type: "Seafood Catering",
          business_description: "Premium seafood catering services in Dubai. We specialize in creating memorable dining experiences for events of all sizes.",
          service_area: "Dubai Creek, Old Dubai",
          minimum_guests: 25,
          maximum_guests: 300,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: false,
          delivery_plus_setup: true,
          full_service: false,
          staff: 36,
          servers: 18,
          preparation_time: null,
          food_license: "FL-0014-2024",
          Registration: "REG-000014-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "38355e5b-b3cb-4e8d-9722-d24f4dbd5468",
      first_name: "Hassan",
      last_name: "Al-Otaiba",
      phone: "+971513456789",
      email: "hassan@premiumcatering.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "Premium Catering Solutions",
      image_url: null,
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "fe95c9ce-e71d-4136-935e-797bf34f1e9b",
          business_name: "Premium Catering Solutions",
          business_type: "Corporate Catering",
          business_description: "Premium corporate catering services in Dubai. We specialize in creating memorable dining experiences for events of all sizes.",
          service_area: "Dubai International Financial Centre",
          minimum_guests: 50,
          maximum_guests: 500,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: false,
          delivery_plus_setup: false,
          full_service: true,
          staff: 38,
          servers: 19,
          preparation_time: null,
          food_license: "FL-0015-2024",
          Registration: "REG-000015-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "dd9adc68-1f7b-4ba7-9144-19c849da7f67",
      first_name: "Dipesh",
      last_name: "Savani",
      phone: "0585302928",
      email: "dsavani@hotmail.com",
      password: "\$2b\$10\$buOWYhLXF.Yl637YH1RggunwVCKxG/6qr1OHns2zabNgOo1G.bu8O",
      company_name: "Snacks & Nibbles ",
      image_url: null,
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "8abeea3d-30f2-4922-875b-804090da9790",
          business_name: "Snack & Nibbles ",
          business_type: "Bakery",
          business_description: "A Boutique homemade bakery ",
          service_area: "Dubai",
          minimum_guests: 25,
          maximum_guests: 100,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: true,
          delivery_plus_setup: false,
          full_service: false,
          staff: 0,
          servers: 1,
          preparation_time: 24,
          food_license: "https://res.cloudinary.com/ducldnoro/image/upload/v1768159681/partyfud/caterer-documents/food-license/wqxbhe9a1pccu3kbe763.png",
          Registration: "https://res.cloudinary.com/ducldnoro/image/upload/v1768159682/partyfud/caterer-documents/registration/c8urhgtktgfs0jitplsg.png",
          status: "PENDING",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "6293ee60-c522-4d45-8228-6c635ef21520",
      first_name: "Ananya",
      last_name: "Singh",
      phone: "8527939488",
      email: "ananya.180794@gmail.com",
      password: "\$2b\$10\$uhxc0/MB6F.U1FkFPnqlz.9u2LMfiwUQ9zFk94IgtLmik4hhiY5B.",
      company_name: "Ananya Catering",
      image_url: null,
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "19a25f45-3076-43e1-abbc-8818b44c031b",
          business_name: "Ananya Catering",
          business_type: "Catering Company",
          business_description: "Catering",
          service_area: "Dubai",
          minimum_guests: 10,
          maximum_guests: 500,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: true,
          delivery_plus_setup: false,
          full_service: false,
          staff: 0,
          servers: 1,
          preparation_time: 24,
          food_license: "https://res.cloudinary.com/ducldnoro/image/upload/v1768394659/partyfud/caterer-documents/food-license/hvb16coqdmnggp741ijs.png",
          Registration: "https://res.cloudinary.com/ducldnoro/image/upload/v1768394660/partyfud/caterer-documents/registration/g6f5f1f2yyvoljwxuzdn.png",
          status: "PENDING",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "14aedafb-065b-46d3-b21b-1fd2bdff364f",
      first_name: "Luma",
      last_name: "Maklouf",
      phone: "00971501517665",
      email: "hello@maiztacos.com",
      password: "\$2b\$10\$9Qi7l49UtVKNpJdam25AZOTglETbTU8T5TuuAAWOANcEyxy6e9tS2",
      company_name: "Maiz Tacos",
      image_url: null,
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "bf7f655b-98ef-4d66-b99e-8c9faed6ea00",
          business_name: "Maiz Tacos",
          business_type: "Catering Company",
          business_description: "Maiz Tacos is an authentic, family-run Mexican restaurant in Dubai, known for its fresh, high-quality tacos, burritos, and quesadillas made with no preservatives. They have locations in Jumeirah Lakes Towers (JLT) and Dubai Hills. ",
          service_area: "Dubai, Abu Dhabi",
          minimum_guests: 20,
          maximum_guests: 100,
          region: ["Dubai"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: true,
          delivery_plus_setup: true,
          full_service: true,
          staff: 0,
          servers: 1,
          preparation_time: 24,
          food_license: "https://res.cloudinary.com/ducldnoro/image/upload/v1768408327/partyfud/caterer-documents/food-license/ijymwcsv8bkng3xgogld.jpg",
          Registration: "https://res.cloudinary.com/ducldnoro/image/upload/v1768408328/partyfud/caterer-documents/registration/nnb2srmymtztjoh29ecb.jpg",
          status: "PENDING",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      first_name: "Jehangir",
      last_name: "Ahmed",
      phone: "+971501111112",
      email: "caterer@partyfud.ae",
      password: "\$2b\$10\$Kk2y6GJpjKcTgNNxiyvLdOdwF/TuEIxX2pMC3WKDYHJn8U.VmcinW",
      company_name: "Jehangir Restaurant",
      image_url: "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=600&fit=crop",
      profile_completed: true,
      verified: true,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "878e7a55-138b-4133-9d1c-9a45b472c157",
          business_name: "Jehangir Restaurant",
          business_type: "Cloud Kitchen",
          business_description: "Jehangir Restaurant - A premium Cafe & Kitchen offering authentic Indian cuisine and premier buffet services in Dubai. We specialize in traditional Indian dishes with rich spices and flavors for events of all sizes.",
          service_area: "Dubai",
          minimum_guests: 10,
          maximum_guests: 100,
          region: ["Ras Al Khaimah"],
          cuisine_types: [],
          unavailable_dates: [],
          delivery_only: true,
          delivery_plus_setup: false,
          full_service: true,
          staff: 10,
          servers: 5,
          preparation_time: 48,
          food_license: "FL-0001-2024",
          Registration: "REG-000001-UAE",
          status: "APPROVED",
          onboarding_step: 0,
          onboarding_completed: false,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "32a30450-f92a-4b0d-8208-f5e2767157a5",
      first_name: "Testing",
      last_name: "test",
      phone: "+97112324343232",
      email: "test@gmail.com",
      password: "\$2b\$10\$gGl5MG8Yze/OzAJ8zIxpK.Wsi7gQrDGd/CBJ.YAh7NkhbLO1agdHK",
      company_name: null,
      image_url: null,
      profile_completed: false,
      verified: false,
      type: "CATERER",
      catererinfo: {
        create: {
          id: "e7ac937f-698b-4399-87ed-cb1e8282e649",
          business_name: "Testing",
          business_type: "Hotel",
          business_description: "Testing Company",
          service_area: "25km",
          minimum_guests: 50,
          maximum_guests: 200,
          region: ["Dubai"],
          cuisine_types: ["b782af9f-1a5b-4f9a-8204-9d0c066e08e5"],
          unavailable_dates: ["2026-01-23","2026-01-22"],
          delivery_only: true,
          delivery_plus_setup: false,
          full_service: false,
          staff: 1,
          servers: 0,
          preparation_time: 12,
          food_license: null,
          Registration: null,
          status: "PENDING",
          onboarding_step: 4,
          onboarding_completed: true,
          has_draft: false,
          commission_rate: null,
        },
      },
    },
  });

  // 3. Create Certifications
  console.log("📜 Creating certifications...");
  await prisma.certification.create({
    data: {
      id: "90b327f6-01f4-4ad2-a70e-6bc942b58372",
      name: "Food Hygiene Level 2",
      description: "Basic food safety and hygiene certification",
    },
  });

  await prisma.certification.create({
    data: {
      id: "ff4b5dc2-43e6-43e0-9b51-6d3f3d0330cd",
      name: "Allergen Training",
      description: "Training in managing food allergens",
    },
  });

  await prisma.certification.create({
    data: {
      id: "9e0cefa8-02f6-4221-9500-ffdab7bcd13b",
      name: "Organic Certified",
      description: "Certified to handle and prepare organic foods",
    },
  });

  await prisma.certification.create({
    data: {
      id: "a3b73537-715c-4260-962b-003f4180eae3",
      name: "Kosher Certified",
      description: "Kosher food preparation certification",
    },
  });

  await prisma.certification.create({
    data: {
      id: "5394cd3d-7ece-4d45-8674-71d5a741493e",
      name: "Halal Certified",
      description: "Halal food preparation certification",
    },
  });

  // 4. Create Cuisine Types
  console.log("🍽️ Creating cuisine types...");
  await prisma.cuisineType.create({
    data: {
      id: "beb98422-6260-4d0c-95f3-463ead32003a",
      name: "British",
      description: "Traditional British cuisine including afternoon tea and high tea",
    },
  });

  await prisma.cuisineType.create({
    data: {
      id: "279480af-15dd-4e8a-ac77-6ba499230ddc",
      name: "Chinese",
      description: "Traditional Chinese cuisine",
    },
  });

  await prisma.cuisineType.create({
    data: {
      id: "e104336d-9bee-4f7c-b2a9-0ad4d4795d7a",
      name: "Italian",
      description: "Classic Italian dishes and pasta",
    },
  });

  await prisma.cuisineType.create({
    data: {
      id: "bc76b644-85f7-45c1-aaa8-b1674416daa4",
      name: "Asian Fusion",
      description: "Modern Asian fusion cuisine",
    },
  });

  await prisma.cuisineType.create({
    data: {
      id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      name: "Indian",
      description: "Authentic Indian cuisine with rich spices and flavors",
    },
  });

  await prisma.cuisineType.create({
    data: {
      id: "26e6087c-b37d-4db2-800b-4bc3070df715",
      name: "Mediterranean",
      description: "Fresh Mediterranean flavors and ingredients",
    },
  });

  await prisma.cuisineType.create({
    data: {
      id: "0be10417-278c-4089-8b4d-94c5c838a263",
      name: "Arabic",
      description: "Traditional Middle Eastern and Arabic dishes",
    },
  });

  await prisma.cuisineType.create({
    data: {
      id: "c056bb83-7489-41f5-b931-ffed3bf0fa90",
      name: "Seafood",
      description: "Fresh seafood specialties",
    },
  });

  await prisma.cuisineType.create({
    data: {
      id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      name: "Western",
      description: "European and American style cuisine",
    },
  });

  // 5. Create Categories
  console.log("📂 Creating categories...");
  await prisma.category.create({
    data: {
      id: "30a88b03-66bd-4a55-9bd7-34300fc04d0d",
      name: "Breads",
      description: "Fresh breads and flatbreads",
    },
  });

  await prisma.category.create({
    data: {
      id: "5efc5b15-31c4-4685-bd2d-6ff333b681b7",
      name: "Beverages",
      description: "Drinks and refreshments",
    },
  });

  await prisma.category.create({
    data: {
      id: "0bdefe4a-58a0-45da-9dd5-2a348a262178",
      name: "Soups",
      description: "Hot and cold soups",
    },
  });

  await prisma.category.create({
    data: {
      id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      name: "Main Course",
      description: "Main dishes and entrees",
    },
  });

  await prisma.category.create({
    data: {
      id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      name: "Appetizers",
      description: "Starters and small plates",
    },
  });

  await prisma.category.create({
    data: {
      id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      name: "Salads",
      description: "Fresh salads and sides",
    },
  });

  await prisma.category.create({
    data: {
      id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      name: "Desserts",
      description: "Sweet treats and desserts",
    },
  });

  // 6. Create SubCategories
  console.log("📁 Creating subcategories...");
  await prisma.subCategory.create({
    data: {
      id: "f758ba85-0e2d-4def-bd95-c0f14646a5a7",
      name: "Cakes",
      description: "Various cake varieties",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
    },
  });

  await prisma.subCategory.create({
    data: {
      id: "91038b74-5d82-4b47-a667-3071287cbb10",
      name: "Finger Sandwiches",
      description: "Traditional British finger sandwiches",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
    },
  });

  await prisma.subCategory.create({
    data: {
      id: "0ed91955-3fd2-4c7e-9691-698cc4d1b789",
      name: "Pasta",
      description: "Pasta dishes",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
    },
  });

  await prisma.subCategory.create({
    data: {
      id: "f2d7585b-e710-4cb5-b40f-50c782c9dfca",
      name: "Rice Dishes",
      description: "Biryani, fried rice, and rice-based dishes",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
    },
  });

  await prisma.subCategory.create({
    data: {
      id: "f9d17852-1f9e-4865-aef1-8ac652b2ba5d",
      name: "Finger Food",
      description: "Small bite-sized appetizers",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
    },
  });

  await prisma.subCategory.create({
    data: {
      id: "fa831c15-ffa5-4b25-82f9-599ebb75ba1c",
      name: "Ice Cream",
      description: "Ice cream and frozen desserts",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
    },
  });

  await prisma.subCategory.create({
    data: {
      id: "a3d8f8a2-d1a6-4398-92c4-04a92f7df42a",
      name: "Dips & Spreads",
      description: "Hummus, baba ganoush, and other dips",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
    },
  });

  await prisma.subCategory.create({
    data: {
      id: "3385132e-042d-4858-8a59-4a813daccb28",
      name: "Grilled",
      description: "Grilled meats and vegetables",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
    },
  });

  await prisma.subCategory.create({
    data: {
      id: "e472fccf-ffc3-46e0-aa4b-712e4b3e68a7",
      name: "Curry",
      description: "Curry dishes",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
    },
  });

  await prisma.subCategory.create({
    data: {
      id: "8ceb5c7e-3555-43b6-b020-c4d1a10c6b23",
      name: "Scones & Quiches",
      description: "British scones and quiches",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
    },
  });

  await prisma.subCategory.create({
    data: {
      id: "e67397cd-8f93-4f95-b9c6-d9e36326fc0a",
      name: "Green Salads",
      description: "Fresh green salads",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
    },
  });

  await prisma.subCategory.create({
    data: {
      id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      name: "Fruit Salads",
      description: "Fresh fruit salads",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
    },
  });

  await prisma.subCategory.create({
    data: {
      id: "230ae8b0-4d7c-46c5-ad89-e898bec02fd6",
      name: "Pastries",
      description: "Sweet pastries and baked goods",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
    },
  });

  // 7. Create FreeForms (Dietary Restrictions)
  console.log("🌿 Creating dietary restrictions...");
  await prisma.freeForm.create({
    data: {
      id: "8bf15eb0-ab9d-4a44-9249-58a5754f7150",
      name: "Dairy-Free",
      description: "No dairy products",
    },
  });

  await prisma.freeForm.create({
    data: {
      id: "7e4fa2c0-839e-4360-a86b-b1dfa5b52eef",
      name: "Gluten-Free",
      description: "No gluten-containing ingredients",
    },
  });

  await prisma.freeForm.create({
    data: {
      id: "40249d76-c1c7-488c-8bb5-5e74f4405434",
      name: "Nut-Free",
      description: "No nuts or nut products",
    },
  });

  await prisma.freeForm.create({
    data: {
      id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
      name: "Halal",
      description: "Prepared according to Islamic dietary laws",
    },
  });

  await prisma.freeForm.create({
    data: {
      id: "bf2da578-a65c-496c-9e63-0268e0c32516",
      name: "Vegan",
      description: "No animal products",
    },
  });

  await prisma.freeForm.create({
    data: {
      id: "62fcc5c1-9b9a-49d8-be54-4cf30f13fb05",
      name: "Sugar-Free",
      description: "No added sugar",
    },
  });

  // 8. Create Dishes
  console.log("🍲 Creating dishes...");
  await prisma.dish.create({
    data: {
      id: "18a68f8a-1e39-4378-b286-161de3f22e61",
      name: "Dish",
      image_url: "https://res.cloudinary.com/ducldnoro/image/upload/v1768394828/partyfud/dishes/rdfgnkfuzhuxbvhw1vbt.png",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "e472fccf-ffc3-46e0-aa4b-712e4b3e68a7",
      caterer_id: "6293ee60-c522-4d45-8228-6c635ef21520",
      quantity_in_gm: -1,
      pieces: 1,
      price: 20,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "c7d8151b-1f46-4f0f-a86b-696279949739",
      name: "Taco Platter",
      image_url: "https://res.cloudinary.com/ducldnoro/image/upload/v1768408841/partyfud/dishes/yooxqvvkn19ayacmdjxw.jpg",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: null,
      caterer_id: "14aedafb-065b-46d3-b21b-1fd2bdff364f",
      quantity_in_gm: 0,
      pieces: 1,
      price: 24.98,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "e88688c1-dffa-4abb-a34c-7718bbeac99c",
      name: "Chocolate Cake 3 Tiers",
      image_url: "https://res.cloudinary.com/ducldnoro/image/upload/v1768408928/partyfud/dishes/vsiwjyjfcpu05dtifeud.svg",
      cuisine_type_id: "beb98422-6260-4d0c-95f3-463ead32003a",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: null,
      caterer_id: "14aedafb-065b-46d3-b21b-1fd2bdff364f",
      quantity_in_gm: 3000,
      pieces: 1,
      price: 499,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "998e2d1a-b357-4d9b-bc95-155005574679",
      name: "Kachumbari Salad",
      image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 200,
      pieces: 1,
      price: 5,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "c9102308-4f07-447f-89a6-ef71fac2c942",
      name: "Fattoush",
      image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 200,
      pieces: 1,
      price: 5,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "0429c660-0496-451f-a7be-0f94113749b7",
      name: "Mixed Veg. Raitha",
      image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 200,
      pieces: 1,
      price: 5,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "4b97aa1c-85c8-4d0b-ad59-5bdbce8a88bd",
      name: "Laccha pyaz",
      image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 150,
      pieces: 1,
      price: 5,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "84aa14df-f456-446a-894e-037dc43e43fb",
      name: "Lemon",
      image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: null,
      pieces: 1,
      price: 5,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "cb352166-4a99-43e4-95f8-5d441a8bbe44",
      name: "Green Chillies",
      image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: null,
      pieces: 1,
      price: 5,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "f4746143-46ab-4028-af13-8487a7af5f39",
      name: "Assorted Poppadum",
      image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: null,
      pieces: 4,
      price: 5,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "a199e303-2ee9-4c8b-bdd6-2a30a516e145",
      name: "Yoghart Raita",
      image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 200,
      pieces: 1,
      price: 5,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "027e594b-c7e2-4be2-8b6b-effd453eb908",
      name: "Dal Shorba",
      image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0bdefe4a-58a0-45da-9dd5-2a348a262178",
      sub_category_id: null,
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 250,
      pieces: 1,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "2e32f798-9271-4d72-9c60-cad90a0420df",
      name: "Tamatar Dhaniya ka Shorba",
      image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0bdefe4a-58a0-45da-9dd5-2a348a262178",
      sub_category_id: null,
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 250,
      pieces: 1,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "a7eb85bf-d275-434e-8c63-10b2fd67e428",
      name: "Lasooni Murgh Tikka",
      image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "f9d17852-1f9e-4865-aef1-8ac652b2ba5d",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 200,
      pieces: 4,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "788a708f-43aa-4b9c-9abf-dc6ab7e49fd2",
      name: "Mutton Seekh Kebab",
      image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "f9d17852-1f9e-4865-aef1-8ac652b2ba5d",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 200,
      pieces: 4,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "3831eea2-5a2b-4a48-aa62-4f6bdba57c9b",
      name: "Murgh Nizami",
      image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "e472fccf-ffc3-46e0-aa4b-712e4b3e68a7",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 300,
      pieces: 1,
      price: 20,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "a5e0ebf8-d239-438b-97f9-6eb6aaed6e36",
      name: "Kali Mirch ka Gosht",
      image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "e472fccf-ffc3-46e0-aa4b-712e4b3e68a7",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 300,
      pieces: 1,
      price: 20,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "ea318c86-e51f-491f-96c6-fe19f3d67f67",
      name: "Subz Kadai",
      image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "e472fccf-ffc3-46e0-aa4b-712e4b3e68a7",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 300,
      pieces: 1,
      price: 20,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "fddeda0f-d080-41f9-bad5-6171dde0f984",
      name: "Dal Makhani",
      image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "e472fccf-ffc3-46e0-aa4b-712e4b3e68a7",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 300,
      pieces: 1,
      price: 20,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "b03010d8-fa9b-4497-b6d5-285951058bb2",
      name: "Hyderabadi Murgh Biryani",
      image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "f2d7585b-e710-4cb5-b40f-50c782c9dfca",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 400,
      pieces: 1,
      price: 20,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "3770b7de-57e0-4a84-bce5-a938524175fb",
      name: "Gajar Ka Halwa",
      image_url: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "230ae8b0-4d7c-46c5-ad89-e898bec02fd6",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 150,
      pieces: 1,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "96883603-d317-4c60-b3ba-ae66b8da564a",
      name: "Rasmalai",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "230ae8b0-4d7c-46c5-ad89-e898bec02fd6",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: 120,
      pieces: 1,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "4c9429f3-74a5-44e2-bb14-7f3a843b52ce",
      name: "Gulab Jamun",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "230ae8b0-4d7c-46c5-ad89-e898bec02fd6",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      quantity_in_gm: null,
      pieces: 2,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "199fd57b-0bc6-46d7-951e-b57267945ae4",
      name: "Butter Chicken",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "e472fccf-ffc3-46e0-aa4b-712e4b3e68a7",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      quantity_in_gm: 300,
      pieces: 1,
      price: 45,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "9fda83aa-4049-4835-989f-aba08842586e",
      name: "Chicken Biryani",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "f2d7585b-e710-4cb5-b40f-50c782c9dfca",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      quantity_in_gm: 400,
      pieces: 1,
      price: 38,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "1a939c6a-7737-4962-bb17-06636e7fcdcc",
      name: "Vegetable Samosa",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "f9d17852-1f9e-4865-aef1-8ac652b2ba5d",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      quantity_in_gm: null,
      pieces: 2,
      price: 12,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "82942e17-52ed-4d95-b181-bdc3dd74118b",
      name: "Paneer Tikka",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "f9d17852-1f9e-4865-aef1-8ac652b2ba5d",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      quantity_in_gm: 200,
      pieces: 4,
      price: 28,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "78fa184a-00f9-410c-be74-228b3f1a031d",
      name: "Dal Makhani",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "e472fccf-ffc3-46e0-aa4b-712e4b3e68a7",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      quantity_in_gm: 250,
      pieces: 1,
      price: 25,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "24e0eac4-0812-4552-86dc-d4e625290593",
      name: "Gulab Jamun",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "230ae8b0-4d7c-46c5-ad89-e898bec02fd6",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      quantity_in_gm: null,
      pieces: 2,
      price: 15,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "48e1cbe1-6bc3-44c0-8168-1c94df389079",
      name: "Chicken Curry",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "e472fccf-ffc3-46e0-aa4b-712e4b3e68a7",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      quantity_in_gm: 300,
      pieces: 1,
      price: 42,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "807a4df9-8bd5-40c6-88a3-20d1d0a6d82b",
      name: "Naan Bread",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "30a88b03-66bd-4a55-9bd7-34300fc04d0d",
      sub_category_id: null,
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      quantity_in_gm: null,
      pieces: 2,
      price: 8,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "169659ed-85fa-48c3-a6e2-3e6002f3263c",
      name: "Hummus",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "a3d8f8a2-d1a6-4398-92c4-04a92f7df42a",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      quantity_in_gm: 200,
      pieces: 1,
      price: 18,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "28d7a62d-04a3-4627-8680-72836414849e",
      name: "Chicken Shawarma",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "3385132e-042d-4858-8a59-4a813daccb28",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      quantity_in_gm: null,
      pieces: 1,
      price: 32,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "471c6a92-8f25-40c6-a26b-8eb786585f89",
      name: "Fattoush Salad",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      quantity_in_gm: 250,
      pieces: 1,
      price: 22,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "104598b0-6cdb-402b-834a-66ed9fe89c8d",
      name: "Baklava",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "230ae8b0-4d7c-46c5-ad89-e898bec02fd6",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      quantity_in_gm: null,
      pieces: 3,
      price: 20,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "ce7dda19-8505-4d7d-9d86-d71b70428137",
      name: "Mutton Mandi",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "f2d7585b-e710-4cb5-b40f-50c782c9dfca",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      quantity_in_gm: 500,
      pieces: 1,
      price: 55,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "d20d53fa-0029-4078-9421-4589130b51a3",
      name: "Tabbouleh",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      quantity_in_gm: 200,
      pieces: 1,
      price: 20,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "a3aa822c-4459-470d-9e21-372a35a4937b",
      name: "Kunafa",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "230ae8b0-4d7c-46c5-ad89-e898bec02fd6",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      quantity_in_gm: null,
      pieces: 1,
      price: 25,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "c6effca6-c53d-4f76-9680-b9e475a4d74a",
      name: "Lamb Kebab",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "3385132e-042d-4858-8a59-4a813daccb28",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      quantity_in_gm: 300,
      pieces: 4,
      price: 48,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "d02d9910-d678-4898-bbc1-ada0aa62956b",
      name: "Caesar Salad",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      quantity_in_gm: 300,
      pieces: 1,
      price: 28,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "05dc2a13-405b-4e97-ad2c-b5e5bc704a16",
      name: "Grilled Chicken Breast",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "3385132e-042d-4858-8a59-4a813daccb28",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      quantity_in_gm: 250,
      pieces: 1,
      price: 42,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "b7386909-b512-47b0-b6ef-8a6d2c0e3bd1",
      name: "Chocolate Cake",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "f758ba85-0e2d-4def-bd95-c0f14646a5a7",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      quantity_in_gm: 150,
      pieces: 1,
      price: 35,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "a743dcba-4169-4711-a56f-cd0321571258",
      name: "Beef Steak",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "3385132e-042d-4858-8a59-4a813daccb28",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      quantity_in_gm: 300,
      pieces: 1,
      price: 65,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "f67ee400-ea23-47be-ad10-74eb3d777a34",
      name: "Fish & Chips",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "3385132e-042d-4858-8a59-4a813daccb28",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      quantity_in_gm: 350,
      pieces: 1,
      price: 38,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "c8f86dcc-c0b0-4dc0-9b68-817e19a7dddb",
      name: "Chicken Wings",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "f9d17852-1f9e-4865-aef1-8ac652b2ba5d",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      quantity_in_gm: null,
      pieces: 8,
      price: 32,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "10e63730-757e-49cb-a3e0-35d56104e83d",
      name: "Cheesecake",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "f758ba85-0e2d-4def-bd95-c0f14646a5a7",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      quantity_in_gm: 120,
      pieces: 1,
      price: 30,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "55dc3ac3-63d3-4af1-ab10-a517d62e2238",
      name: "Vegetable Spring Rolls",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "279480af-15dd-4e8a-ac77-6ba499230ddc",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "f9d17852-1f9e-4865-aef1-8ac652b2ba5d",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      quantity_in_gm: null,
      pieces: 4,
      price: 16,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "03aed511-7d2e-405f-809c-ba8d650ee9d9",
      name: "Chicken Fried Rice",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "279480af-15dd-4e8a-ac77-6ba499230ddc",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "f2d7585b-e710-4cb5-b40f-50c782c9dfca",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      quantity_in_gm: 350,
      pieces: 1,
      price: 30,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "04765a02-01f9-4e48-83e0-07443b832abd",
      name: "Sweet and Sour Chicken",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "279480af-15dd-4e8a-ac77-6ba499230ddc",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: null,
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      quantity_in_gm: 300,
      pieces: 1,
      price: 35,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "61b7085d-24d7-49df-af08-f4bdfe928c75",
      name: "Chicken Dim Sum",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "279480af-15dd-4e8a-ac77-6ba499230ddc",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "f9d17852-1f9e-4865-aef1-8ac652b2ba5d",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      quantity_in_gm: null,
      pieces: 6,
      price: 22,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "8a7a1e30-405d-4f51-8f47-61345813d4a0",
      name: "Beef Noodles",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "279480af-15dd-4e8a-ac77-6ba499230ddc",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "0ed91955-3fd2-4c7e-9691-698cc4d1b789",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      quantity_in_gm: 400,
      pieces: 1,
      price: 32,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "b45f7053-3be9-4114-b2bd-6a21beca6efa",
      name: "Prawn Dumplings",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "279480af-15dd-4e8a-ac77-6ba499230ddc",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "f9d17852-1f9e-4865-aef1-8ac652b2ba5d",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      quantity_in_gm: null,
      pieces: 4,
      price: 28,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "57f702a5-1e48-4430-a150-823aac6bdea9",
      name: "Bruschetta",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "e104336d-9bee-4f7c-b2a9-0ad4d4795d7a",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "f9d17852-1f9e-4865-aef1-8ac652b2ba5d",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      quantity_in_gm: null,
      pieces: 4,
      price: 24,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "e4c278e1-a45f-4534-84a5-a71939cdd8a5",
      name: "Spaghetti Carbonara",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "e104336d-9bee-4f7c-b2a9-0ad4d4795d7a",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "0ed91955-3fd2-4c7e-9691-698cc4d1b789",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      quantity_in_gm: 300,
      pieces: 1,
      price: 40,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "4b816edb-b9dd-4f20-a318-b05d0d62fec5",
      name: "Tiramisu",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "e104336d-9bee-4f7c-b2a9-0ad4d4795d7a",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "230ae8b0-4d7c-46c5-ad89-e898bec02fd6",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      quantity_in_gm: 120,
      pieces: 1,
      price: 28,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "11f3596c-43b0-44d4-a65e-4c5eb00cf264",
      name: "Margherita Pizza",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "e104336d-9bee-4f7c-b2a9-0ad4d4795d7a",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: null,
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      quantity_in_gm: null,
      pieces: 1,
      price: 35,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "25c7733c-7148-42a3-80fe-6d642be9e135",
      name: "Lasagna",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "e104336d-9bee-4f7c-b2a9-0ad4d4795d7a",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "0ed91955-3fd2-4c7e-9691-698cc4d1b789",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      quantity_in_gm: 350,
      pieces: 1,
      price: 38,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "cd3673c9-4409-4d04-b1f1-071a12a95c80",
      name: "Penne Arrabbiata",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "e104336d-9bee-4f7c-b2a9-0ad4d4795d7a",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "0ed91955-3fd2-4c7e-9691-698cc4d1b789",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      quantity_in_gm: 300,
      pieces: 1,
      price: 32,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "41f719c2-cb90-40a4-88ff-fe345457bbce",
      name: "Panna Cotta",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "e104336d-9bee-4f7c-b2a9-0ad4d4795d7a",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "fa831c15-ffa5-4b25-82f9-599ebb75ba1c",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      quantity_in_gm: 100,
      pieces: 1,
      price: 22,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "22dd897b-898d-462c-a7b9-42af469c5db2",
      name: "Greek Salad",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "26e6087c-b37d-4db2-800b-4bc3070df715",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      quantity_in_gm: 280,
      pieces: 1,
      price: 26,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "59679f8d-527f-4ec1-b049-b6bd3b1f8359",
      name: "Grilled Halloumi",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "26e6087c-b37d-4db2-800b-4bc3070df715",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "3385132e-042d-4858-8a59-4a813daccb28",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      quantity_in_gm: 200,
      pieces: 4,
      price: 32,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "7b7454df-c83a-4306-960c-b97b5e0cced2",
      name: "Moussaka",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "26e6087c-b37d-4db2-800b-4bc3070df715",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: null,
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      quantity_in_gm: 350,
      pieces: 1,
      price: 42,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "68a2849f-2cc5-4bc1-bf7b-085a9bff7a6e",
      name: "Baba Ganoush",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "26e6087c-b37d-4db2-800b-4bc3070df715",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "a3d8f8a2-d1a6-4398-92c4-04a92f7df42a",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      quantity_in_gm: 200,
      pieces: 1,
      price: 20,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "fcba3d0b-e97f-4af2-87f8-0a878f377e4d",
      name: "Falafel",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "26e6087c-b37d-4db2-800b-4bc3070df715",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "f9d17852-1f9e-4865-aef1-8ac652b2ba5d",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      quantity_in_gm: null,
      pieces: 6,
      price: 18,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "4f852297-178e-4bd7-a5ec-15fd2f7e594d",
      name: "Sushi Platter",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "bc76b644-85f7-45c1-aaa8-b1674416daa4",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: null,
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      quantity_in_gm: null,
      pieces: 12,
      price: 55,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "a18b52cb-75c2-44d7-9e26-f43ead9c6e5d",
      name: "Thai Green Curry",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "bc76b644-85f7-45c1-aaa8-b1674416daa4",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "e472fccf-ffc3-46e0-aa4b-712e4b3e68a7",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      quantity_in_gm: 300,
      pieces: 1,
      price: 38,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "bd0fdd57-b62f-4bf2-a885-34abb0977c94",
      name: "Pad Thai",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "bc76b644-85f7-45c1-aaa8-b1674416daa4",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "0ed91955-3fd2-4c7e-9691-698cc4d1b789",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      quantity_in_gm: 350,
      pieces: 1,
      price: 32,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "02b1d615-42cb-4386-ae08-174c558b829f",
      name: "Korean BBQ Beef",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "bc76b644-85f7-45c1-aaa8-b1674416daa4",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "3385132e-042d-4858-8a59-4a813daccb28",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      quantity_in_gm: 300,
      pieces: 1,
      price: 48,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "41ffc672-3228-490d-8c71-173259a9595e",
      name: "Grilled Salmon",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "c056bb83-7489-41f5-b931-ffed3bf0fa90",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "3385132e-042d-4858-8a59-4a813daccb28",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      quantity_in_gm: 300,
      pieces: 1,
      price: 52,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "03bcda5c-d0ce-47c7-9f5f-53a51378f76e",
      name: "Fish Tacos",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "c056bb83-7489-41f5-b931-ffed3bf0fa90",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: null,
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      quantity_in_gm: null,
      pieces: 3,
      price: 35,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "c7361ea0-6398-4c42-abd7-ab2fdbbbfaa3",
      name: "Lobster Thermidor",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "c056bb83-7489-41f5-b931-ffed3bf0fa90",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: null,
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      quantity_in_gm: 400,
      pieces: 1,
      price: 85,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "e4d0b6c4-ecae-4c1a-80d0-7c46d75bbecf",
      name: "Prawn Biryani",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "c056bb83-7489-41f5-b931-ffed3bf0fa90",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "f2d7585b-e710-4cb5-b40f-50c782c9dfca",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      quantity_in_gm: 400,
      pieces: 1,
      price: 45,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "66fa1969-79f2-4161-a2b4-6642ee700a32",
      name: "Crab Cakes",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "c056bb83-7489-41f5-b931-ffed3bf0fa90",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "f9d17852-1f9e-4865-aef1-8ac652b2ba5d",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      quantity_in_gm: null,
      pieces: 4,
      price: 38,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "9f8a3277-2c54-4a4f-8eea-cfc3da907c35",
      name: "Hummos",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 200,
      pieces: 1,
      price: 15,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "7fbf5b1c-0e35-4278-87c7-cf78625a1719",
      name: "Moutable",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 200,
      pieces: 1,
      price: 15,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "2d7407bc-cbbb-4799-a914-10f0ba762151",
      name: "Tabouleh",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 200,
      pieces: 1,
      price: 15,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "0f9d8620-87ed-4671-9310-d5294845da81",
      name: "Suffed Baby Marrow Bil Zeit",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 200,
      pieces: 1,
      price: 18,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "61a90179-a259-4cb1-a74a-6ef2f2588afb",
      name: "Cheese and Tomato",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "91038b74-5d82-4b47-a667-3071287cbb10",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 2,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "f7bd156d-e2df-4a35-bc29-d876bdbfa2fc",
      name: "Grilled baby corn salad with feta cheese",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 250,
      pieces: 1,
      price: 20,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "7fb85c13-e959-4bad-aee1-3fccd8d97606",
      name: "Sausage & Cabbage Salad",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      sub_category_id: "d962e53b-8ea8-4350-a27b-6e3c1b05132b",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 200,
      pieces: 1,
      price: 18,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "c0dfcf3f-bcb4-421c-a666-c7d149ce8e33",
      name: "Lasagna Verdi",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "e104336d-9bee-4f7c-b2a9-0ad4d4795d7a",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "0ed91955-3fd2-4c7e-9691-698cc4d1b789",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 300,
      pieces: 1,
      price: 35,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "7e78f4cd-cd17-44b3-8959-187deda21daf",
      name: "Mandi Chicken",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "f2d7585b-e710-4cb5-b40f-50c782c9dfca",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 400,
      pieces: 1,
      price: 45,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "036c7578-ac5b-4c4f-bc83-3094e42a3fff",
      name: "Chicken Tikka Masala",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "e472fccf-ffc3-46e0-aa4b-712e4b3e68a7",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 300,
      pieces: 1,
      price: 38,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "65cff04b-989d-4096-b8c6-358b823b5d3c",
      name: "Vegetable Fried Rice",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "279480af-15dd-4e8a-ac77-6ba499230ddc",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "f2d7585b-e710-4cb5-b40f-50c782c9dfca",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 350,
      pieces: 1,
      price: 25,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "2acfd35d-988b-4df0-981f-df12052f5e18",
      name: "Beef Strognaoff",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "0ed91955-3fd2-4c7e-9691-698cc4d1b789",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 300,
      pieces: 1,
      price: 48,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "4154a884-6944-4eb9-8c87-e0771a0a8d5f",
      name: "Grilled Hamour With Lemo & Butter Sauce",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "c056bb83-7489-41f5-b931-ffed3bf0fa90",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "3385132e-042d-4858-8a59-4a813daccb28",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 300,
      pieces: 1,
      price: 55,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "ae3488ed-400e-49dc-a1df-97a26b1a7f15",
      name: "Stir Fried Vegetable",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "279480af-15dd-4e8a-ac77-6ba499230ddc",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: null,
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 250,
      pieces: 1,
      price: 22,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "86d10d7b-0ec2-4099-bcb3-7786fe6a8533",
      name: "Kobeda Kebab",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      sub_category_id: "3385132e-042d-4858-8a59-4a813daccb28",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 300,
      pieces: 4,
      price: 42,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "15a9dc69-8829-44f0-984f-ffd3adbf9b9e",
      name: "Umm Ali",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "230ae8b0-4d7c-46c5-ad89-e898bec02fd6",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 150,
      pieces: 1,
      price: 18,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "2736bca5-310b-40f4-b607-13e2c8c51336",
      name: "Cream Caramel",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "e104336d-9bee-4f7c-b2a9-0ad4d4795d7a",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "230ae8b0-4d7c-46c5-ad89-e898bec02fd6",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 120,
      pieces: 1,
      price: 20,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "e4b4b743-7856-48eb-b9c4-d3dac9955198",
      name: "Rasmalai",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "b782af9f-1a5b-4f9a-8204-9d0c066e08e5",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "230ae8b0-4d7c-46c5-ad89-e898bec02fd6",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 120,
      pieces: 1,
      price: 22,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "01bf03c1-43f4-4341-8003-a404342c426c",
      name: "Exotic Fresh Fruit Slices",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: null,
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: 300,
      pieces: 1,
      price: 25,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "9c58b1eb-6fe4-46fa-b2e7-917d0133cd66",
      name: "Assorted Soft Drinks",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "5efc5b15-31c4-4685-bd2d-6ff333b681b7",
      sub_category_id: null,
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: null,
      pieces: 1,
      price: 8,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "28c64f45-2803-4f7e-82c0-04f6e3f3c898",
      name: "Mineral Water",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "0be10417-278c-4089-8b4d-94c5c838a263",
      category_id: "5efc5b15-31c4-4685-bd2d-6ff333b681b7",
      sub_category_id: null,
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      quantity_in_gm: null,
      pieces: 1,
      price: 5,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "156de8a9-24a5-46da-a3d7-639f5c73d06b",
      name: "Egg and Cress",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "91038b74-5d82-4b47-a667-3071287cbb10",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 2,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "b0828718-c70f-43d1-a20e-8e283be81c5c",
      name: "Tuna and Sweetcorn",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "91038b74-5d82-4b47-a667-3071287cbb10",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 2,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "85e259ba-52c9-4076-8c15-506a4ff91828",
      name: "Beef and Horseradish",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "91038b74-5d82-4b47-a667-3071287cbb10",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 2,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "98376ffd-4090-4a39-bf79-d4e1c952099d",
      name: "Cucumber and Cream Cheese",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "91038b74-5d82-4b47-a667-3071287cbb10",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 2,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "f4fd2501-4ce3-489e-9400-ee40aa11ed54",
      name: "Ham and Cheese",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "91038b74-5d82-4b47-a667-3071287cbb10",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 2,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "3766cc43-f7e2-45b0-b8b9-af225984612f",
      name: "Ham and Mustard",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "91038b74-5d82-4b47-a667-3071287cbb10",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 2,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "241c5edb-e3e0-4fc3-b403-d4cfe57a6c09",
      name: "Smoked Salmon and Cream Cheese",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "91038b74-5d82-4b47-a667-3071287cbb10",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 2,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "d1435bfb-04e5-4c83-90f2-ce3e194f542f",
      name: "Scones with Clotted Cream and Jam",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "8ceb5c7e-3555-43b6-b020-c4d1a10c6b23",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 2,
      price: 15,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "29b165d8-fbad-4a09-a5a3-6ba4d839c668",
      name: "Pork Sausage Rolls",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "f9d17852-1f9e-4865-aef1-8ac652b2ba5d",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 4,
      price: 15,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "f24a7760-60e8-4331-b61f-bd0d9d7551d1",
      name: "Ham and Leek Quiche",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "8ceb5c7e-3555-43b6-b020-c4d1a10c6b23",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 1,
      price: 15,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "d293dc57-6de2-48c2-9ab8-9484dd386390",
      name: "Broccoli and Asparagus Quiche",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      sub_category_id: "8ceb5c7e-3555-43b6-b020-c4d1a10c6b23",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 1,
      price: 15,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "2c55fd0f-6745-4771-bb7d-c7c2a7699f48",
      name: "Victoria Sponge Cake",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "f758ba85-0e2d-4def-bd95-c0f14646a5a7",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: 150,
      pieces: 1,
      price: 15,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "16947236-9a0e-46d6-8c41-6391cc053af7",
      name: "Chocolate Brownie",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "f758ba85-0e2d-4def-bd95-c0f14646a5a7",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: 120,
      pieces: 1,
      price: 15,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "7e64f067-205a-432c-b436-6df43f81bb32",
      name: "Battenberg",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "230ae8b0-4d7c-46c5-ad89-e898bec02fd6",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 4,
      price: 15,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "5cf1da69-4ee6-4e73-8f5c-080b6d8f148b",
      name: "Lemon Drizzle Cake",
      image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "f758ba85-0e2d-4def-bd95-c0f14646a5a7",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: 150,
      pieces: 1,
      price: 15,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "94f09aa6-cc4f-4dc6-9930-0481d7e0b250",
      name: "Coffee Cake",
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      sub_category_id: "f758ba85-0e2d-4def-bd95-c0f14646a5a7",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: 150,
      pieces: 1,
      price: 15,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "d64d51ba-612c-4f23-84dd-24da7842458c",
      name: "Americano / Black Coffee",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5efc5b15-31c4-4685-bd2d-6ff333b681b7",
      sub_category_id: null,
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 1,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "3b0d9d8b-5527-4b9a-a909-eca53ab78a2a",
      name: "British High Tea",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5efc5b15-31c4-4685-bd2d-6ff333b681b7",
      sub_category_id: null,
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 1,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  await prisma.dish.create({
    data: {
      id: "4ee12b38-fe09-4569-a731-85d90a5a2927",
      name: "Green Tea / Camomile / Mint Tea",
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      cuisine_type_id: "7784ea86-f9c1-4d48-bc76-67bd1c40ea7c",
      category_id: "5efc5b15-31c4-4685-bd2d-6ff333b681b7",
      sub_category_id: null,
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      quantity_in_gm: null,
      pieces: 1,
      price: 10,
      currency: "AED",
      is_active: true,
    },
  });

  // 9. Create DishFreeForm links
  console.log("🔗 Linking dishes to dietary restrictions...");
  await prisma.dishFreeForm.create({
    data: {
      id: "a035b873-d6ae-485e-85c4-59567744d759",
      dish_id: "18a68f8a-1e39-4378-b286-161de3f22e61",
      freeform_id: "8bf15eb0-ab9d-4a44-9249-58a5754f7150",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "55354f40-2449-485b-8902-635250691bd2",
      dish_id: "18a68f8a-1e39-4378-b286-161de3f22e61",
      freeform_id: "7e4fa2c0-839e-4360-a86b-b1dfa5b52eef",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "57624324-9e01-4f27-98ae-3cef1479bd43",
      dish_id: "c7d8151b-1f46-4f0f-a86b-696279949739",
      freeform_id: "8bf15eb0-ab9d-4a44-9249-58a5754f7150",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "4eb62c01-369a-49dc-b566-a7d72a6c3cd2",
      dish_id: "c7d8151b-1f46-4f0f-a86b-696279949739",
      freeform_id: "40249d76-c1c7-488c-8bb5-5e74f4405434",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "6af77dc2-9da0-43c5-8bf7-004ce20010e6",
      dish_id: "c7d8151b-1f46-4f0f-a86b-696279949739",
      freeform_id: "7e4fa2c0-839e-4360-a86b-b1dfa5b52eef",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "368ac188-b6b5-4b93-8e05-2e1d16ac88d9",
      dish_id: "e88688c1-dffa-4abb-a34c-7718bbeac99c",
      freeform_id: "8bf15eb0-ab9d-4a44-9249-58a5754f7150",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "7dcf982e-eed3-498a-a3ec-b725235d29e8",
      dish_id: "1a939c6a-7737-4962-bb17-06636e7fcdcc",
      freeform_id: "bf2da578-a65c-496c-9e63-0268e0c32516",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "50a6200b-06b1-431b-b37c-2fb0880f2503",
      dish_id: "1a939c6a-7737-4962-bb17-06636e7fcdcc",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "ee759ba7-1409-4aa8-84ed-181ab6733412",
      dish_id: "169659ed-85fa-48c3-a6e2-3e6002f3263c",
      freeform_id: "bf2da578-a65c-496c-9e63-0268e0c32516",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "4cc68035-b84d-4012-a0d7-bb650447c6ca",
      dish_id: "169659ed-85fa-48c3-a6e2-3e6002f3263c",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "c8d61c53-91c9-4358-b2c1-09f4f71a0225",
      dish_id: "471c6a92-8f25-40c6-a26b-8eb786585f89",
      freeform_id: "bf2da578-a65c-496c-9e63-0268e0c32516",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "f049ea41-026c-45bb-b2bf-7bdcdbf703ca",
      dish_id: "471c6a92-8f25-40c6-a26b-8eb786585f89",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "4df30b8e-de3a-446f-8f62-3f3d10043b62",
      dish_id: "d20d53fa-0029-4078-9421-4589130b51a3",
      freeform_id: "bf2da578-a65c-496c-9e63-0268e0c32516",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "90003c8a-5aa5-4383-a48c-f9a8ea16d504",
      dish_id: "d20d53fa-0029-4078-9421-4589130b51a3",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "7c75a0dd-4ad6-4123-b07e-4d6f3bb86255",
      dish_id: "d02d9910-d678-4898-bbc1-ada0aa62956b",
      freeform_id: "7e4fa2c0-839e-4360-a86b-b1dfa5b52eef",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "fc1e1ef4-3589-4e1a-8d40-8634c0c75365",
      dish_id: "22dd897b-898d-462c-a7b9-42af469c5db2",
      freeform_id: "bf2da578-a65c-496c-9e63-0268e0c32516",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "abc2abe3-f345-4e4b-8d14-f794dd4aeb95",
      dish_id: "22dd897b-898d-462c-a7b9-42af469c5db2",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "f4c2c58b-f923-4b44-8901-66e2993fdb80",
      dish_id: "68a2849f-2cc5-4bc1-bf7b-085a9bff7a6e",
      freeform_id: "bf2da578-a65c-496c-9e63-0268e0c32516",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "2ee81b20-dfac-49f1-92d4-32cf57b74b86",
      dish_id: "68a2849f-2cc5-4bc1-bf7b-085a9bff7a6e",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "e624d8bd-9d9c-41d6-8841-ed983e2ef7db",
      dish_id: "fcba3d0b-e97f-4af2-87f8-0a878f377e4d",
      freeform_id: "bf2da578-a65c-496c-9e63-0268e0c32516",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "a19e6cc4-4d1b-4fc8-b299-560b0642c49e",
      dish_id: "fcba3d0b-e97f-4af2-87f8-0a878f377e4d",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "5c96b54e-58e4-445a-9686-16a50e249002",
      dish_id: "9f8a3277-2c54-4a4f-8eea-cfc3da907c35",
      freeform_id: "bf2da578-a65c-496c-9e63-0268e0c32516",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "a0c875cb-33af-49ae-b845-3dcea8a440d6",
      dish_id: "9f8a3277-2c54-4a4f-8eea-cfc3da907c35",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "6239acda-c019-47cf-9feb-257dfe16c192",
      dish_id: "7fbf5b1c-0e35-4278-87c7-cf78625a1719",
      freeform_id: "bf2da578-a65c-496c-9e63-0268e0c32516",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "664d9626-737a-471d-a1d0-20fd43fb2a5f",
      dish_id: "7fbf5b1c-0e35-4278-87c7-cf78625a1719",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "af4cef90-83f6-4094-b81a-48eddf9b4b2e",
      dish_id: "2d7407bc-cbbb-4799-a914-10f0ba762151",
      freeform_id: "bf2da578-a65c-496c-9e63-0268e0c32516",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "2034b5a7-6344-4777-9034-ddd0c1005d2d",
      dish_id: "2d7407bc-cbbb-4799-a914-10f0ba762151",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "d4b1303c-0df4-4e23-a105-37f44811ad45",
      dish_id: "0f9d8620-87ed-4671-9310-d5294845da81",
      freeform_id: "bf2da578-a65c-496c-9e63-0268e0c32516",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "11858e65-f097-40cc-b9ae-c53868d89176",
      dish_id: "0f9d8620-87ed-4671-9310-d5294845da81",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "3894aab1-0039-4a71-830e-a8a56b62bca6",
      dish_id: "61a90179-a259-4cb1-a74a-6ef2f2588afb",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "0fe2db6d-fbca-4b39-8956-ce71cf73a10b",
      dish_id: "f7bd156d-e2df-4a35-bc29-d876bdbfa2fc",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "60edb4f4-93be-4703-aedd-260f68a29e61",
      dish_id: "7fb85c13-e959-4bad-aee1-3fccd8d97606",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "a3488bda-42d5-4739-bd01-90386ff39c08",
      dish_id: "156de8a9-24a5-46da-a3d7-639f5c73d06b",
      freeform_id: "bf2da578-a65c-496c-9e63-0268e0c32516",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "0e25e459-47ad-411a-95a6-7e3526490e69",
      dish_id: "156de8a9-24a5-46da-a3d7-639f5c73d06b",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "0fd9d5ca-d6e1-4368-ba01-c160ce0cc2ed",
      dish_id: "98376ffd-4090-4a39-bf79-d4e1c952099d",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "7268ef3c-7399-4181-ad73-db3bfc80ce3f",
      dish_id: "d293dc57-6de2-48c2-9ab8-9484dd386390",
      freeform_id: "bf2da578-a65c-496c-9e63-0268e0c32516",
    },
  });

  await prisma.dishFreeForm.create({
    data: {
      id: "5262b50e-3b64-4394-a331-2ce1823609d0",
      dish_id: "d293dc57-6de2-48c2-9ab8-9484dd386390",
      freeform_id: "f4653419-4386-4e32-96ac-9ccf4db8086d",
    },
  });

  // 10. Create Occasions
  console.log("🎉 Creating occasions...");
  await prisma.occassion.create({
    data: {
      id: "e95580cc-eeff-461d-a551-f61e97c1b043",
      name: "Afternoon Tea",
      image_url: null,
      description: "Elegant afternoon tea service",
    },
  });

  await prisma.occassion.create({
    data: {
      id: "d45a3a40-95cd-4194-90cd-32642197593d",
      name: "Birthday Party",
      image_url: null,
      description: "Birthday celebrations",
    },
  });

  await prisma.occassion.create({
    data: {
      id: "01e240e9-38bf-45a2-a13c-98f7c31d1a2f",
      name: "Wedding",
      image_url: null,
      description: "Wedding celebrations and receptions",
    },
  });

  await prisma.occassion.create({
    data: {
      id: "8aa633fd-57f4-4ed5-b9bb-18ff4f8afb33",
      name: "Corporate Event",
      image_url: null,
      description: "Business meetings, conferences, and corporate gatherings",
    },
  });

  await prisma.occassion.create({
    data: {
      id: "e8619f34-9b02-4b9c-b9cc-cb06d1bb5349",
      name: "Graduation",
      image_url: null,
      description: "Graduation ceremonies and celebrations",
    },
  });

  await prisma.occassion.create({
    data: {
      id: "5bc4fe2a-1737-462b-879c-2c12d4f97b05",
      name: "Anniversary",
      image_url: null,
      description: "Anniversary celebrations",
    },
  });

  await prisma.occassion.create({
    data: {
      id: "0209c459-43b3-40ec-88a1-b36923efe2b7",
      name: "Engagement",
      image_url: null,
      description: "Engagement parties and celebrations",
    },
  });

  await prisma.occassion.create({
    data: {
      id: "1025949c-122b-4b9f-a84d-57f6af59bb09",
      name: "Arabic Theme Night",
      image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop",
      description: "Authentic Arabic buffet experience with traditional Middle Eastern cuisine",
    },
  });

  await prisma.occassion.create({
    data: {
      id: "5bebfd39-d0a2-42e9-bb24-94f63ffaac43",
      name: "Indian Buffet",
      image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
      description: "Authentic Indian buffet experience with traditional Indian cuisine and premier buffet services",
    },
  });

  await prisma.occassion.create({
    data: {
      id: "b74a1e50-342b-4c6c-9932-117fbae25bd5",
      name: "Traditional afternoon tea",
      image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      description: "Elegant traditional afternoon tea service with finger sandwiches, scones, and pastries",
    },
  });

  // 11. Create Packages
  console.log("🎁 Creating packages...");
  await prisma.package.create({
    data: {
      id: "686e8baf-2384-4c02-87ef-64d879a182b0",
      name: "Spice Kitchen - Executive Corporate Lunch",
      description: null,
      minimum_people: 49,
      cover_image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      total_price: 3136,
      currency: "AED",
      rating: 4.515140581439239,
      is_active: true,
      is_available: true,
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "87602e88-4e6f-4ce2-9449-2ed65324bea5",
      name: "Spice Kitchen - Kids Birthday Party Package",
      description: null,
      minimum_people: 27,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
      total_price: 1620,
      currency: "AED",
      rating: 4.694892016645106,
      is_active: true,
      is_available: true,
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "e5f1ffd2-61e5-4ad9-b31a-b3eb283d941a",
      name: "Mediterranean Taste - Graduation Celebration",
      description: null,
      minimum_people: 66,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
      total_price: 4620,
      currency: "AED",
      rating: 4.617307769443347,
      is_active: true,
      is_available: true,
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "c974db2a-8dc8-4224-b403-a69addd1e9bd",
      name: "Mediterranean Taste - Engagement Party Package",
      description: null,
      minimum_people: 100,
      cover_image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      total_price: 8500,
      currency: "AED",
      rating: 4.885468171269933,
      is_active: true,
      is_available: true,
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "c23a4a56-3955-41f1-803a-891db5f6aed3",
      name: "Mediterranean Taste - Anniversary Dinner",
      description: null,
      minimum_people: 16,
      cover_image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      total_price: 1120,
      currency: "AED",
      rating: 4.804071337644389,
      is_active: true,
      is_available: true,
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "5b3eacb1-31bf-4059-9e7e-c83c2a0cff76",
      name: "Mediterranean Taste - Corporate Buffet",
      description: null,
      minimum_people: 154,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
      total_price: 12320,
      currency: "AED",
      rating: 4.637092653878818,
      is_active: true,
      is_available: true,
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "95639828-3d59-4e6d-bc39-028b4f73405c",
      name: "Asian Fusion Catering - Customizable Party Package",
      description: null,
      minimum_people: 74,
      cover_image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      total_price: 5180,
      currency: "AED",
      rating: 4.548255768086764,
      is_active: true,
      is_available: true,
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "ec2930cc-f90e-4f1e-9fae-c730830a433c",
      name: "Asian Fusion Catering - Premium Wedding Reception",
      description: null,
      minimum_people: 217,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
      total_price: 19530,
      currency: "AED",
      rating: 5.033828770044109,
      is_active: true,
      is_available: true,
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "dabd839d-a9ca-4c3c-a106-938023b5f66f",
      name: "Asian Fusion Catering - Executive Corporate Lunch",
      description: null,
      minimum_people: 37,
      cover_image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      total_price: 2368,
      currency: "AED",
      rating: 4.505609456860285,
      is_active: true,
      is_available: true,
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "ff42e49e-e6b2-4f4c-a54e-82bc5e2ab6db",
      name: "Italian Bistro Catering - Kids Birthday Party Package",
      description: null,
      minimum_people: 54,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
      total_price: 3240,
      currency: "AED",
      rating: 4.701500437570671,
      is_active: true,
      is_available: true,
      caterer_id: "062e1b49-c510-43a9-b2f2-80e5c45d4c95",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "b156bc85-0906-44c1-b8d6-c18cb41e5b9d",
      name: "Italian Bistro Catering - Graduation Celebration",
      description: null,
      minimum_people: 51,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
      total_price: 3570,
      currency: "AED",
      rating: 4.579301624066241,
      is_active: true,
      is_available: true,
      caterer_id: "062e1b49-c510-43a9-b2f2-80e5c45d4c95",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "57702fea-a6e0-458e-b3ed-a0fcb42a70f8",
      name: "BBQ Master Catering - Anniversary Dinner",
      description: null,
      minimum_people: 39,
      cover_image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      total_price: 2730,
      currency: "AED",
      rating: 4.78619466809397,
      is_active: true,
      is_available: true,
      caterer_id: "b7aeba66-23db-4493-949d-0e82e0f3549a",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "f94e3e9f-c3b1-45f2-918f-c1321c0c9405",
      name: "BBQ Master Catering - Corporate Buffet",
      description: null,
      minimum_people: 127,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
      total_price: 10160,
      currency: "AED",
      rating: 4.578912270284956,
      is_active: true,
      is_available: true,
      caterer_id: "b7aeba66-23db-4493-949d-0e82e0f3549a",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "381240ba-829d-4e4f-aec8-4bffec02717a",
      name: "BBQ Master Catering - Customizable Party Package",
      description: null,
      minimum_people: 40,
      cover_image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      total_price: 2800,
      currency: "AED",
      rating: 4.453916045485375,
      is_active: true,
      is_available: true,
      caterer_id: "b7aeba66-23db-4493-949d-0e82e0f3549a",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "ef09976c-3b05-4833-b610-10f6d4f54c0b",
      name: "Dessert Dreams Catering - Royal Wedding Package",
      description: null,
      minimum_people: 75,
      cover_image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      total_price: 6375,
      currency: "AED",
      rating: 4.684712404231925,
      is_active: true,
      is_available: true,
      caterer_id: "647740d9-7885-4205-b56d-cd4087ae6a58",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "5be7963b-f5a2-4f32-ab3c-08cdabaa768c",
      name: "Dessert Dreams Catering - Executive Corporate Lunch",
      description: null,
      minimum_people: 58,
      cover_image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      total_price: 3712,
      currency: "AED",
      rating: 4.604993834856585,
      is_active: true,
      is_available: true,
      caterer_id: "647740d9-7885-4205-b56d-cd4087ae6a58",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "aa2562dc-2abb-445f-89c0-d25bb133d355",
      name: "Dessert Dreams Catering - Kids Birthday Party Package",
      description: null,
      minimum_people: 6,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
      total_price: 360,
      currency: "AED",
      rating: 4.698899889545865,
      is_active: true,
      is_available: true,
      caterer_id: "647740d9-7885-4205-b56d-cd4087ae6a58",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "91e6936e-4a03-4b17-83bf-a4aad55e5dea",
      name: "Veggie Paradise - Graduation Celebration",
      description: null,
      minimum_people: 75,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
      total_price: 5250,
      currency: "AED",
      rating: 4.648882774182401,
      is_active: true,
      is_available: true,
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "a310dafa-284f-4c44-8ead-b88368de7484",
      name: "Veggie Paradise - Engagement Party Package",
      description: null,
      minimum_people: 89,
      cover_image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      total_price: 7565,
      currency: "AED",
      rating: 4.946507561646996,
      is_active: true,
      is_available: true,
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "2c885d05-36e8-48dd-a899-7c785324b261",
      name: "Veggie Paradise - Anniversary Dinner",
      description: null,
      minimum_people: 34,
      cover_image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      total_price: 2380,
      currency: "AED",
      rating: 4.828405669378996,
      is_active: true,
      is_available: true,
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "79db3adb-072a-4d15-b1d7-b79073b86a2a",
      name: "Seafood Specialists - Customizable Party Package",
      description: null,
      minimum_people: 51,
      cover_image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      total_price: 3570,
      currency: "AED",
      rating: 4.687044194742151,
      is_active: true,
      is_available: true,
      caterer_id: "ba55496c-e65d-4c7a-82e2-d981bb44fa7d",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "1318014c-e046-4735-bf66-fb0c4679456f",
      name: "Asian Fusion Catering - Royal Wedding Package",
      description: "A versatile package designed to cater to various tastes and preferences. Features our caterer's signature specialties.",
      minimum_people: 101,
      cover_image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      total_price: 8585,
      currency: "AED",
      rating: 4.766793640510652,
      is_active: true,
      is_available: true,
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "2631f1bd-c880-402c-9b2f-c0f8e0b55a63",
      name: "Italian Bistro Catering - Elegant Afternoon Tea",
      description: "Hearty and flavorful meals that bring the comfort of home-cooked food to your large-scale events and parties.",
      minimum_people: -4,
      cover_image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      total_price: -190,
      currency: "AED",
      rating: 4.83445245373878,
      is_active: true,
      is_available: true,
      caterer_id: "062e1b49-c510-43a9-b2f2-80e5c45d4c95",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "66b8b04c-d167-4ede-9970-165a196fb728",
      name: "Custom Package - 3 dishes - 25 people",
      description: null,
      minimum_people: 25,
      cover_image_url: null,
      total_price: 35,
      currency: "AED",
      rating: null,
      is_active: true,
      is_available: true,
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      user_id: "ec834308-57dc-45df-b7e1-3c49f0822e58",
      created_by: "USER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "aefe1eda-066e-443a-820b-96a6eede9c06",
      name: "Premium Catering Solutions - Kids Birthday Party Package",
      description: null,
      minimum_people: 21,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
      total_price: 1260,
      currency: "AED",
      rating: 4.814747561776455,
      is_active: true,
      is_available: true,
      caterer_id: "38355e5b-b3cb-4e8d-9722-d24f4dbd5468",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "ee44e840-b03b-469f-be69-3069388563f9",
      name: "Premium Catering Solutions - Elegant Afternoon Tea",
      description: null,
      minimum_people: 26,
      cover_image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      total_price: 1235,
      currency: "AED",
      rating: 4.813495127935679,
      is_active: true,
      is_available: true,
      caterer_id: "38355e5b-b3cb-4e8d-9722-d24f4dbd5468",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "ea6bc35f-5057-4875-964d-f6d175a394db",
      name: "Premium Catering Solutions - Graduation Celebration",
      description: null,
      minimum_people: 53,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
      total_price: 3710,
      currency: "AED",
      rating: 4.707781983503587,
      is_active: true,
      is_available: true,
      caterer_id: "38355e5b-b3cb-4e8d-9722-d24f4dbd5468",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "81567657-d679-4de9-9a25-6596f43c8e1e",
      name: "Premium Catering Solutions - Engagement Party Package",
      description: null,
      minimum_people: 87,
      cover_image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      total_price: 7395,
      currency: "AED",
      rating: 4.818962357185027,
      is_active: true,
      is_available: true,
      caterer_id: "38355e5b-b3cb-4e8d-9722-d24f4dbd5468",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "06431646-93bb-4f74-bf0c-f2e22de94b9f",
      name: "Seafood Specialists - Royal Wedding Package",
      description: "Experience a burst of traditional flavors with our specially curated menu. Perfect for making your special occasions more memorable.",
      minimum_people: 112,
      cover_image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      total_price: 9520,
      currency: "AED",
      rating: 4.844041182867474,
      is_active: true,
      is_available: true,
      caterer_id: "ba55496c-e65d-4c7a-82e2-d981bb44fa7d",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "52597ea1-40f9-47d5-bd87-b3076a70c899",
      name: "Chocolate Wedding Cake",
      description: null,
      minimum_people: 50,
      cover_image_url: "https://res.cloudinary.com/ducldnoro/image/upload/v1768409310/partyfud/packages/f1souy2fquhtgsictbsk.jpg",
      total_price: 600,
      currency: "AED",
      rating: null,
      is_active: true,
      is_available: true,
      caterer_id: "14aedafb-065b-46d3-b21b-1fd2bdff364f",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "CUSTOMISABLE",
      additional_info: "A beautifully crafted cake is more than just a dessert — it's the centerpiece of your celebration. From towering wedding cakes adorned with sugar flowers to whimsical birthday creations, the right cake tells your story.\r\n\r\nOur curated caterers specialize in everything from classic Victoria sponges to avant-garde flavor combinations. Whether you're dreaming of a naked cake draped in fresh berries or an elaborate fondant masterpiece, you'll find the perfect baker to bring your vision to life.",
    },
  });

  await prisma.package.create({
    data: {
      id: "aa70060e-701e-4b63-9b62-99163d70be6a",
      name: "Custom Package - 4 dishes - 25 people",
      description: null,
      minimum_people: 25,
      cover_image_url: null,
      total_price: 50,
      currency: "AED",
      rating: null,
      is_active: true,
      is_available: true,
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      user_id: "ec834308-57dc-45df-b7e1-3c49f0822e58",
      created_by: "USER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      name: "Jehangir Restaurant - Indian Premier Buffet",
      description: null,
      minimum_people: 25,
      cover_image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
      total_price: 2500,
      currency: "AED",
      rating: 4.9,
      is_active: true,
      is_available: true,
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: "extra crockery 5 aed \r\nper helper 5 aed/hour",
    },
  });

  await prisma.package.create({
    data: {
      id: "70742a68-6014-4f43-aa1d-ad8465049f1e",
      name: "Jehangir Restaurant - Kids Birthday Party Package",
      description: null,
      minimum_people: 20,
      cover_image_url: null,
      total_price: 200,
      currency: "AED",
      rating: null,
      is_active: true,
      is_available: true,
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: "crockery aed-20\r\nhelper 20 aed/hour",
    },
  });

  await prisma.package.create({
    data: {
      id: "25f9a97d-7c4e-4cce-b35f-4733ea1cd78f",
      name: "Delight Catering Co. - Elegant Afternoon Tea",
      description: "Gourmet dining experience featuring fresh, seasonal ingredients and expert preparation for a sophisticated palate.",
      minimum_people: 5,
      cover_image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      total_price: 237.5,
      currency: "AED",
      rating: 4.882599586402232,
      is_active: true,
      is_available: true,
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "b6040d20-53d7-4226-8f8d-5a3cb86659a2",
      name: "Custom Menu - Jehangir Restaurant",
      description: null,
      minimum_people: 20,
      cover_image_url: null,
      total_price: 25,
      currency: "AED",
      rating: null,
      is_active: true,
      is_available: true,
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      user_id: "ec834308-57dc-45df-b7e1-3c49f0822e58",
      created_by: "USER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "7b3e48d2-12f6-4fb8-9567-adc779210428",
      name: "Birthday",
      description: null,
      minimum_people: 50,
      cover_image_url: "https://res.cloudinary.com/ducldnoro/image/upload/v1768394972/partyfud/packages/lbfkudwqnuwe8ayiib3q.jpg",
      total_price: 100.01,
      currency: "AED",
      rating: null,
      is_active: true,
      is_available: true,
      caterer_id: "6293ee60-c522-4d45-8228-6c635ef21520",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "969e1f02-a7d4-4b8c-8dde-6b9df6174052",
      name: "Custom Package - 6 dishes - 25 people",
      description: null,
      minimum_people: 25,
      cover_image_url: null,
      total_price: 80,
      currency: "AED",
      rating: null,
      is_active: true,
      is_available: true,
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      user_id: "ec834308-57dc-45df-b7e1-3c49f0822e58",
      created_by: "USER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      name: "fixed indian",
      description: "testing the description Authentic cuisine with fresh ingredients. Perfect for sophisticated palates.",
      minimum_people: 10,
      cover_image_url: null,
      total_price: 300,
      currency: "AED",
      rating: null,
      is_active: true,
      is_available: true,
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "CUSTOMISABLE",
      additional_info: "helper 200 aed/hour hello",
    },
  });

  await prisma.package.create({
    data: {
      id: "0469c7e8-9b9e-468f-89d7-df9d634b047d",
      name: "Seafood Specialists - Premium Wedding Reception",
      description: "A premium selection of authentic dishes prepared with the finest ingredients. Ideal for corporate events and family gatherings.",
      minimum_people: 222,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
      total_price: 19980,
      currency: "AED",
      rating: 4.939520762763606,
      is_active: true,
      is_available: true,
      caterer_id: "ba55496c-e65d-4c7a-82e2-d981bb44fa7d",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "f1ef6493-8e2f-4396-b2cb-bd9137486185",
      name: "Custom Package - 2 dishes - 30 people",
      description: null,
      minimum_people: 30,
      cover_image_url: null,
      total_price: 20,
      currency: "AED",
      rating: null,
      is_active: true,
      is_available: true,
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      user_id: "ec834308-57dc-45df-b7e1-3c49f0822e58",
      created_by: "USER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "cfc8ea24-547e-436b-aba3-c0ec5e86cdd6",
      name: "Custom Package - 2 dishes - 40 people",
      description: null,
      minimum_people: 40,
      cover_image_url: null,
      total_price: 20,
      currency: "AED",
      rating: null,
      is_active: true,
      is_available: true,
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      user_id: "ec834308-57dc-45df-b7e1-3c49f0822e58",
      created_by: "USER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "d20567da-3774-4f0a-ae13-36220e91d3f1",
      name: "Custom Package - 2 dishes - 40 people",
      description: null,
      minimum_people: 40,
      cover_image_url: null,
      total_price: 20,
      currency: "AED",
      rating: null,
      is_active: true,
      is_available: true,
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      user_id: "ec834308-57dc-45df-b7e1-3c49f0822e58",
      created_by: "USER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "c0681ff8-35df-4487-a2eb-6ca108ab591c",
      name: "Custom Package - 2 dishes - 25 people",
      description: null,
      minimum_people: 25,
      cover_image_url: null,
      total_price: 500,
      currency: "AED",
      rating: null,
      is_active: true,
      is_available: true,
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      user_id: "ec834308-57dc-45df-b7e1-3c49f0822e58",
      created_by: "USER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "4c46944c-3a1e-4e2f-a7df-8987604dce5b",
      name: "Jehangir Restaurant - Executive Corporate Lunch",
      description: null,
      minimum_people: 70,
      cover_image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      total_price: 4480,
      currency: "AED",
      rating: 4.350598522677754,
      is_active: true,
      is_available: true,
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "f8c27ab1-a1be-4e8e-9380-92bb0e0c2074",
      name: "Jehangir Restaurant - Kids Birthday Party Package",
      description: null,
      minimum_people: 20,
      cover_image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      total_price: 1200,
      currency: "AED",
      rating: 4.728977939119772,
      is_active: true,
      is_available: true,
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      name: "The Lime Tree Cafe & Kitchen - Traditional Afternoon Tea",
      description: null,
      minimum_people: 25,
      cover_image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      total_price: 2500,
      currency: "AED",
      rating: 4.8,
      is_active: true,
      is_available: true,
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      name: "Arabic Buffet by Abela & Co.",
      description: null,
      minimum_people: 35,
      cover_image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop",
      total_price: 3850,
      currency: "AED",
      rating: 4.8,
      is_active: true,
      is_available: true,
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "d25cdd35-8c26-4e55-988f-ab2cdb61c673",
      name: "Royal Catering Services - Customizable Party Package",
      description: null,
      minimum_people: 74,
      cover_image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      total_price: 5180,
      currency: "AED",
      rating: 4.741514903068322,
      is_active: true,
      is_available: true,
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "6d1462f1-e891-49a7-84bf-8c8357d7d4c8",
      name: "Royal Catering Services - Premium Wedding Reception",
      description: null,
      minimum_people: 175,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
      total_price: 15750,
      currency: "AED",
      rating: 4.916891531595978,
      is_active: true,
      is_available: true,
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "3047be04-4358-4b47-9729-ae934e7fb932",
      name: "Royal Catering Services - Royal Wedding Package",
      description: null,
      minimum_people: 84,
      cover_image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      total_price: 7140,
      currency: "AED",
      rating: 4.790912818330985,
      is_active: true,
      is_available: true,
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "3097ca4e-4c6d-43ba-a55e-bc06f91032f6",
      name: "Delight Catering Co. - Kids Birthday Party Package",
      description: null,
      minimum_people: 37,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
      total_price: 2220,
      currency: "AED",
      rating: 4.641577429829264,
      is_active: true,
      is_available: true,
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "e4d57532-1b04-4b2f-8fc5-8850acd3e0a7",
      name: "Delight Catering Co. - Graduation Celebration",
      description: null,
      minimum_people: 77,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
      total_price: 5390,
      currency: "AED",
      rating: 4.678382296622821,
      is_active: true,
      is_available: true,
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "cdc7fee9-2704-4879-8bed-54c200d97efc",
      name: "Elegant Events Catering - Anniversary Dinner",
      description: null,
      minimum_people: 40,
      cover_image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      total_price: 2800,
      currency: "AED",
      rating: 4.718441241413629,
      is_active: true,
      is_available: true,
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "947b2da6-ab4c-489d-86e3-c4cea91a41b9",
      name: "Elegant Events Catering - Corporate Buffet",
      description: null,
      minimum_people: 151,
      cover_image_url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
      total_price: 12080,
      currency: "AED",
      rating: 4.35390541199883,
      is_active: true,
      is_available: true,
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "708ee8cd-6a3f-4379-8f06-db4976dd273e",
      name: "Elegant Events Catering - Customizable Party Package",
      description: null,
      minimum_people: 67,
      cover_image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      total_price: 4690,
      currency: "AED",
      rating: 4.500861211274876,
      is_active: true,
      is_available: true,
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "CUSTOMISABLE",
      additional_info: null,
    },
  });

  await prisma.package.create({
    data: {
      id: "5441d5ed-b859-484b-bf48-689407cbefb4",
      name: "Spice Kitchen - Royal Wedding Package",
      description: null,
      minimum_people: 105,
      cover_image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      total_price: 8925,
      currency: "AED",
      rating: 4.778601977762445,
      is_active: true,
      is_available: true,
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      user_id: null,
      created_by: "CATERER",
      customisation_type: "FIXED",
      additional_info: null,
    },
  });

  // 12. Create Package Items
  console.log("📦 Creating package items...");
  await prisma.packageItem.create({
    data: {
      id: "c42c01e7-0876-4ec8-bf2e-e9a4e38ca475",
      package_id: "686e8baf-2384-4c02-87ef-64d879a182b0",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "59679f8d-527f-4ec1-b049-b6bd3b1f8359",
      people_count: 49,
      is_optional: false,
      quantity: 16,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "666700df-986e-4eb7-9186-0396174c0595",
      package_id: "686e8baf-2384-4c02-87ef-64d879a182b0",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "22dd897b-898d-462c-a7b9-42af469c5db2",
      people_count: 49,
      is_optional: true,
      quantity: 20,
      price_at_time: 26,
      is_addon: true,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "fbe130d4-42ce-4085-bb51-f29ac0d892a4",
      package_id: "686e8baf-2384-4c02-87ef-64d879a182b0",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "7b7454df-c83a-4306-960c-b97b5e0cced2",
      people_count: 49,
      is_optional: true,
      quantity: 9,
      price_at_time: 42,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "7d213ba7-c7c8-4119-a574-0947a419ce2d",
      package_id: "686e8baf-2384-4c02-87ef-64d879a182b0",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "fcba3d0b-e97f-4af2-87f8-0a878f377e4d",
      people_count: 49,
      is_optional: false,
      quantity: 24,
      price_at_time: 18,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "181f1c75-dfd4-4b16-9df6-664517725c78",
      package_id: "686e8baf-2384-4c02-87ef-64d879a182b0",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "68a2849f-2cc5-4bc1-bf7b-085a9bff7a6e",
      people_count: 49,
      is_optional: false,
      quantity: 23,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "c62d3e44-c36d-4a95-bf8c-0f4499d922ef",
      package_id: "87602e88-4e6f-4ce2-9449-2ed65324bea5",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "59679f8d-527f-4ec1-b049-b6bd3b1f8359",
      people_count: 27,
      is_optional: true,
      quantity: 13,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "b18e9f0c-fde3-45c5-9633-01f5710db88a",
      package_id: "87602e88-4e6f-4ce2-9449-2ed65324bea5",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "7b7454df-c83a-4306-960c-b97b5e0cced2",
      people_count: 27,
      is_optional: false,
      quantity: 24,
      price_at_time: 42,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "8565dc7a-228c-41fe-bf4f-1bbe16ca51e4",
      package_id: "87602e88-4e6f-4ce2-9449-2ed65324bea5",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "68a2849f-2cc5-4bc1-bf7b-085a9bff7a6e",
      people_count: 27,
      is_optional: false,
      quantity: 17,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "6c809791-85bc-45e7-8cca-458ac764f859",
      package_id: "87602e88-4e6f-4ce2-9449-2ed65324bea5",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "22dd897b-898d-462c-a7b9-42af469c5db2",
      people_count: 27,
      is_optional: false,
      quantity: 13,
      price_at_time: 26,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "323d3e37-b502-42bc-b799-bc44354b9300",
      package_id: "87602e88-4e6f-4ce2-9449-2ed65324bea5",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "fcba3d0b-e97f-4af2-87f8-0a878f377e4d",
      people_count: 27,
      is_optional: false,
      quantity: 11,
      price_at_time: 18,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "4ef91bff-7b42-470c-b867-674bc38bd9cd",
      package_id: "e5f1ffd2-61e5-4ad9-b31a-b3eb283d941a",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "b45f7053-3be9-4114-b2bd-6a21beca6efa",
      people_count: 66,
      is_optional: false,
      quantity: 24,
      price_at_time: 28,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "7f8a16db-a570-4da3-b811-0743a79c720a",
      package_id: "e5f1ffd2-61e5-4ad9-b31a-b3eb283d941a",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "03aed511-7d2e-405f-809c-ba8d650ee9d9",
      people_count: 66,
      is_optional: false,
      quantity: 13,
      price_at_time: 30,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "cd52f4c8-07ec-4486-a8b9-325626fcd411",
      package_id: "e5f1ffd2-61e5-4ad9-b31a-b3eb283d941a",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "55dc3ac3-63d3-4af1-ab10-a517d62e2238",
      people_count: 66,
      is_optional: false,
      quantity: 7,
      price_at_time: 16,
      is_addon: true,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "4c72fed6-1447-4974-aca2-2abb6dacce3c",
      package_id: "e5f1ffd2-61e5-4ad9-b31a-b3eb283d941a",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "4f852297-178e-4bd7-a5ec-15fd2f7e594d",
      people_count: 66,
      is_optional: true,
      quantity: 15,
      price_at_time: 55,
      is_addon: true,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "f0460812-7269-47df-83ae-ac285333c9db",
      package_id: "e5f1ffd2-61e5-4ad9-b31a-b3eb283d941a",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "61b7085d-24d7-49df-af08-f4bdfe928c75",
      people_count: 66,
      is_optional: false,
      quantity: 18,
      price_at_time: 22,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "3c806eec-eb32-455a-9531-2c80e699c0ec",
      package_id: "e5f1ffd2-61e5-4ad9-b31a-b3eb283d941a",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "04765a02-01f9-4e48-83e0-07443b832abd",
      people_count: 66,
      is_optional: false,
      quantity: 19,
      price_at_time: 35,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "4e006515-4f31-4220-9b82-9ebe584afd3e",
      package_id: "e5f1ffd2-61e5-4ad9-b31a-b3eb283d941a",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "8a7a1e30-405d-4f51-8f47-61345813d4a0",
      people_count: 66,
      is_optional: false,
      quantity: 8,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "5eafb354-0dc9-45ad-86e1-9fb228324941",
      package_id: "c974db2a-8dc8-4224-b403-a69addd1e9bd",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "55dc3ac3-63d3-4af1-ab10-a517d62e2238",
      people_count: 100,
      is_optional: false,
      quantity: 17,
      price_at_time: 16,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "113461d8-f89b-4e8e-b349-18a32c56b915",
      package_id: "c974db2a-8dc8-4224-b403-a69addd1e9bd",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "bd0fdd57-b62f-4bf2-a885-34abb0977c94",
      people_count: 100,
      is_optional: false,
      quantity: 11,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "1be62b1c-664b-44b7-b025-104cea4b2fb4",
      package_id: "c974db2a-8dc8-4224-b403-a69addd1e9bd",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "04765a02-01f9-4e48-83e0-07443b832abd",
      people_count: 100,
      is_optional: true,
      quantity: 5,
      price_at_time: 35,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "943dfa40-3ec7-43ac-bfdb-9dc1b3d2b498",
      package_id: "c974db2a-8dc8-4224-b403-a69addd1e9bd",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "03aed511-7d2e-405f-809c-ba8d650ee9d9",
      people_count: 100,
      is_optional: false,
      quantity: 15,
      price_at_time: 30,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "6cd2b6fe-9c1a-4c59-b87f-f955d9a5b064",
      package_id: "c974db2a-8dc8-4224-b403-a69addd1e9bd",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "61b7085d-24d7-49df-af08-f4bdfe928c75",
      people_count: 100,
      is_optional: true,
      quantity: 5,
      price_at_time: 22,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "dc544fac-e324-4dcf-b1ed-8b2a57ef6b81",
      package_id: "c974db2a-8dc8-4224-b403-a69addd1e9bd",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "4f852297-178e-4bd7-a5ec-15fd2f7e594d",
      people_count: 100,
      is_optional: false,
      quantity: 21,
      price_at_time: 55,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "df0acdbc-7f47-403d-a307-ff3af6026b1f",
      package_id: "c23a4a56-3955-41f1-803a-891db5f6aed3",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "bd0fdd57-b62f-4bf2-a885-34abb0977c94",
      people_count: 16,
      is_optional: false,
      quantity: 14,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "08e396fb-96b6-4b9b-a359-ddcf48813196",
      package_id: "c23a4a56-3955-41f1-803a-891db5f6aed3",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "61b7085d-24d7-49df-af08-f4bdfe928c75",
      people_count: 16,
      is_optional: false,
      quantity: 14,
      price_at_time: 22,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "b107e281-30ab-416e-92ff-1d08f7d6c318",
      package_id: "c23a4a56-3955-41f1-803a-891db5f6aed3",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "04765a02-01f9-4e48-83e0-07443b832abd",
      people_count: 16,
      is_optional: true,
      quantity: 14,
      price_at_time: 35,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "2764bfd4-60c4-44c7-9f32-e085af6c0657",
      package_id: "c23a4a56-3955-41f1-803a-891db5f6aed3",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "b45f7053-3be9-4114-b2bd-6a21beca6efa",
      people_count: 16,
      is_optional: true,
      quantity: 6,
      price_at_time: 28,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "06c0957a-1b36-4148-8c91-b0f343f416c4",
      package_id: "c23a4a56-3955-41f1-803a-891db5f6aed3",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "03aed511-7d2e-405f-809c-ba8d650ee9d9",
      people_count: 16,
      is_optional: true,
      quantity: 14,
      price_at_time: 30,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "db8e443a-3b56-42b6-b878-73fb1e67f539",
      package_id: "c23a4a56-3955-41f1-803a-891db5f6aed3",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "4f852297-178e-4bd7-a5ec-15fd2f7e594d",
      people_count: 16,
      is_optional: true,
      quantity: 13,
      price_at_time: 55,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "e4ca5a85-c1f0-4c7a-b720-fe8f8a1b92cb",
      package_id: "c23a4a56-3955-41f1-803a-891db5f6aed3",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "8a7a1e30-405d-4f51-8f47-61345813d4a0",
      people_count: 16,
      is_optional: false,
      quantity: 22,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "6ed3de7d-9a14-420d-873b-fbd64ab24bad",
      package_id: "c23a4a56-3955-41f1-803a-891db5f6aed3",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "55dc3ac3-63d3-4af1-ab10-a517d62e2238",
      people_count: 16,
      is_optional: false,
      quantity: 21,
      price_at_time: 16,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "07704398-e7f6-46d3-995b-ec55da90639e",
      package_id: "c23a4a56-3955-41f1-803a-891db5f6aed3",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "a18b52cb-75c2-44d7-9e26-f43ead9c6e5d",
      people_count: 16,
      is_optional: true,
      quantity: 18,
      price_at_time: 38,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "84cc0a10-6da6-463e-8133-254870c9b06c",
      package_id: "5b3eacb1-31bf-4059-9e7e-c83c2a0cff76",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "b45f7053-3be9-4114-b2bd-6a21beca6efa",
      people_count: 154,
      is_optional: false,
      quantity: 19,
      price_at_time: 28,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "22d10f99-3715-43c0-8576-74fcd7885b0e",
      package_id: "5b3eacb1-31bf-4059-9e7e-c83c2a0cff76",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "55dc3ac3-63d3-4af1-ab10-a517d62e2238",
      people_count: 154,
      is_optional: true,
      quantity: 11,
      price_at_time: 16,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "da06a660-9474-4ef4-92b0-f040d89a62e3",
      package_id: "5b3eacb1-31bf-4059-9e7e-c83c2a0cff76",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "8a7a1e30-405d-4f51-8f47-61345813d4a0",
      people_count: 154,
      is_optional: false,
      quantity: 20,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "a7655945-3da5-4051-97f3-a75938d12db0",
      package_id: "5b3eacb1-31bf-4059-9e7e-c83c2a0cff76",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "02b1d615-42cb-4386-ae08-174c558b829f",
      people_count: 154,
      is_optional: false,
      quantity: 21,
      price_at_time: 48,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "491df6fc-f57d-41c3-be78-f2e63b9bab80",
      package_id: "5b3eacb1-31bf-4059-9e7e-c83c2a0cff76",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "a18b52cb-75c2-44d7-9e26-f43ead9c6e5d",
      people_count: 154,
      is_optional: false,
      quantity: 11,
      price_at_time: 38,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "8c0aa3e1-8d6e-4389-986d-4d6aa22c8f6d",
      package_id: "5b3eacb1-31bf-4059-9e7e-c83c2a0cff76",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "03aed511-7d2e-405f-809c-ba8d650ee9d9",
      people_count: 154,
      is_optional: false,
      quantity: 6,
      price_at_time: 30,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "e973acd9-1f7a-4546-85b4-876fb3f27e0d",
      package_id: "5b3eacb1-31bf-4059-9e7e-c83c2a0cff76",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "bd0fdd57-b62f-4bf2-a885-34abb0977c94",
      people_count: 154,
      is_optional: true,
      quantity: 23,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "5e851cdf-9e74-452b-8065-7fb7d750b99d",
      package_id: "5b3eacb1-31bf-4059-9e7e-c83c2a0cff76",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "4f852297-178e-4bd7-a5ec-15fd2f7e594d",
      people_count: 154,
      is_optional: false,
      quantity: 13,
      price_at_time: 55,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "bfc027ef-5228-4a84-a886-dc41922addef",
      package_id: "5b3eacb1-31bf-4059-9e7e-c83c2a0cff76",
      caterer_id: "9bd446ba-39e7-4f7b-a7f1-04fa94852406",
      dish_id: "61b7085d-24d7-49df-af08-f4bdfe928c75",
      people_count: 154,
      is_optional: false,
      quantity: 17,
      price_at_time: 22,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "2898f3f9-4095-4c05-a99b-56bd39efb76f",
      package_id: "95639828-3d59-4e6d-bc39-028b4f73405c",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "4b816edb-b9dd-4f20-a318-b05d0d62fec5",
      people_count: 74,
      is_optional: false,
      quantity: 5,
      price_at_time: 28,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "525657ce-f375-45e8-86ea-ec9852b52e00",
      package_id: "95639828-3d59-4e6d-bc39-028b4f73405c",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "e4c278e1-a45f-4534-84a5-a71939cdd8a5",
      people_count: 74,
      is_optional: false,
      quantity: 7,
      price_at_time: 40,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "3f3090d5-79fe-4c26-936f-1537b2b7a0b7",
      package_id: "95639828-3d59-4e6d-bc39-028b4f73405c",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "57f702a5-1e48-4430-a150-823aac6bdea9",
      people_count: 74,
      is_optional: true,
      quantity: 18,
      price_at_time: 24,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "0227d114-996f-474e-843e-ac2526751b2c",
      package_id: "95639828-3d59-4e6d-bc39-028b4f73405c",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "cd3673c9-4409-4d04-b1f1-071a12a95c80",
      people_count: 74,
      is_optional: false,
      quantity: 6,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "656d2b87-bab9-48ac-9ba4-d392ac542950",
      package_id: "95639828-3d59-4e6d-bc39-028b4f73405c",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "25c7733c-7148-42a3-80fe-6d642be9e135",
      people_count: 74,
      is_optional: false,
      quantity: 10,
      price_at_time: 38,
      is_addon: true,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "3972e0f9-d27f-4f9d-a4ae-c76a5f956e26",
      package_id: "95639828-3d59-4e6d-bc39-028b4f73405c",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "11f3596c-43b0-44d4-a65e-4c5eb00cf264",
      people_count: 74,
      is_optional: true,
      quantity: 22,
      price_at_time: 35,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "15240825-19b2-4c98-95c1-4e20a28219f0",
      package_id: "ec2930cc-f90e-4f1e-9fae-c730830a433c",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "57f702a5-1e48-4430-a150-823aac6bdea9",
      people_count: 217,
      is_optional: true,
      quantity: 6,
      price_at_time: 24,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "cb25db7e-0b49-4c2a-8122-22489e7c147c",
      package_id: "ec2930cc-f90e-4f1e-9fae-c730830a433c",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "e4c278e1-a45f-4534-84a5-a71939cdd8a5",
      people_count: 217,
      is_optional: true,
      quantity: 17,
      price_at_time: 40,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "8b10acad-e147-484a-908f-cd10299da85a",
      package_id: "ec2930cc-f90e-4f1e-9fae-c730830a433c",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "cd3673c9-4409-4d04-b1f1-071a12a95c80",
      people_count: 217,
      is_optional: true,
      quantity: 18,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "0f4d11f4-1959-4d16-a335-0db588005dcf",
      package_id: "ec2930cc-f90e-4f1e-9fae-c730830a433c",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "4b816edb-b9dd-4f20-a318-b05d0d62fec5",
      people_count: 217,
      is_optional: false,
      quantity: 13,
      price_at_time: 28,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "d3dd5a39-f10b-4bae-b782-0dab66618423",
      package_id: "ec2930cc-f90e-4f1e-9fae-c730830a433c",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "11f3596c-43b0-44d4-a65e-4c5eb00cf264",
      people_count: 217,
      is_optional: false,
      quantity: 11,
      price_at_time: 35,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "3a1de0f4-151d-4c0c-8d0a-4b2ddbc3b5a6",
      package_id: "ec2930cc-f90e-4f1e-9fae-c730830a433c",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "41f719c2-cb90-40a4-88ff-fe345457bbce",
      people_count: 217,
      is_optional: false,
      quantity: 14,
      price_at_time: 22,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "340840a2-81b2-4928-9ec8-b18556a411ef",
      package_id: "ec2930cc-f90e-4f1e-9fae-c730830a433c",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "25c7733c-7148-42a3-80fe-6d642be9e135",
      people_count: 217,
      is_optional: true,
      quantity: 6,
      price_at_time: 38,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "b51e7edd-d29e-41b6-94c9-28bda9aad5d7",
      package_id: "dabd839d-a9ca-4c3c-a106-938023b5f66f",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "41f719c2-cb90-40a4-88ff-fe345457bbce",
      people_count: 37,
      is_optional: false,
      quantity: 18,
      price_at_time: 22,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "500cae6a-ce22-44bb-916e-594909d89155",
      package_id: "dabd839d-a9ca-4c3c-a106-938023b5f66f",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "cd3673c9-4409-4d04-b1f1-071a12a95c80",
      people_count: 37,
      is_optional: false,
      quantity: 20,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "b72de8a9-2081-4d82-8b4a-58830216619b",
      package_id: "dabd839d-a9ca-4c3c-a106-938023b5f66f",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "11f3596c-43b0-44d4-a65e-4c5eb00cf264",
      people_count: 37,
      is_optional: true,
      quantity: 19,
      price_at_time: 35,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "a5d96af9-653b-4d11-a745-75569c84f0d9",
      package_id: "dabd839d-a9ca-4c3c-a106-938023b5f66f",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "25c7733c-7148-42a3-80fe-6d642be9e135",
      people_count: 37,
      is_optional: false,
      quantity: 13,
      price_at_time: 38,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "793cf2a8-e37f-4850-b0d0-61582c6984a4",
      package_id: "dabd839d-a9ca-4c3c-a106-938023b5f66f",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "4b816edb-b9dd-4f20-a318-b05d0d62fec5",
      people_count: 37,
      is_optional: false,
      quantity: 17,
      price_at_time: 28,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "c335a8ca-f433-49cb-8ec2-c0dae75dc617",
      package_id: "dabd839d-a9ca-4c3c-a106-938023b5f66f",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "e4c278e1-a45f-4534-84a5-a71939cdd8a5",
      people_count: 37,
      is_optional: false,
      quantity: 17,
      price_at_time: 40,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "88cc3177-60d8-420d-ba32-cf1b616c6ef2",
      package_id: "91e6936e-4a03-4b17-83bf-a4aad55e5dea",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "e4d0b6c4-ecae-4c1a-80d0-7c46d75bbecf",
      people_count: 75,
      is_optional: false,
      quantity: 22,
      price_at_time: 45,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "1fd592a9-69da-4c14-b98d-172a0b9692f8",
      package_id: "91e6936e-4a03-4b17-83bf-a4aad55e5dea",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "c7361ea0-6398-4c42-abd7-ab2fdbbbfaa3",
      people_count: 75,
      is_optional: false,
      quantity: 6,
      price_at_time: 85,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "b6d7d78f-ede6-4ed0-b316-d30f73180a50",
      package_id: "91e6936e-4a03-4b17-83bf-a4aad55e5dea",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "03bcda5c-d0ce-47c7-9f5f-53a51378f76e",
      people_count: 75,
      is_optional: false,
      quantity: 18,
      price_at_time: 35,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "1c0ad43e-7fc1-4faf-9cef-f79f11a7afce",
      package_id: "91e6936e-4a03-4b17-83bf-a4aad55e5dea",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "41ffc672-3228-490d-8c71-173259a9595e",
      people_count: 75,
      is_optional: false,
      quantity: 11,
      price_at_time: 52,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "d29c0104-d2a0-4041-912f-45d8b2481439",
      package_id: "91e6936e-4a03-4b17-83bf-a4aad55e5dea",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "66fa1969-79f2-4161-a2b4-6642ee700a32",
      people_count: 75,
      is_optional: false,
      quantity: 12,
      price_at_time: 38,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "120b2ad8-e072-4860-b2d0-898daa617ac5",
      package_id: "a310dafa-284f-4c44-8ead-b88368de7484",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "e4d0b6c4-ecae-4c1a-80d0-7c46d75bbecf",
      people_count: 89,
      is_optional: true,
      quantity: 15,
      price_at_time: 45,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "6bce6d04-05ea-41a7-9023-c0bbd47a43d3",
      package_id: "a310dafa-284f-4c44-8ead-b88368de7484",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "c7361ea0-6398-4c42-abd7-ab2fdbbbfaa3",
      people_count: 89,
      is_optional: false,
      quantity: 7,
      price_at_time: 85,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "3cbc243a-60c7-4700-ae9e-bf64d8590bd1",
      package_id: "a310dafa-284f-4c44-8ead-b88368de7484",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "03bcda5c-d0ce-47c7-9f5f-53a51378f76e",
      people_count: 89,
      is_optional: true,
      quantity: 13,
      price_at_time: 35,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "63c65353-2f82-4b7b-8267-c8b49246863e",
      package_id: "a310dafa-284f-4c44-8ead-b88368de7484",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "66fa1969-79f2-4161-a2b4-6642ee700a32",
      people_count: 89,
      is_optional: true,
      quantity: 16,
      price_at_time: 38,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "9ed2376c-06ce-4043-838f-ea163ce4f57f",
      package_id: "a310dafa-284f-4c44-8ead-b88368de7484",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "41ffc672-3228-490d-8c71-173259a9595e",
      people_count: 89,
      is_optional: false,
      quantity: 17,
      price_at_time: 52,
      is_addon: true,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "9f3190ad-6ec8-4007-9fed-381101d8352b",
      package_id: "2c885d05-36e8-48dd-a899-7c785324b261",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "03bcda5c-d0ce-47c7-9f5f-53a51378f76e",
      people_count: 34,
      is_optional: false,
      quantity: 24,
      price_at_time: 35,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "a8ce9afc-4880-496b-b2e0-fd6d1406fd09",
      package_id: "2c885d05-36e8-48dd-a899-7c785324b261",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "41ffc672-3228-490d-8c71-173259a9595e",
      people_count: 34,
      is_optional: false,
      quantity: 19,
      price_at_time: 52,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "7f909028-22ed-4282-b600-61c2778a4127",
      package_id: "2c885d05-36e8-48dd-a899-7c785324b261",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "c7361ea0-6398-4c42-abd7-ab2fdbbbfaa3",
      people_count: 34,
      is_optional: false,
      quantity: 15,
      price_at_time: 85,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "732575d0-a81d-4a0d-9f0b-5afa927c87c1",
      package_id: "2c885d05-36e8-48dd-a899-7c785324b261",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "66fa1969-79f2-4161-a2b4-6642ee700a32",
      people_count: 34,
      is_optional: true,
      quantity: 15,
      price_at_time: 38,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "803455e1-894e-4650-8eee-88e4e7f519bb",
      package_id: "2c885d05-36e8-48dd-a899-7c785324b261",
      caterer_id: "373df8d8-3cd7-422a-8765-c57f2d2b2db9",
      dish_id: "e4d0b6c4-ecae-4c1a-80d0-7c46d75bbecf",
      people_count: 34,
      is_optional: false,
      quantity: 16,
      price_at_time: 45,
      is_addon: true,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "54945825-e67a-4b70-9c38-bdc0414009dc",
      package_id: "1318014c-e046-4735-bf66-fb0c4679456f",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "57f702a5-1e48-4430-a150-823aac6bdea9",
      people_count: 101,
      is_optional: false,
      quantity: 9,
      price_at_time: 24,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "72f5e0d9-4715-4aec-8c2a-5da9ea8c3aaf",
      package_id: "1318014c-e046-4735-bf66-fb0c4679456f",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "25c7733c-7148-42a3-80fe-6d642be9e135",
      people_count: 101,
      is_optional: false,
      quantity: 11,
      price_at_time: 38,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "2b0b0dfe-4492-468e-8b8d-295bb1816116",
      package_id: "1318014c-e046-4735-bf66-fb0c4679456f",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "cd3673c9-4409-4d04-b1f1-071a12a95c80",
      people_count: 101,
      is_optional: false,
      quantity: 9,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "e63f7928-a63e-4375-8490-75d317a06be3",
      package_id: "1318014c-e046-4735-bf66-fb0c4679456f",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "41f719c2-cb90-40a4-88ff-fe345457bbce",
      people_count: 101,
      is_optional: false,
      quantity: 9,
      price_at_time: 22,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "7683b048-90b6-46bb-8629-80aa125fc1e1",
      package_id: "1318014c-e046-4735-bf66-fb0c4679456f",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "e4c278e1-a45f-4534-84a5-a71939cdd8a5",
      people_count: 101,
      is_optional: false,
      quantity: 14,
      price_at_time: 40,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "f62fd66c-1ae6-4f0f-87d7-d23e8de59927",
      package_id: "1318014c-e046-4735-bf66-fb0c4679456f",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "4b816edb-b9dd-4f20-a318-b05d0d62fec5",
      people_count: 101,
      is_optional: false,
      quantity: 19,
      price_at_time: 28,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "1cd6f044-6ea0-4f14-9e9d-cd547e167a74",
      package_id: "1318014c-e046-4735-bf66-fb0c4679456f",
      caterer_id: "3b6827c0-6cb4-4511-9d7b-881174dcfa7c",
      dish_id: "11f3596c-43b0-44d4-a65e-4c5eb00cf264",
      people_count: 101,
      is_optional: false,
      quantity: 6,
      price_at_time: 35,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "31cf7d0e-115f-4f89-8053-429da91c80f5",
      package_id: "66b8b04c-d167-4ede-9970-165a196fb728",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "7e64f067-205a-432c-b436-6df43f81bb32",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "54233e8b-7260-420c-b04e-9388e17a5a73",
      package_id: "66b8b04c-d167-4ede-9970-165a196fb728",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "3b0d9d8b-5527-4b9a-a909-eca53ab78a2a",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "bd21df63-050d-44f0-96c4-59ccdc412a25",
      package_id: "66b8b04c-d167-4ede-9970-165a196fb728",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "4ee12b38-fe09-4569-a731-85d90a5a2927",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "d03e8643-78d3-4c27-b9ff-0acf62bdc83f",
      package_id: "52597ea1-40f9-47d5-bd87-b3076a70c899",
      caterer_id: "14aedafb-065b-46d3-b21b-1fd2bdff364f",
      dish_id: "e88688c1-dffa-4abb-a34c-7718bbeac99c",
      people_count: 30,
      is_optional: false,
      quantity: 1,
      price_at_time: 499,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "7cbd5fe8-b3b2-4afb-8327-5779a00bc6ea",
      package_id: "aa70060e-701e-4b63-9b62-99163d70be6a",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "4ee12b38-fe09-4569-a731-85d90a5a2927",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "f4d5054b-a5a0-452e-b3a3-098f5ea4aff1",
      package_id: "aa70060e-701e-4b63-9b62-99163d70be6a",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "3b0d9d8b-5527-4b9a-a909-eca53ab78a2a",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "909c57b1-262f-47a4-b244-476bc3fd44ea",
      package_id: "aa70060e-701e-4b63-9b62-99163d70be6a",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "16947236-9a0e-46d6-8c41-6391cc053af7",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "568db418-a1db-4de9-b720-6006d0df1dd8",
      package_id: "aa70060e-701e-4b63-9b62-99163d70be6a",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "7e64f067-205a-432c-b436-6df43f81bb32",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "ce2a33ce-7fd3-4415-a5aa-087d0393eb0f",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "998e2d1a-b357-4d9b-bc95-155005574679",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "d7a96d15-366c-4f41-97c4-20ea8847ac2e",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "c9102308-4f07-447f-89a6-ef71fac2c942",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "0746f49f-6ceb-4ac9-b965-65d55dd30e93",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "0429c660-0496-451f-a7be-0f94113749b7",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "09e3bab3-5288-4404-aede-5e38e4c70940",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "4b97aa1c-85c8-4d0b-ad59-5bdbce8a88bd",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "28c4e30c-6c57-40d7-822f-4dda4ee34a15",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "84aa14df-f456-446a-894e-037dc43e43fb",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "195f3f01-3996-4419-abfa-7320d29bb68d",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "cb352166-4a99-43e4-95f8-5d441a8bbe44",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "6c5366c1-6af8-487d-ab5e-ea9cbacabcbd",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "f4746143-46ab-4028-af13-8487a7af5f39",
      people_count: 25,
      is_optional: true,
      quantity: 4,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "3b0053ed-f98a-4b32-abfd-a5e7f780af5e",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "a199e303-2ee9-4c8b-bdd6-2a30a516e145",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "7a916456-2674-4bf4-8807-e57ae1d725cf",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "027e594b-c7e2-4be2-8b6b-effd453eb908",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "5958c494-a9ca-4cf4-b542-57d95eebc2f1",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "2e32f798-9271-4d72-9c60-cad90a0420df",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "69e2d16e-e0f3-4796-8d58-d229c9538bd0",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "a7eb85bf-d275-434e-8c63-10b2fd67e428",
      people_count: 25,
      is_optional: false,
      quantity: 4,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "07a02040-dbe9-416d-9a8a-47e38b4a1a0d",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "788a708f-43aa-4b9c-9abf-dc6ab7e49fd2",
      people_count: 25,
      is_optional: false,
      quantity: 4,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "7f833e52-2776-48fc-aacc-b088d445494c",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "3831eea2-5a2b-4a48-aa62-4f6bdba57c9b",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "49127087-8c26-461c-b1d8-78b9bb18d5e4",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "a5e0ebf8-d239-438b-97f9-6eb6aaed6e36",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "ce6f9e2d-1b43-464a-9082-1f591b2004c5",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "ea318c86-e51f-491f-96c6-fe19f3d67f67",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "119974c9-09bf-4c0a-a1e1-67f559bce917",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "fddeda0f-d080-41f9-bad5-6171dde0f984",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "9faa44e1-e583-469e-8c72-c5fc109f3624",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "b03010d8-fa9b-4497-b6d5-285951058bb2",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "de6d18f8-7222-43f5-b42d-8e2b08183a02",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "3770b7de-57e0-4a84-bce5-a938524175fb",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "1038d18b-aee6-47d9-a441-fa4974141459",
      package_id: "25f9a97d-7c4e-4cce-b35f-4733ea1cd78f",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "a3aa822c-4459-470d-9e21-372a35a4937b",
      people_count: 5,
      is_optional: false,
      quantity: 20,
      price_at_time: 25,
      is_addon: true,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "84c4da2f-534f-43a9-8aef-0868a87950bd",
      package_id: "25f9a97d-7c4e-4cce-b35f-4733ea1cd78f",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "104598b0-6cdb-402b-834a-66ed9fe89c8d",
      people_count: 5,
      is_optional: true,
      quantity: 20,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "c545a6d9-1638-466f-ae63-6d824268dfa4",
      package_id: "25f9a97d-7c4e-4cce-b35f-4733ea1cd78f",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "d20d53fa-0029-4078-9421-4589130b51a3",
      people_count: 5,
      is_optional: true,
      quantity: 18,
      price_at_time: 20,
      is_addon: true,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "022615e6-9c63-43f7-a0ce-f7e351070329",
      package_id: "25f9a97d-7c4e-4cce-b35f-4733ea1cd78f",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "471c6a92-8f25-40c6-a26b-8eb786585f89",
      people_count: 5,
      is_optional: true,
      quantity: 15,
      price_at_time: 22,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "8bd64e5d-0094-482b-a76c-eff7d74cce12",
      package_id: "25f9a97d-7c4e-4cce-b35f-4733ea1cd78f",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "ce7dda19-8505-4d7d-9d86-d71b70428137",
      people_count: 5,
      is_optional: false,
      quantity: 5,
      price_at_time: 55,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "1cb67012-8d3f-4b96-8dc1-377a7b3b4a89",
      package_id: "25f9a97d-7c4e-4cce-b35f-4733ea1cd78f",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "28d7a62d-04a3-4627-8680-72836414849e",
      people_count: 5,
      is_optional: true,
      quantity: 18,
      price_at_time: 32,
      is_addon: true,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "b426a714-dc89-40f6-82e0-dadc2e787e49",
      package_id: "25f9a97d-7c4e-4cce-b35f-4733ea1cd78f",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "169659ed-85fa-48c3-a6e2-3e6002f3263c",
      people_count: 5,
      is_optional: true,
      quantity: 12,
      price_at_time: 18,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "4f917ca8-e1c8-49ec-9719-2fc949ec7ce8",
      package_id: "25f9a97d-7c4e-4cce-b35f-4733ea1cd78f",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "c6effca6-c53d-4f76-9680-b9e475a4d74a",
      people_count: 5,
      is_optional: true,
      quantity: 23,
      price_at_time: 48,
      is_addon: true,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "e82b80bf-70e2-4aa5-8c4a-f839f2aaf125",
      package_id: "b6040d20-53d7-4226-8f8d-5a3cb86659a2",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "c9102308-4f07-447f-89a6-ef71fac2c942",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "3934698c-445a-4b83-aede-982b517bc554",
      package_id: "b6040d20-53d7-4226-8f8d-5a3cb86659a2",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "84aa14df-f456-446a-894e-037dc43e43fb",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "47be8230-62d9-4488-a1f8-59f1375f2618",
      package_id: "b6040d20-53d7-4226-8f8d-5a3cb86659a2",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "998e2d1a-b357-4d9b-bc95-155005574679",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "75682dba-e828-4dda-a31b-0555dbd6e4b9",
      package_id: "b6040d20-53d7-4226-8f8d-5a3cb86659a2",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "cb352166-4a99-43e4-95f8-5d441a8bbe44",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "531624f7-63ed-4eee-b34d-2416b2412f75",
      package_id: "b6040d20-53d7-4226-8f8d-5a3cb86659a2",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "4b97aa1c-85c8-4d0b-ad59-5bdbce8a88bd",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "7e3215ed-5283-4a1f-8159-cb3668976b6e",
      package_id: "969e1f02-a7d4-4b8c-8dde-6b9df6174052",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "29b165d8-fbad-4a09-a5a3-6ba4d839c668",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "18dba8fa-3245-4f38-96e2-8b83b0399fd1",
      package_id: "969e1f02-a7d4-4b8c-8dde-6b9df6174052",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "4ee12b38-fe09-4569-a731-85d90a5a2927",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "886e3c48-891b-43eb-a45b-d5441cf8f818",
      package_id: "969e1f02-a7d4-4b8c-8dde-6b9df6174052",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "5cf1da69-4ee6-4e73-8f5c-080b6d8f148b",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "bc973633-79f4-481a-b68f-b94c6b9171c1",
      package_id: "969e1f02-a7d4-4b8c-8dde-6b9df6174052",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "7e64f067-205a-432c-b436-6df43f81bb32",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "6ff0c5d0-cf2c-48a2-b39a-3452189136a2",
      package_id: "969e1f02-a7d4-4b8c-8dde-6b9df6174052",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "d1435bfb-04e5-4c83-90f2-ce3e194f542f",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "596b72d8-d940-4d5c-9543-df9204e4486c",
      package_id: "969e1f02-a7d4-4b8c-8dde-6b9df6174052",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "3b0d9d8b-5527-4b9a-a909-eca53ab78a2a",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "f2e217cf-ee6e-490d-b00a-7577f88d4e9e",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "3831eea2-5a2b-4a48-aa62-4f6bdba57c9b",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "43aa0ef7-8caa-4059-b10c-f1d4be04be5c",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "b03010d8-fa9b-4497-b6d5-285951058bb2",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "efd432d3-7f36-4af3-a3f1-d4be9ee39694",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "ea318c86-e51f-491f-96c6-fe19f3d67f67",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "02c14a07-779f-44fb-93bd-28bcc61fe19b",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "027e594b-c7e2-4be2-8b6b-effd453eb908",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "205eea83-95dc-4fcc-b68b-3da87f36cc36",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "a7eb85bf-d275-434e-8c63-10b2fd67e428",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "c2c4a9c8-ef11-4e74-bfea-29184e00ff09",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "a199e303-2ee9-4c8b-bdd6-2a30a516e145",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "8a7fbaef-1b11-45dc-80bf-50386f77c171",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "788a708f-43aa-4b9c-9abf-dc6ab7e49fd2",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "1b207864-dcff-4850-b6c6-0e59e5310592",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "cb352166-4a99-43e4-95f8-5d441a8bbe44",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "e51f26a6-91e8-470b-bd04-d9055e5f7cfb",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "2e32f798-9271-4d72-9c60-cad90a0420df",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "73fef981-3097-4875-919c-88104c089842",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "fddeda0f-d080-41f9-bad5-6171dde0f984",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "7a88ee90-b434-4bd4-9e05-b2a513af35d3",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "a5e0ebf8-d239-438b-97f9-6eb6aaed6e36",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "9126e12b-aeab-4e9d-a3ab-bdcfa93b6302",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "84aa14df-f456-446a-894e-037dc43e43fb",
      people_count: 20,
      is_optional: false,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "07927d4c-39cd-43e7-a6da-a9d6461611ef",
      package_id: "f1ef6493-8e2f-4396-b2cb-bd9137486185",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "d64d51ba-612c-4f23-84dd-24da7842458c",
      people_count: 30,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "71fcc6e6-c0a5-499f-84d8-57e39de92574",
      package_id: "f1ef6493-8e2f-4396-b2cb-bd9137486185",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "3b0d9d8b-5527-4b9a-a909-eca53ab78a2a",
      people_count: 30,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "43494462-818d-446a-a357-d512d501242c",
      package_id: "cfc8ea24-547e-436b-aba3-c0ec5e86cdd6",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "d64d51ba-612c-4f23-84dd-24da7842458c",
      people_count: 40,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "f4d3e72c-c86b-4f64-a4ef-4b0432986060",
      package_id: "cfc8ea24-547e-436b-aba3-c0ec5e86cdd6",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "4ee12b38-fe09-4569-a731-85d90a5a2927",
      people_count: 40,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "479ebd0a-42de-494d-8813-a8d1f132d4c5",
      package_id: "d20567da-3774-4f0a-ae13-36220e91d3f1",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "4ee12b38-fe09-4569-a731-85d90a5a2927",
      people_count: 40,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "dabdb4d1-7a6b-4458-aafb-69dcf6dc04e0",
      package_id: "d20567da-3774-4f0a-ae13-36220e91d3f1",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "d64d51ba-612c-4f23-84dd-24da7842458c",
      people_count: 40,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "2ae28174-1534-49ff-83b6-6cb425e1b30f",
      package_id: "c0681ff8-35df-4487-a2eb-6ca108ab591c",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "4ee12b38-fe09-4569-a731-85d90a5a2927",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "bd6b697d-0cc1-45ec-ae00-6155405a47ba",
      package_id: "c0681ff8-35df-4487-a2eb-6ca108ab591c",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "3b0d9d8b-5527-4b9a-a909-eca53ab78a2a",
      people_count: 25,
      is_optional: false,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "e05e375d-663a-41ba-8415-79748d82e799",
      package_id: "4c46944c-3a1e-4e2f-a7df-8987604dce5b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "4c9429f3-74a5-44e2-bb14-7f3a843b52ce",
      people_count: 70,
      is_optional: true,
      quantity: 20,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "6ce91bb3-89bb-4b81-a8fc-83b2a34d03b2",
      package_id: "4c46944c-3a1e-4e2f-a7df-8987604dce5b",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "96883603-d317-4c60-b3ba-ae66b8da564a",
      people_count: 70,
      is_optional: false,
      quantity: 18,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "d75b730a-bd5f-46be-b07d-560e8bfed078",
      package_id: "f8c27ab1-a1be-4e8e-9380-92bb0e0c2074",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "4c9429f3-74a5-44e2-bb14-7f3a843b52ce",
      people_count: 20,
      is_optional: false,
      quantity: 7,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "205a4fe1-27b0-4282-b7b2-c14988b323b5",
      package_id: "f8c27ab1-a1be-4e8e-9380-92bb0e0c2074",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      dish_id: "96883603-d317-4c60-b3ba-ae66b8da564a",
      people_count: 20,
      is_optional: false,
      quantity: 18,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "62b536f0-b264-4ebf-8e4d-b23d765af6b5",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "156de8a9-24a5-46da-a3d7-639f5c73d06b",
      people_count: 25,
      is_optional: true,
      quantity: 2,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "f61689f2-ee20-4f4e-933c-9aba45b447dd",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "b0828718-c70f-43d1-a20e-8e283be81c5c",
      people_count: 25,
      is_optional: true,
      quantity: 2,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "0d65b0a1-fb89-4592-af62-c11721df5df3",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "85e259ba-52c9-4076-8c15-506a4ff91828",
      people_count: 25,
      is_optional: true,
      quantity: 2,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "d211b59a-d716-4502-a3f7-ccb87b0921fa",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "98376ffd-4090-4a39-bf79-d4e1c952099d",
      people_count: 25,
      is_optional: true,
      quantity: 2,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "30800de9-81c6-4224-b0a8-58f8711166da",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "f4fd2501-4ce3-489e-9400-ee40aa11ed54",
      people_count: 25,
      is_optional: true,
      quantity: 2,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "2072a3db-894c-4a41-9ea0-b48f1b0f29ce",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "3766cc43-f7e2-45b0-b8b9-af225984612f",
      people_count: 25,
      is_optional: true,
      quantity: 2,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "377661ee-d52d-427e-be7a-f68ca580d3c1",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "241c5edb-e3e0-4fc3-b403-d4cfe57a6c09",
      people_count: 25,
      is_optional: true,
      quantity: 2,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "31960ee0-dbc4-4b3d-9a75-02d369a52941",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "61a90179-a259-4cb1-a74a-6ef2f2588afb",
      people_count: 25,
      is_optional: true,
      quantity: 2,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "ca24be47-1514-42b5-96f1-2b49a4194f96",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "d1435bfb-04e5-4c83-90f2-ce3e194f542f",
      people_count: 25,
      is_optional: true,
      quantity: 2,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "3dd42e6d-1156-43b2-850f-3de6b9e680f3",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "29b165d8-fbad-4a09-a5a3-6ba4d839c668",
      people_count: 25,
      is_optional: true,
      quantity: 4,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "76ba454d-3987-412f-9f21-f57ea5266d88",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "f24a7760-60e8-4331-b61f-bd0d9d7551d1",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "a100e3e9-65ff-4b49-a320-d88aaec3937b",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "d293dc57-6de2-48c2-9ab8-9484dd386390",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "61b479b1-7542-4efc-b921-443da39833f6",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "2c55fd0f-6745-4771-bb7d-c7c2a7699f48",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "b463366e-feae-43f8-9ecf-a058b53f1519",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "16947236-9a0e-46d6-8c41-6391cc053af7",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "757307e1-a67f-408d-8eca-3d3efdcbec2e",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "7e64f067-205a-432c-b436-6df43f81bb32",
      people_count: 25,
      is_optional: true,
      quantity: 4,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "30e3e274-9ffb-4197-b381-1e7a2727a681",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "5cf1da69-4ee6-4e73-8f5c-080b6d8f148b",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "d5953bf8-4e39-4baf-bc35-f1d8e21e1700",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "94f09aa6-cc4f-4dc6-9930-0481d7e0b250",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "000c01a7-3144-4c1b-b7b7-ca09741dc9d9",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "d64d51ba-612c-4f23-84dd-24da7842458c",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "05ab19ee-acc9-4f33-959d-87408946c229",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "3b0d9d8b-5527-4b9a-a909-eca53ab78a2a",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "69275a25-da67-493f-9114-fb1b93134ce0",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      caterer_id: "abc56ec2-c140-406e-999b-9ea4500482a0",
      dish_id: "4ee12b38-fe09-4569-a731-85d90a5a2927",
      people_count: 25,
      is_optional: true,
      quantity: 1,
      price_at_time: 10,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "317304fa-d902-465f-bf9a-57e4a33b70c7",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "9f8a3277-2c54-4a4f-8eea-cfc3da907c35",
      people_count: 35,
      is_optional: true,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "c68a2d4b-9ffb-4b24-a67a-395fc33206d5",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "7fbf5b1c-0e35-4278-87c7-cf78625a1719",
      people_count: 35,
      is_optional: true,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "c600c10d-f7c4-4fd3-955b-4f5a0a2716bb",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "2d7407bc-cbbb-4799-a914-10f0ba762151",
      people_count: 35,
      is_optional: true,
      quantity: 1,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "3942b0c0-639d-41d4-9e60-32a5f14d6a59",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "0f9d8620-87ed-4671-9310-d5294845da81",
      people_count: 35,
      is_optional: true,
      quantity: 1,
      price_at_time: 18,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "2f5e21a5-7d06-4bae-a12b-3727163f6e93",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "f7bd156d-e2df-4a35-bc29-d876bdbfa2fc",
      people_count: 35,
      is_optional: true,
      quantity: 1,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "1fd0f64c-fc7d-4410-8d22-5f51b58cc0b6",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "7fb85c13-e959-4bad-aee1-3fccd8d97606",
      people_count: 35,
      is_optional: true,
      quantity: 1,
      price_at_time: 18,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "3075b1a5-481c-4523-a3fb-599ec2f7036e",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "c0dfcf3f-bcb4-421c-a666-c7d149ce8e33",
      people_count: 35,
      is_optional: false,
      quantity: 1,
      price_at_time: 35,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "6fdd57ec-0f11-49ac-842f-bcca650f1a0a",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "7e78f4cd-cd17-44b3-8959-187deda21daf",
      people_count: 35,
      is_optional: false,
      quantity: 1,
      price_at_time: 45,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "e7edf293-e7f2-4c79-8101-2a32ca90b26e",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "036c7578-ac5b-4c4f-bc83-3094e42a3fff",
      people_count: 35,
      is_optional: false,
      quantity: 1,
      price_at_time: 38,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "a110c84d-5cf8-43bc-8f94-3558cc0eb9ec",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "65cff04b-989d-4096-b8c6-358b823b5d3c",
      people_count: 35,
      is_optional: false,
      quantity: 1,
      price_at_time: 25,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "e025ce18-3697-4fd4-9758-c20c29d23f9a",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "2acfd35d-988b-4df0-981f-df12052f5e18",
      people_count: 35,
      is_optional: false,
      quantity: 1,
      price_at_time: 48,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "260c3ba2-1a3d-417b-80a8-aedd099fcec5",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "4154a884-6944-4eb9-8c87-e0771a0a8d5f",
      people_count: 35,
      is_optional: false,
      quantity: 1,
      price_at_time: 55,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "b89cb86e-4516-4adb-9c35-f8c45550429e",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "ae3488ed-400e-49dc-a1df-97a26b1a7f15",
      people_count: 35,
      is_optional: false,
      quantity: 1,
      price_at_time: 22,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "15dca27f-0673-4e31-9040-13fe5240ccb3",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "86d10d7b-0ec2-4099-bcb3-7786fe6a8533",
      people_count: 35,
      is_optional: false,
      quantity: 4,
      price_at_time: 42,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "0086a860-ab40-4f04-be12-839e68e2d5c0",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "15a9dc69-8829-44f0-984f-ffd3adbf9b9e",
      people_count: 35,
      is_optional: false,
      quantity: 1,
      price_at_time: 18,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "139399a0-7fd6-4b50-a4b8-51c0633caca1",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "2736bca5-310b-40f4-b607-13e2c8c51336",
      people_count: 35,
      is_optional: false,
      quantity: 1,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "500bf0f0-0808-4aff-9cbc-5e8c3fbe5e59",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "e4b4b743-7856-48eb-b9c4-d3dac9955198",
      people_count: 35,
      is_optional: false,
      quantity: 1,
      price_at_time: 22,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "af0be798-8b13-47f0-afc9-13a73c9cc62f",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "01bf03c1-43f4-4341-8003-a404342c426c",
      people_count: 35,
      is_optional: false,
      quantity: 1,
      price_at_time: 25,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "bbd35954-5597-42a6-b8a4-c3ead83ac029",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "9c58b1eb-6fe4-46fa-b2e7-917d0133cd66",
      people_count: 35,
      is_optional: false,
      quantity: 1,
      price_at_time: 8,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "0ccfc8af-6f06-4e74-9ddc-a9c4499d33bb",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      caterer_id: "baf3ff6b-3eaa-46b7-8d13-85fe223cb135",
      dish_id: "28c64f45-2803-4f7e-82c0-04f6e3f3c898",
      people_count: 35,
      is_optional: false,
      quantity: 1,
      price_at_time: 5,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "9f9feb0d-4d31-481a-9d5d-7cb1828b6612",
      package_id: "d25cdd35-8c26-4e55-988f-ab2cdb61c673",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "82942e17-52ed-4d95-b181-bdc3dd74118b",
      people_count: 74,
      is_optional: true,
      quantity: 18,
      price_at_time: 28,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "f687f335-63d8-41c9-ab28-a3dd274ea5b2",
      package_id: "d25cdd35-8c26-4e55-988f-ab2cdb61c673",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "78fa184a-00f9-410c-be74-228b3f1a031d",
      people_count: 74,
      is_optional: true,
      quantity: 19,
      price_at_time: 25,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "9bfd4cbf-3681-4471-bc39-64d6f5d382b4",
      package_id: "d25cdd35-8c26-4e55-988f-ab2cdb61c673",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "1a939c6a-7737-4962-bb17-06636e7fcdcc",
      people_count: 74,
      is_optional: true,
      quantity: 19,
      price_at_time: 12,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "61df08cc-f064-4e4b-8ff3-895bec0ab0a6",
      package_id: "d25cdd35-8c26-4e55-988f-ab2cdb61c673",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "9fda83aa-4049-4835-989f-aba08842586e",
      people_count: 74,
      is_optional: true,
      quantity: 16,
      price_at_time: 38,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "c591fadd-51d2-485f-8059-68b3585f7c86",
      package_id: "d25cdd35-8c26-4e55-988f-ab2cdb61c673",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "199fd57b-0bc6-46d7-951e-b57267945ae4",
      people_count: 74,
      is_optional: true,
      quantity: 24,
      price_at_time: 45,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "36bd52ac-b52c-48aa-be28-554406f43eda",
      package_id: "d25cdd35-8c26-4e55-988f-ab2cdb61c673",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "807a4df9-8bd5-40c6-88a3-20d1d0a6d82b",
      people_count: 74,
      is_optional: false,
      quantity: 19,
      price_at_time: 8,
      is_addon: true,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "037a49ab-18ef-4bae-993b-ac50277a85f8",
      package_id: "6d1462f1-e891-49a7-84bf-8c8357d7d4c8",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "82942e17-52ed-4d95-b181-bdc3dd74118b",
      people_count: 175,
      is_optional: false,
      quantity: 18,
      price_at_time: 28,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "dd7b6891-4bb6-4b96-850e-e2e39d27b280",
      package_id: "6d1462f1-e891-49a7-84bf-8c8357d7d4c8",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "78fa184a-00f9-410c-be74-228b3f1a031d",
      people_count: 175,
      is_optional: false,
      quantity: 9,
      price_at_time: 25,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "ac9ba1b2-42c1-4a5b-b3c7-4a7f0031763e",
      package_id: "6d1462f1-e891-49a7-84bf-8c8357d7d4c8",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "48e1cbe1-6bc3-44c0-8168-1c94df389079",
      people_count: 175,
      is_optional: true,
      quantity: 18,
      price_at_time: 42,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "6a40dcf7-a6e9-4214-9cb8-d76310891de2",
      package_id: "6d1462f1-e891-49a7-84bf-8c8357d7d4c8",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "1a939c6a-7737-4962-bb17-06636e7fcdcc",
      people_count: 175,
      is_optional: true,
      quantity: 5,
      price_at_time: 12,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "7dbd9b28-a8fa-4ea0-90de-ac82370ea1f6",
      package_id: "6d1462f1-e891-49a7-84bf-8c8357d7d4c8",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "24e0eac4-0812-4552-86dc-d4e625290593",
      people_count: 175,
      is_optional: false,
      quantity: 22,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "a1ef33b9-61bd-44be-b984-f4fef1b2198d",
      package_id: "6d1462f1-e891-49a7-84bf-8c8357d7d4c8",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "9fda83aa-4049-4835-989f-aba08842586e",
      people_count: 175,
      is_optional: true,
      quantity: 16,
      price_at_time: 38,
      is_addon: true,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "45474bca-7fb3-4066-86a4-930a6a3e843f",
      package_id: "6d1462f1-e891-49a7-84bf-8c8357d7d4c8",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "199fd57b-0bc6-46d7-951e-b57267945ae4",
      people_count: 175,
      is_optional: true,
      quantity: 14,
      price_at_time: 45,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "82e759a2-09d8-4920-8cea-05d6db6086c1",
      package_id: "3047be04-4358-4b47-9729-ae934e7fb932",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "199fd57b-0bc6-46d7-951e-b57267945ae4",
      people_count: 84,
      is_optional: false,
      quantity: 13,
      price_at_time: 45,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "f05494f9-e55e-4d83-b4b1-11d9e92199d7",
      package_id: "3047be04-4358-4b47-9729-ae934e7fb932",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "9fda83aa-4049-4835-989f-aba08842586e",
      people_count: 84,
      is_optional: true,
      quantity: 19,
      price_at_time: 38,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "c470bc20-5beb-48b0-955a-ec5a0ee97b8d",
      package_id: "3047be04-4358-4b47-9729-ae934e7fb932",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "1a939c6a-7737-4962-bb17-06636e7fcdcc",
      people_count: 84,
      is_optional: false,
      quantity: 12,
      price_at_time: 12,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "1a449c8a-8e98-4919-810d-68905f46b965",
      package_id: "3047be04-4358-4b47-9729-ae934e7fb932",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "82942e17-52ed-4d95-b181-bdc3dd74118b",
      people_count: 84,
      is_optional: true,
      quantity: 20,
      price_at_time: 28,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "53375623-7f8e-43ee-88b5-c15e5d0f59ee",
      package_id: "3047be04-4358-4b47-9729-ae934e7fb932",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "48e1cbe1-6bc3-44c0-8168-1c94df389079",
      people_count: 84,
      is_optional: false,
      quantity: 8,
      price_at_time: 42,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "08cfc5c6-a6ca-47bb-b67c-2f34b4761986",
      package_id: "3047be04-4358-4b47-9729-ae934e7fb932",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "78fa184a-00f9-410c-be74-228b3f1a031d",
      people_count: 84,
      is_optional: false,
      quantity: 16,
      price_at_time: 25,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "f7789f52-8421-4b26-ae25-8d9bfc21c275",
      package_id: "3047be04-4358-4b47-9729-ae934e7fb932",
      caterer_id: "d6aa07b1-e86e-4fea-997b-a1cda07fa9e4",
      dish_id: "24e0eac4-0812-4552-86dc-d4e625290593",
      people_count: 84,
      is_optional: false,
      quantity: 9,
      price_at_time: 15,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "924d8ada-33b9-4110-8f11-faf73dde0c14",
      package_id: "3097ca4e-4c6d-43ba-a55e-bc06f91032f6",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "ce7dda19-8505-4d7d-9d86-d71b70428137",
      people_count: 37,
      is_optional: false,
      quantity: 10,
      price_at_time: 55,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "48e695d5-80ba-4792-bc69-4ac20e31b3d7",
      package_id: "3097ca4e-4c6d-43ba-a55e-bc06f91032f6",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "a3aa822c-4459-470d-9e21-372a35a4937b",
      people_count: 37,
      is_optional: false,
      quantity: 7,
      price_at_time: 25,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "d9d4dbc9-259c-4864-a20d-25f47b7ef7de",
      package_id: "3097ca4e-4c6d-43ba-a55e-bc06f91032f6",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "c6effca6-c53d-4f76-9680-b9e475a4d74a",
      people_count: 37,
      is_optional: false,
      quantity: 11,
      price_at_time: 48,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "caf3efd1-cb6e-46a1-99cb-a53f3e8ff369",
      package_id: "3097ca4e-4c6d-43ba-a55e-bc06f91032f6",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "471c6a92-8f25-40c6-a26b-8eb786585f89",
      people_count: 37,
      is_optional: false,
      quantity: 24,
      price_at_time: 22,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "bbd248a0-7a45-409f-b56d-24e01545ae95",
      package_id: "3097ca4e-4c6d-43ba-a55e-bc06f91032f6",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "28d7a62d-04a3-4627-8680-72836414849e",
      people_count: 37,
      is_optional: false,
      quantity: 17,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "75ecc14a-7622-4554-a597-0f58f2386b75",
      package_id: "3097ca4e-4c6d-43ba-a55e-bc06f91032f6",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "169659ed-85fa-48c3-a6e2-3e6002f3263c",
      people_count: 37,
      is_optional: false,
      quantity: 8,
      price_at_time: 18,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "31f9c31c-7b12-495d-ab23-7b570506ec23",
      package_id: "3097ca4e-4c6d-43ba-a55e-bc06f91032f6",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "d20d53fa-0029-4078-9421-4589130b51a3",
      people_count: 37,
      is_optional: false,
      quantity: 13,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "9463941c-a881-4dae-8ad5-e7b2a40d2cb1",
      package_id: "3097ca4e-4c6d-43ba-a55e-bc06f91032f6",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "104598b0-6cdb-402b-834a-66ed9fe89c8d",
      people_count: 37,
      is_optional: false,
      quantity: 12,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "f2b8a3d6-815d-476c-9f71-9f4bf038c67d",
      package_id: "e4d57532-1b04-4b2f-8fc5-8850acd3e0a7",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "ce7dda19-8505-4d7d-9d86-d71b70428137",
      people_count: 77,
      is_optional: false,
      quantity: 18,
      price_at_time: 55,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "7c82f947-41dd-4e91-841f-8bb1ed75ea7d",
      package_id: "e4d57532-1b04-4b2f-8fc5-8850acd3e0a7",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "169659ed-85fa-48c3-a6e2-3e6002f3263c",
      people_count: 77,
      is_optional: false,
      quantity: 24,
      price_at_time: 18,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "99ba0215-0ecd-49dd-94f7-de0b93121423",
      package_id: "e4d57532-1b04-4b2f-8fc5-8850acd3e0a7",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "28d7a62d-04a3-4627-8680-72836414849e",
      people_count: 77,
      is_optional: true,
      quantity: 15,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "655f5236-93d8-4f51-a78e-77116c8ac6b1",
      package_id: "e4d57532-1b04-4b2f-8fc5-8850acd3e0a7",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "c6effca6-c53d-4f76-9680-b9e475a4d74a",
      people_count: 77,
      is_optional: true,
      quantity: 9,
      price_at_time: 48,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "851d9dbf-193c-4e7d-a2b2-9b0b7d14b925",
      package_id: "e4d57532-1b04-4b2f-8fc5-8850acd3e0a7",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "471c6a92-8f25-40c6-a26b-8eb786585f89",
      people_count: 77,
      is_optional: false,
      quantity: 5,
      price_at_time: 22,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "8f490d9d-1094-48c7-b09b-b41caf972731",
      package_id: "e4d57532-1b04-4b2f-8fc5-8850acd3e0a7",
      caterer_id: "01effc0f-30c7-42df-8974-d507baa73da0",
      dish_id: "104598b0-6cdb-402b-834a-66ed9fe89c8d",
      people_count: 77,
      is_optional: false,
      quantity: 7,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "b7029e58-19c4-47b9-b09e-4546793b95d8",
      package_id: "cdc7fee9-2704-4879-8bed-54c200d97efc",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "05dc2a13-405b-4e97-ad2c-b5e5bc704a16",
      people_count: 40,
      is_optional: false,
      quantity: 15,
      price_at_time: 42,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "020589dd-9971-46d7-9b4c-729fe1eac8a3",
      package_id: "cdc7fee9-2704-4879-8bed-54c200d97efc",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "a743dcba-4169-4711-a56f-cd0321571258",
      people_count: 40,
      is_optional: false,
      quantity: 15,
      price_at_time: 65,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "09b2669e-aa30-4c8c-ae6e-3a6b5755b9b1",
      package_id: "cdc7fee9-2704-4879-8bed-54c200d97efc",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "10e63730-757e-49cb-a3e0-35d56104e83d",
      people_count: 40,
      is_optional: false,
      quantity: 22,
      price_at_time: 30,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "0261f07a-843a-4f3c-91bf-6b9b185cbba9",
      package_id: "cdc7fee9-2704-4879-8bed-54c200d97efc",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "d02d9910-d678-4898-bbc1-ada0aa62956b",
      people_count: 40,
      is_optional: false,
      quantity: 21,
      price_at_time: 28,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "d7e69ce5-24c0-477b-84ff-aa8c0a2ccbb6",
      package_id: "cdc7fee9-2704-4879-8bed-54c200d97efc",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "b7386909-b512-47b0-b6ef-8a6d2c0e3bd1",
      people_count: 40,
      is_optional: false,
      quantity: 19,
      price_at_time: 35,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "32268d6f-85d7-4a57-bbcb-ca339dfec3f5",
      package_id: "cdc7fee9-2704-4879-8bed-54c200d97efc",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "f67ee400-ea23-47be-ad10-74eb3d777a34",
      people_count: 40,
      is_optional: false,
      quantity: 12,
      price_at_time: 38,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "7643235f-e827-430f-ac20-bcb043da1fbc",
      package_id: "cdc7fee9-2704-4879-8bed-54c200d97efc",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "c8f86dcc-c0b0-4dc0-9b68-817e19a7dddb",
      people_count: 40,
      is_optional: false,
      quantity: 7,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "995d20e6-3cbe-4880-98dc-2e2d57f0df1c",
      package_id: "947b2da6-ab4c-489d-86e3-c4cea91a41b9",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "c8f86dcc-c0b0-4dc0-9b68-817e19a7dddb",
      people_count: 151,
      is_optional: false,
      quantity: 23,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "73c97c87-dff8-4973-acd7-a3c7ec5a7745",
      package_id: "947b2da6-ab4c-489d-86e3-c4cea91a41b9",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "f67ee400-ea23-47be-ad10-74eb3d777a34",
      people_count: 151,
      is_optional: false,
      quantity: 20,
      price_at_time: 38,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "77470cdf-5528-4f3a-8e19-a3ae0e5bc82a",
      package_id: "947b2da6-ab4c-489d-86e3-c4cea91a41b9",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "10e63730-757e-49cb-a3e0-35d56104e83d",
      people_count: 151,
      is_optional: false,
      quantity: 13,
      price_at_time: 30,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "bd9922e8-5bf6-4e0f-9138-8bbc26895de1",
      package_id: "947b2da6-ab4c-489d-86e3-c4cea91a41b9",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "a743dcba-4169-4711-a56f-cd0321571258",
      people_count: 151,
      is_optional: false,
      quantity: 5,
      price_at_time: 65,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "1c11663f-8967-4ae4-bb18-b4a17d8fddca",
      package_id: "947b2da6-ab4c-489d-86e3-c4cea91a41b9",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "05dc2a13-405b-4e97-ad2c-b5e5bc704a16",
      people_count: 151,
      is_optional: false,
      quantity: 7,
      price_at_time: 42,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "fa1835d5-32b2-4c54-9f69-bd4312f28bfb",
      package_id: "947b2da6-ab4c-489d-86e3-c4cea91a41b9",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "d02d9910-d678-4898-bbc1-ada0aa62956b",
      people_count: 151,
      is_optional: false,
      quantity: 6,
      price_at_time: 28,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "c7637b7e-565b-46b3-bb77-71e9e5cc576a",
      package_id: "947b2da6-ab4c-489d-86e3-c4cea91a41b9",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "b7386909-b512-47b0-b6ef-8a6d2c0e3bd1",
      people_count: 151,
      is_optional: false,
      quantity: 10,
      price_at_time: 35,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "214cd1ba-83d9-420c-9875-14ec2e12a967",
      package_id: "708ee8cd-6a3f-4379-8f06-db4976dd273e",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "d02d9910-d678-4898-bbc1-ada0aa62956b",
      people_count: 67,
      is_optional: false,
      quantity: 19,
      price_at_time: 28,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "4f0f937a-4ecf-4fb5-bc55-cc65efdf3d1b",
      package_id: "708ee8cd-6a3f-4379-8f06-db4976dd273e",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "f67ee400-ea23-47be-ad10-74eb3d777a34",
      people_count: 67,
      is_optional: false,
      quantity: 12,
      price_at_time: 38,
      is_addon: true,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "8974691a-e049-4d2b-85ba-ec5e2e169a75",
      package_id: "708ee8cd-6a3f-4379-8f06-db4976dd273e",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "05dc2a13-405b-4e97-ad2c-b5e5bc704a16",
      people_count: 67,
      is_optional: false,
      quantity: 6,
      price_at_time: 42,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "0d929176-4002-4692-8d4c-e8e66d70c874",
      package_id: "708ee8cd-6a3f-4379-8f06-db4976dd273e",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "b7386909-b512-47b0-b6ef-8a6d2c0e3bd1",
      people_count: 67,
      is_optional: false,
      quantity: 15,
      price_at_time: 35,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "6b8b5715-c275-49f1-b785-8adc3f7ef89d",
      package_id: "708ee8cd-6a3f-4379-8f06-db4976dd273e",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "a743dcba-4169-4711-a56f-cd0321571258",
      people_count: 67,
      is_optional: true,
      quantity: 8,
      price_at_time: 65,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "189d6287-3fd3-45a4-843d-59fb720ba900",
      package_id: "708ee8cd-6a3f-4379-8f06-db4976dd273e",
      caterer_id: "48dc32f8-97d8-47c6-84bb-04e57ad5fc87",
      dish_id: "c8f86dcc-c0b0-4dc0-9b68-817e19a7dddb",
      people_count: 67,
      is_optional: false,
      quantity: 12,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "009cd245-2137-4490-8072-fb00edfde83b",
      package_id: "5441d5ed-b859-484b-bf48-689407cbefb4",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "22dd897b-898d-462c-a7b9-42af469c5db2",
      people_count: 105,
      is_optional: true,
      quantity: 20,
      price_at_time: 26,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "40ac1504-8f58-4bd9-b7e6-3ff253a27460",
      package_id: "5441d5ed-b859-484b-bf48-689407cbefb4",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "59679f8d-527f-4ec1-b049-b6bd3b1f8359",
      people_count: 105,
      is_optional: false,
      quantity: 18,
      price_at_time: 32,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "8574c504-2409-4a6a-b4d8-90433322f2e9",
      package_id: "5441d5ed-b859-484b-bf48-689407cbefb4",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "7b7454df-c83a-4306-960c-b97b5e0cced2",
      people_count: 105,
      is_optional: false,
      quantity: 13,
      price_at_time: 42,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "3199edda-0e6e-47d3-b2cd-5ad31b2a3097",
      package_id: "5441d5ed-b859-484b-bf48-689407cbefb4",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "68a2849f-2cc5-4bc1-bf7b-085a9bff7a6e",
      people_count: 105,
      is_optional: false,
      quantity: 6,
      price_at_time: 20,
      is_addon: false,
    },
  });

  await prisma.packageItem.create({
    data: {
      id: "18b23013-4fc5-4d03-a7aa-0ff287cfad84",
      package_id: "5441d5ed-b859-484b-bf48-689407cbefb4",
      caterer_id: "ec73ae74-f921-4b1a-a198-0a84ca015b48",
      dish_id: "fcba3d0b-e97f-4af2-87f8-0a878f377e4d",
      people_count: 105,
      is_optional: false,
      quantity: 17,
      price_at_time: 18,
      is_addon: false,
    },
  });

  // 13. Create Package Occasions
  console.log("🎊 Linking packages to occasions...");
  await prisma.packageOccassion.create({
    data: {
      id: "f9a35ca3-b394-4ca9-8c3d-0e5f24f68684",
      package_id: "686e8baf-2384-4c02-87ef-64d879a182b0",
      occasion_id: "8aa633fd-57f4-4ed5-b9bb-18ff4f8afb33",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "63a3b9fa-932f-4c06-b5de-02fa9916ae7c",
      package_id: "87602e88-4e6f-4ce2-9449-2ed65324bea5",
      occasion_id: "d45a3a40-95cd-4194-90cd-32642197593d",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "f18586f8-d668-4af3-af35-0f834d55af4f",
      package_id: "e5f1ffd2-61e5-4ad9-b31a-b3eb283d941a",
      occasion_id: "e8619f34-9b02-4b9c-b9cc-cb06d1bb5349",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "5645220e-38c2-43ad-8a7b-b90bb3be531c",
      package_id: "c974db2a-8dc8-4224-b403-a69addd1e9bd",
      occasion_id: "0209c459-43b3-40ec-88a1-b36923efe2b7",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "520578ef-8528-42c3-b5e1-6959925f7835",
      package_id: "c23a4a56-3955-41f1-803a-891db5f6aed3",
      occasion_id: "5bc4fe2a-1737-462b-879c-2c12d4f97b05",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "1f1830eb-8d38-43a2-9b80-0dd4431b765a",
      package_id: "5b3eacb1-31bf-4059-9e7e-c83c2a0cff76",
      occasion_id: "8aa633fd-57f4-4ed5-b9bb-18ff4f8afb33",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "d65e9bd7-6445-4f80-8e09-790a9f63e554",
      package_id: "95639828-3d59-4e6d-bc39-028b4f73405c",
      occasion_id: "d45a3a40-95cd-4194-90cd-32642197593d",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "a8b02d90-3649-4a73-a175-03740f841172",
      package_id: "ec2930cc-f90e-4f1e-9fae-c730830a433c",
      occasion_id: "01e240e9-38bf-45a2-a13c-98f7c31d1a2f",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "d2655614-467e-47a9-970d-4ec8a09cd238",
      package_id: "dabd839d-a9ca-4c3c-a106-938023b5f66f",
      occasion_id: "8aa633fd-57f4-4ed5-b9bb-18ff4f8afb33",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "96a26692-c72a-4e32-aaf9-63fedb3c8910",
      package_id: "91e6936e-4a03-4b17-83bf-a4aad55e5dea",
      occasion_id: "e8619f34-9b02-4b9c-b9cc-cb06d1bb5349",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "ec8dbee4-7b3b-4bba-8f12-bcf49bdeab0c",
      package_id: "a310dafa-284f-4c44-8ead-b88368de7484",
      occasion_id: "0209c459-43b3-40ec-88a1-b36923efe2b7",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "07c5f85f-9425-4b4b-8bd8-a3ee9c95b51c",
      package_id: "2c885d05-36e8-48dd-a899-7c785324b261",
      occasion_id: "5bc4fe2a-1737-462b-879c-2c12d4f97b05",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "a5794c07-430e-4dea-bd7b-a14e7e164f13",
      package_id: "1318014c-e046-4735-bf66-fb0c4679456f",
      occasion_id: "01e240e9-38bf-45a2-a13c-98f7c31d1a2f",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "c5e844cf-17f0-4d4b-a7a3-67b8fa87d39b",
      package_id: "52597ea1-40f9-47d5-bd87-b3076a70c899",
      occasion_id: "01e240e9-38bf-45a2-a13c-98f7c31d1a2f",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "283a54b6-48f0-4a63-a9c3-8ab557ca5970",
      package_id: "52597ea1-40f9-47d5-bd87-b3076a70c899",
      occasion_id: "d45a3a40-95cd-4194-90cd-32642197593d",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "16c9b741-7754-498d-8e22-6b634c5c5db6",
      package_id: "52597ea1-40f9-47d5-bd87-b3076a70c899",
      occasion_id: "5bc4fe2a-1737-462b-879c-2c12d4f97b05",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "c5aab301-5676-4242-889a-ed6fa82cbfd4",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      occasion_id: "5bebfd39-d0a2-42e9-bb24-94f63ffaac43",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "350942a4-d9e4-47b3-9ac7-35bdf5abb4ad",
      package_id: "70742a68-6014-4f43-aa1d-ad8465049f1e",
      occasion_id: "0209c459-43b3-40ec-88a1-b36923efe2b7",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "78785e26-e0f2-4383-a888-84d674fb76be",
      package_id: "25f9a97d-7c4e-4cce-b35f-4733ea1cd78f",
      occasion_id: "e95580cc-eeff-461d-a551-f61e97c1b043",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "66e0e540-e98a-4f67-8913-4824cdd0e3ab",
      package_id: "7b3e48d2-12f6-4fb8-9567-adc779210428",
      occasion_id: "d45a3a40-95cd-4194-90cd-32642197593d",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "d68a3e61-7f92-4240-8e2c-53d193ed18a1",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      occasion_id: "e95580cc-eeff-461d-a551-f61e97c1b043",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "c4bbe7c8-3661-488c-ac23-6625e3dbb0af",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      occasion_id: "5bc4fe2a-1737-462b-879c-2c12d4f97b05",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "5219a520-fcd1-4f3a-bac2-29841ce792d1",
      package_id: "4c46944c-3a1e-4e2f-a7df-8987604dce5b",
      occasion_id: "8aa633fd-57f4-4ed5-b9bb-18ff4f8afb33",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "59812846-45bb-47df-a1df-ce15c5b819c1",
      package_id: "f8c27ab1-a1be-4e8e-9380-92bb0e0c2074",
      occasion_id: "d45a3a40-95cd-4194-90cd-32642197593d",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "a1ccf387-a432-438d-b07d-eae3694f79cd",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      occasion_id: "b74a1e50-342b-4c6c-9932-117fbae25bd5",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "facb4198-ecb3-4a73-9314-ee594435abcf",
      package_id: "6f3fd1cf-6f5e-47db-8a3a-753dcaf7c5dd",
      occasion_id: "1025949c-122b-4b9f-a84d-57f6af59bb09",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "34ec7b2d-1fba-41d6-abe9-22e72546c3a9",
      package_id: "d25cdd35-8c26-4e55-988f-ab2cdb61c673",
      occasion_id: "d45a3a40-95cd-4194-90cd-32642197593d",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "336aa6cd-788e-4fa5-9532-765d0642e623",
      package_id: "6d1462f1-e891-49a7-84bf-8c8357d7d4c8",
      occasion_id: "01e240e9-38bf-45a2-a13c-98f7c31d1a2f",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "26bad623-ba53-4a09-856f-99858dfc2178",
      package_id: "3047be04-4358-4b47-9729-ae934e7fb932",
      occasion_id: "01e240e9-38bf-45a2-a13c-98f7c31d1a2f",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "b5d24881-7681-4ed2-8cf6-9d0530d83c62",
      package_id: "3097ca4e-4c6d-43ba-a55e-bc06f91032f6",
      occasion_id: "d45a3a40-95cd-4194-90cd-32642197593d",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "ea534a7d-352b-4d70-90d4-10565ddb2d6e",
      package_id: "e4d57532-1b04-4b2f-8fc5-8850acd3e0a7",
      occasion_id: "e8619f34-9b02-4b9c-b9cc-cb06d1bb5349",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "e921537b-e6f1-4cc3-9cf5-bcd637f80654",
      package_id: "cdc7fee9-2704-4879-8bed-54c200d97efc",
      occasion_id: "5bc4fe2a-1737-462b-879c-2c12d4f97b05",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "42396679-3d50-43c6-8a14-e4360fa393dd",
      package_id: "947b2da6-ab4c-489d-86e3-c4cea91a41b9",
      occasion_id: "8aa633fd-57f4-4ed5-b9bb-18ff4f8afb33",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "d2a95ed4-3f19-4b09-9257-92ac1b43efe6",
      package_id: "708ee8cd-6a3f-4379-8f06-db4976dd273e",
      occasion_id: "d45a3a40-95cd-4194-90cd-32642197593d",
    },
  });

  await prisma.packageOccassion.create({
    data: {
      id: "3e1dc9b7-283a-4fd7-9a75-2f801c5e1065",
      package_id: "5441d5ed-b859-484b-bf48-689407cbefb4",
      occasion_id: "01e240e9-38bf-45a2-a13c-98f7c31d1a2f",
    },
  });

  // 14. Create Package Category Selections
  console.log("📋 Creating package category selections...");
  await prisma.packageCategorySelection.create({
    data: {
      id: "0d04f4bd-bf4f-4d96-af27-73983471fcc9",
      package_id: "c23a4a56-3955-41f1-803a-891db5f6aed3",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "0c249f58-b82d-4c78-9b85-e5ad3b85a4d5",
      package_id: "c23a4a56-3955-41f1-803a-891db5f6aed3",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "b4b86f73-0dd2-4ded-9c30-f8a881131728",
      package_id: "5b3eacb1-31bf-4059-9e7e-c83c2a0cff76",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "e1dbe23f-b553-4866-8d98-390482844b6e",
      package_id: "5b3eacb1-31bf-4059-9e7e-c83c2a0cff76",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      num_dishes_to_select: 2,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "6b0cb801-3a4e-4679-aa5d-4ae7e5cc1422",
      package_id: "5b3eacb1-31bf-4059-9e7e-c83c2a0cff76",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "a8236f8e-f074-4063-ae47-0aaa6e3aea38",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      category_id: "9d1bf415-798b-4824-8505-183b1a72b9fe",
      num_dishes_to_select: 2,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "092b0e3b-4e67-471b-b7fa-0243169c43dd",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      num_dishes_to_select: 3,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "333cbeec-9995-4796-96d2-9ac57ebdbaef",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "a721cf34-437c-40a8-b5b1-0b8117e91532",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      category_id: "0bdefe4a-58a0-45da-9dd5-2a348a262178",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "7f53749e-b18a-4548-9d4a-e2203fbdd77b",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "296fe280-8d72-48ee-8ea5-c0986003f759",
      package_id: "25f9a97d-7c4e-4cce-b35f-4733ea1cd78f",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "ab738a27-bfc9-408b-9fbd-19ac6ce44794",
      package_id: "25f9a97d-7c4e-4cce-b35f-4733ea1cd78f",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "7b818932-43d1-4bc9-bedc-58f8bc1bd5a4",
      package_id: "6d1462f1-e891-49a7-84bf-8c8357d7d4c8",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      num_dishes_to_select: 2,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "18d0c6d6-dc88-404a-bcac-3a24dd39c68d",
      package_id: "6d1462f1-e891-49a7-84bf-8c8357d7d4c8",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      num_dishes_to_select: 2,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "81ee6203-b90b-4552-9efd-b154cef21c13",
      package_id: "6d1462f1-e891-49a7-84bf-8c8357d7d4c8",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "53e3d2f4-3e89-486e-8423-2af207b5ebae",
      package_id: "3097ca4e-4c6d-43ba-a55e-bc06f91032f6",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "fbabdc45-e41b-4056-a554-8f7444f81b2d",
      package_id: "3097ca4e-4c6d-43ba-a55e-bc06f91032f6",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "0747a71d-05c9-409f-8d55-470376026015",
      package_id: "e4d57532-1b04-4b2f-8fc5-8850acd3e0a7",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      num_dishes_to_select: 2,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "0b3c518f-5a57-408e-ac6d-cc9520c40abf",
      package_id: "e4d57532-1b04-4b2f-8fc5-8850acd3e0a7",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "6947428b-68e5-476f-871a-913f8ecd4b54",
      package_id: "e4d57532-1b04-4b2f-8fc5-8850acd3e0a7",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "5298589b-b0e5-42ae-afce-ded82ae8e796",
      package_id: "cdc7fee9-2704-4879-8bed-54c200d97efc",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      num_dishes_to_select: 2,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "22d9a398-27e2-4b3e-ae00-64105f32608c",
      package_id: "cdc7fee9-2704-4879-8bed-54c200d97efc",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      num_dishes_to_select: 2,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "dde009bf-ed2e-4e18-897e-b8e1048acf71",
      package_id: "cdc7fee9-2704-4879-8bed-54c200d97efc",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "9ccfabbe-c5c3-4066-b6c6-11ed6deb493b",
      package_id: "5441d5ed-b859-484b-bf48-689407cbefb4",
      category_id: "5f25289a-2a0e-442e-b9e3-b7f6c1dc129a",
      num_dishes_to_select: 2,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "55b3e0ea-8def-4202-bbe1-b0733189dc3f",
      package_id: "5441d5ed-b859-484b-bf48-689407cbefb4",
      category_id: "0c4a253c-823f-4645-bf58-00e4fc1fecf3",
      num_dishes_to_select: 1,
    },
  });

  await prisma.packageCategorySelection.create({
    data: {
      id: "b26b590c-4011-4352-9a11-776633c0b81c",
      package_id: "5441d5ed-b859-484b-bf48-689407cbefb4",
      category_id: "0e892600-d9e5-4e7d-8fa0-ee94e53a5043",
      num_dishes_to_select: 1,
    },
  });

  // 15. Create Carts
  console.log("🛒 Creating carts...");
  await prisma.cart.create({
    data: {
      id: "86cdff50-9a94-48cf-a289-be562a43294f",
      user_id: "ec834308-57dc-45df-b7e1-3c49f0822e58",
    },
  });

  await prisma.cart.create({
    data: {
      id: "343a284f-81d2-4188-97c1-72735ca760d4",
      user_id: "874c8acd-1ef6-4379-b087-9e0b0dbc5b49",
    },
  });

  // 16. Create Cart Items
  console.log("🛍️ Creating cart items...");
  await prisma.cartItem.create({
    data: {
      id: "e513eee7-8b8f-4f42-8366-0a687b239c50",
      cart_id: "86cdff50-9a94-48cf-a289-be562a43294f",
      package_id: "cdf52aea-48d0-42db-86b4-b98ba4bc1adf",
      location: "Dubai Healthcare City",
      guests: 25,
      date: new Date("2026-01-27T12:30:00.000Z"),
      price_at_time: 2500,
    },
  });

  // 17. Create Orders
  console.log("📝 Creating orders...");
  await prisma.order.create({
    data: {
      id: "ffb4a017-8b3d-44d8-8833-35d31a1226c6",
      user_id: "ec834308-57dc-45df-b7e1-3c49f0822e58",
      total_price: 2000,
      currency: "AED",
      status: "PENDING",
    },
  });

  await prisma.order.create({
    data: {
      id: "221cf78d-9c59-4331-a734-16f689d34187",
      user_id: "ec834308-57dc-45df-b7e1-3c49f0822e58",
      total_price: 2000,
      currency: "AED",
      status: "PENDING",
    },
  });

  await prisma.order.create({
    data: {
      id: "09655629-2586-427a-81c2-963f076a389a",
      user_id: "874c8acd-1ef6-4379-b087-9e0b0dbc5b49",
      total_price: 600,
      currency: "AED",
      status: "CONFIRMED",
    },
  });

  // 18. Create Order Items
  console.log("📦 Creating order items...");
  await prisma.orderItem.create({
    data: {
      id: "89290b48-f0f6-4ac3-84e1-0c19e6494be3",
      order_id: "ffb4a017-8b3d-44d8-8833-35d31a1226c6",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      location: "Downtown Dubai",
      guests: 20,
      date: new Date("2026-01-28T12:30:00.000Z"),
      price_at_time: 2000,
    },
  });

  await prisma.orderItem.create({
    data: {
      id: "8c90441e-5fbe-499f-9e03-5b297342bc12",
      order_id: "221cf78d-9c59-4331-a734-16f689d34187",
      package_id: "c0b42a29-7376-428f-9054-3eaed52b757b",
      location: "JLT",
      guests: 20,
      date: new Date("2026-01-22T12:30:00.000Z"),
      price_at_time: 2000,
    },
  });

  await prisma.orderItem.create({
    data: {
      id: "313c9ac4-8cca-4185-b55b-898d4fa23da5",
      order_id: "09655629-2586-427a-81c2-963f076a389a",
      package_id: "20262245-0c3c-4b1a-b48d-c3cf70d1e965",
      location: "Dubai Marina",
      guests: 20,
      date: new Date("2026-01-20T18:00:00.000Z"),
      price_at_time: 600,
    },
  });

  // 19. Create Proposals
  console.log("💼 Creating proposals...");
  await prisma.proposal.create({
    data: {
      id: "09667881-20c4-4e4f-abf4-c294757bfd5b",
      user_id: "ec834308-57dc-45df-b7e1-3c49f0822e58",
      caterer_id: "388245dc-6355-415b-9ccc-a48ef7ef13f5",
      status: "PENDING",
      event_type: null,
      location: null,
      dietary_preferences: [],
      budget_per_person: null,
      event_date: null,
      vision: null,
      guest_count: 20,
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Users: 23`);
  console.log(`   - Caterers: 19`);
  console.log(`   - Certifications: 5`);
  console.log(`   - Cuisine Types: 9`);
  console.log(`   - Categories: 7`);
  console.log(`   - SubCategories: 13`);
  console.log(`   - FreeForms: 6`);
  console.log(`   - Dishes: 113`);
  console.log(`   - Occasions: 10`);
  console.log(`   - Packages: 56`);
  console.log(`   - Carts: 2`);
  console.log(`   - Orders: 3`);
  console.log(`   - Proposals: 1`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
