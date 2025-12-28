-- AlterTable
ALTER TABLE "PackageItem" ADD COLUMN     "caterer_id" TEXT;

-- AddForeignKey
ALTER TABLE "PackageItem" ADD CONSTRAINT "PackageItem_caterer_id_fkey" FOREIGN KEY ("caterer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
