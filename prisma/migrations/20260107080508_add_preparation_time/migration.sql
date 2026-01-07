/*
  Warnings:

  - You are about to drop the column `allergen_training` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `availability_completed` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `chef_on_site` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `cuisine_type_ids` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `food_hygiene_level_2` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `halal_certified` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `kosher_certified` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `lead_time_required` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `maximum_travel_distance` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `menu_type_build_your_own` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `menu_type_completed` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `menu_type_custom_catering` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `menu_type_set_menus` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `menu_upload_completed` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `no_staff` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `onboarding_completed` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `organic_certified` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `profile_completed` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `servers_available` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the column `unavailable_dates` on the `catererinfo` table. All the data in the column will be lost.
  - You are about to drop the `Menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_caterer_id_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_menu_id_fkey";

-- AlterTable
ALTER TABLE "catererinfo" DROP COLUMN "allergen_training",
DROP COLUMN "availability_completed",
DROP COLUMN "chef_on_site",
DROP COLUMN "cuisine_type_ids",
DROP COLUMN "food_hygiene_level_2",
DROP COLUMN "halal_certified",
DROP COLUMN "kosher_certified",
DROP COLUMN "lead_time_required",
DROP COLUMN "maximum_travel_distance",
DROP COLUMN "menu_type_build_your_own",
DROP COLUMN "menu_type_completed",
DROP COLUMN "menu_type_custom_catering",
DROP COLUMN "menu_type_set_menus",
DROP COLUMN "menu_upload_completed",
DROP COLUMN "no_staff",
DROP COLUMN "onboarding_completed",
DROP COLUMN "organic_certified",
DROP COLUMN "profile_completed",
DROP COLUMN "servers_available",
DROP COLUMN "unavailable_dates",
ADD COLUMN     "preparation_time" INTEGER;

-- DropTable
DROP TABLE "Menu";

-- DropTable
DROP TABLE "MenuItem";
