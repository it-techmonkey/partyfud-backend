-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER', 'ADMIN', 'CATERER');

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
    "type" "UserType" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
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
    "sub_category_id" TEXT NOT NULL,
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
CREATE TABLE "PackageType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occassion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
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
    "people_count" INTEGER NOT NULL,
    "package_type_id" TEXT NOT NULL,
    "cover_image_url" TEXT,
    "total_price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AED',
    "rating" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "caterer_id" TEXT NOT NULL,
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
    "num_dishes_to_select" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageCategorySelection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

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
CREATE UNIQUE INDEX "PackageType_name_key" ON "PackageType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Occassion_name_key" ON "Occassion"("name");

-- CreateIndex
CREATE INDEX "PackageOccassion_package_id_idx" ON "PackageOccassion"("package_id");

-- CreateIndex
CREATE INDEX "PackageOccassion_occasion_id_idx" ON "PackageOccassion"("occasion_id");

-- CreateIndex
CREATE UNIQUE INDEX "PackageOccassion_package_id_occasion_id_key" ON "PackageOccassion"("package_id", "occasion_id");

-- CreateIndex
CREATE INDEX "Package_package_type_id_idx" ON "Package"("package_type_id");

-- CreateIndex
CREATE INDEX "Package_caterer_id_idx" ON "Package"("caterer_id");

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
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_caterer_id_fkey" FOREIGN KEY ("caterer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageOccassion" ADD CONSTRAINT "PackageOccassion_occasion_id_fkey" FOREIGN KEY ("occasion_id") REFERENCES "Occassion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageOccassion" ADD CONSTRAINT "PackageOccassion_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_caterer_id_fkey" FOREIGN KEY ("caterer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_package_type_id_fkey" FOREIGN KEY ("package_type_id") REFERENCES "PackageType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
