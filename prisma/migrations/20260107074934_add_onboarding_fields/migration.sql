-- CreateEnum
CREATE TYPE "CreatedBy" AS ENUM ('USER', 'CATERER');

-- CreateEnum
CREATE TYPE "CustomisationType" AS ENUM ('FIXED', 'CUSTOMISABLE');

-- AlterTable
ALTER TABLE "Occassion" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "created_by" "CreatedBy" NOT NULL DEFAULT 'CATERER',
ADD COLUMN     "customisation_type" "CustomisationType" NOT NULL DEFAULT 'FIXED',
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "catererinfo" ADD COLUMN     "allergen_training" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "availability_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "chef_on_site" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cuisine_type_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "food_hygiene_level_2" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "halal_certified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kosher_certified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lead_time_required" TEXT,
ADD COLUMN     "maximum_travel_distance" TEXT,
ADD COLUMN     "menu_type_build_your_own" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "menu_type_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "menu_type_custom_catering" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "menu_type_set_menus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "menu_upload_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "no_staff" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "organic_certified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profile_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "servers_available" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "unavailable_dates" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price_per_person" DECIMAL(10,2) NOT NULL,
    "min_guests" INTEGER NOT NULL,
    "max_guests" INTEGER NOT NULL,
    "caterer_id" TEXT NOT NULL,
    "vegetarian_options" BOOLEAN NOT NULL DEFAULT false,
    "vegan_options" BOOLEAN NOT NULL DEFAULT false,
    "gluten_free" BOOLEAN NOT NULL DEFAULT false,
    "halal" BOOLEAN NOT NULL DEFAULT false,
    "kosher" BOOLEAN NOT NULL DEFAULT false,
    "nut_free" BOOLEAN NOT NULL DEFAULT false,
    "event_suitability" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "image_urls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "menu_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "category" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Menu_caterer_id_idx" ON "Menu"("caterer_id");

-- CreateIndex
CREATE INDEX "MenuItem_menu_id_idx" ON "MenuItem"("menu_id");

-- CreateIndex
CREATE INDEX "Package_user_id_idx" ON "Package"("user_id");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_caterer_id_fkey" FOREIGN KEY ("caterer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
