-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER', 'ADMIN', 'CATERER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PAID', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'PROCESSING', 'QUOTED', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "CreatedBy" AS ENUM ('USER', 'CATERER');

-- CreateEnum
CREATE TYPE "CustomisationType" AS ENUM ('FIXED', 'CUSTOMISABLE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "company_name" TEXT,
    "image_url" TEXT,
    "profile_completed" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "type" "UserType" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catererinfo" (
    "id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "business_type" TEXT NOT NULL,
    "business_description" TEXT,
    "service_area" TEXT,
    "minimum_guests" INTEGER,
    "maximum_guests" INTEGER,
    "region" TEXT,
    "cuisine_types" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "unavailable_dates" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "delivery_only" BOOLEAN NOT NULL DEFAULT true,
    "delivery_plus_setup" BOOLEAN NOT NULL DEFAULT true,
    "full_service" BOOLEAN NOT NULL DEFAULT true,
    "staff" INTEGER,
    "servers" INTEGER,
    "preparation_time" INTEGER,
    "food_license" TEXT,
    "Registration" TEXT,
    "caterer_id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "onboarding_step" INTEGER NOT NULL DEFAULT 0,
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "has_draft" BOOLEAN NOT NULL DEFAULT false,
    "commission_rate" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catererinfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuisineType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuisineType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreeForm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreeForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DishFreeForm" (
    "id" TEXT NOT NULL,
    "dish_id" TEXT NOT NULL,
    "freeform_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DishFreeForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dish" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "cuisine_type_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "sub_category_id" TEXT,
    "caterer_id" TEXT,
    "quantity_in_gm" INTEGER,
    "pieces" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AED',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occassion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Occassion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageOccassion" (
    "id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "occasion_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageOccassion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "people_count" INTEGER NOT NULL,
    "cover_image_url" TEXT,
    "total_price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AED',
    "rating" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "caterer_id" TEXT NOT NULL,
    "user_id" TEXT,
    "created_by" "CreatedBy" NOT NULL DEFAULT 'CATERER',
    "customisation_type" "CustomisationType" NOT NULL DEFAULT 'FIXED',
    "additional_info" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageItem" (
    "id" TEXT NOT NULL,
    "package_id" TEXT,
    "caterer_id" TEXT,
    "dish_id" TEXT NOT NULL,
    "people_count" INTEGER NOT NULL,
    "is_optional" BOOLEAN NOT NULL DEFAULT false,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price_at_time" DECIMAL(10,2),
    "is_addon" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageCategorySelection" (
    "id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "num_dishes_to_select" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageCategorySelection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "location" TEXT,
    "guests" INTEGER,
    "date" TIMESTAMP(3),
    "price_at_time" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AED',
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "location" TEXT,
    "guests" INTEGER,
    "date" TIMESTAMP(3),
    "price_at_time" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "caterer_id" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',
    "event_type" TEXT,
    "location" TEXT,
    "dietary_preferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "budget_per_person" DECIMAL(10,2),
    "event_date" TIMESTAMP(3),
    "vision" TEXT,
    "guest_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatererCertification" (
    "id" TEXT NOT NULL,
    "caterer_info_id" TEXT NOT NULL,
    "certification_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CatererCertification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "catererinfo_caterer_id_key" ON "catererinfo"("caterer_id");

-- CreateIndex
CREATE UNIQUE INDEX "CuisineType_name_key" ON "CuisineType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "SubCategory_category_id_idx" ON "SubCategory"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_name_category_id_key" ON "SubCategory"("name", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "FreeForm_name_key" ON "FreeForm"("name");

-- CreateIndex
CREATE INDEX "DishFreeForm_dish_id_idx" ON "DishFreeForm"("dish_id");

-- CreateIndex
CREATE INDEX "DishFreeForm_freeform_id_idx" ON "DishFreeForm"("freeform_id");

-- CreateIndex
CREATE UNIQUE INDEX "DishFreeForm_dish_id_freeform_id_key" ON "DishFreeForm"("dish_id", "freeform_id");

-- CreateIndex
CREATE INDEX "Dish_cuisine_type_id_idx" ON "Dish"("cuisine_type_id");

-- CreateIndex
CREATE INDEX "Dish_category_id_idx" ON "Dish"("category_id");

-- CreateIndex
CREATE INDEX "Dish_sub_category_id_idx" ON "Dish"("sub_category_id");

-- CreateIndex
CREATE INDEX "Dish_caterer_id_idx" ON "Dish"("caterer_id");

-- CreateIndex
CREATE INDEX "Dish_is_active_idx" ON "Dish"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "Occassion_name_key" ON "Occassion"("name");

-- CreateIndex
CREATE INDEX "PackageOccassion_package_id_idx" ON "PackageOccassion"("package_id");

-- CreateIndex
CREATE INDEX "PackageOccassion_occasion_id_idx" ON "PackageOccassion"("occasion_id");

-- CreateIndex
CREATE UNIQUE INDEX "PackageOccassion_package_id_occasion_id_key" ON "PackageOccassion"("package_id", "occasion_id");

-- CreateIndex
CREATE INDEX "Package_caterer_id_idx" ON "Package"("caterer_id");

-- CreateIndex
CREATE INDEX "Package_user_id_idx" ON "Package"("user_id");

-- CreateIndex
CREATE INDEX "Package_is_active_idx" ON "Package"("is_active");

-- CreateIndex
CREATE INDEX "Package_is_available_idx" ON "Package"("is_available");

-- CreateIndex
CREATE INDEX "PackageItem_package_id_idx" ON "PackageItem"("package_id");

-- CreateIndex
CREATE INDEX "PackageItem_dish_id_idx" ON "PackageItem"("dish_id");

-- CreateIndex
CREATE INDEX "PackageItem_is_addon_idx" ON "PackageItem"("is_addon");

-- CreateIndex
CREATE INDEX "PackageCategorySelection_package_id_idx" ON "PackageCategorySelection"("package_id");

-- CreateIndex
CREATE INDEX "PackageCategorySelection_category_id_idx" ON "PackageCategorySelection"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "PackageCategorySelection_package_id_category_id_key" ON "PackageCategorySelection"("package_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_user_id_key" ON "Cart"("user_id");

-- CreateIndex
CREATE INDEX "CartItem_cart_id_idx" ON "CartItem"("cart_id");

-- CreateIndex
CREATE INDEX "CartItem_package_id_idx" ON "CartItem"("package_id");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cart_id_package_id_key" ON "CartItem"("cart_id", "package_id");

-- CreateIndex
CREATE INDEX "Order_user_id_idx" ON "Order"("user_id");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "OrderItem_order_id_idx" ON "OrderItem"("order_id");

-- CreateIndex
CREATE INDEX "OrderItem_package_id_idx" ON "OrderItem"("package_id");

-- CreateIndex
CREATE INDEX "Proposal_user_id_idx" ON "Proposal"("user_id");

-- CreateIndex
CREATE INDEX "Proposal_caterer_id_idx" ON "Proposal"("caterer_id");

-- CreateIndex
CREATE INDEX "Proposal_status_idx" ON "Proposal"("status");

-- CreateIndex
CREATE INDEX "Proposal_created_at_idx" ON "Proposal"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "Certification_name_key" ON "Certification"("name");

-- CreateIndex
CREATE INDEX "CatererCertification_caterer_info_id_idx" ON "CatererCertification"("caterer_info_id");

-- CreateIndex
CREATE INDEX "CatererCertification_certification_id_idx" ON "CatererCertification"("certification_id");

-- CreateIndex
CREATE UNIQUE INDEX "CatererCertification_caterer_info_id_certification_id_key" ON "CatererCertification"("caterer_info_id", "certification_id");

-- AddForeignKey
ALTER TABLE "catererinfo" ADD CONSTRAINT "catererinfo_caterer_id_fkey" FOREIGN KEY ("caterer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DishFreeForm" ADD CONSTRAINT "DishFreeForm_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DishFreeForm" ADD CONSTRAINT "DishFreeForm_freeform_id_fkey" FOREIGN KEY ("freeform_id") REFERENCES "FreeForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_cuisine_type_id_fkey" FOREIGN KEY ("cuisine_type_id") REFERENCES "CuisineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_caterer_id_fkey" FOREIGN KEY ("caterer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageOccassion" ADD CONSTRAINT "PackageOccassion_occasion_id_fkey" FOREIGN KEY ("occasion_id") REFERENCES "Occassion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageOccassion" ADD CONSTRAINT "PackageOccassion_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_caterer_id_fkey" FOREIGN KEY ("caterer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageItem" ADD CONSTRAINT "PackageItem_caterer_id_fkey" FOREIGN KEY ("caterer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageItem" ADD CONSTRAINT "PackageItem_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageItem" ADD CONSTRAINT "PackageItem_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageCategorySelection" ADD CONSTRAINT "PackageCategorySelection_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageCategorySelection" ADD CONSTRAINT "PackageCategorySelection_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_caterer_id_fkey" FOREIGN KEY ("caterer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatererCertification" ADD CONSTRAINT "CatererCertification_caterer_info_id_fkey" FOREIGN KEY ("caterer_info_id") REFERENCES "catererinfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatererCertification" ADD CONSTRAINT "CatererCertification_certification_id_fkey" FOREIGN KEY ("certification_id") REFERENCES "Certification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
