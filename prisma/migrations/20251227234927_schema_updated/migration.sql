/*
  Warnings:

  - Added the required column `people_count` to the `PackageItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dish" ADD COLUMN     "caterer_id" TEXT;

-- AlterTable
ALTER TABLE "PackageItem" ADD COLUMN     "people_count" INTEGER NOT NULL,
ALTER COLUMN "package_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Dish_caterer_id_idx" ON "Dish"("caterer_id");

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_caterer_id_fkey" FOREIGN KEY ("caterer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
