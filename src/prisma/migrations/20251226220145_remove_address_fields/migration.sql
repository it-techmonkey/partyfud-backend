-- AlterTable
-- Drop columns from User table if they exist
ALTER TABLE "User" DROP COLUMN IF EXISTS "address";
ALTER TABLE "User" DROP COLUMN IF EXISTS "city";
ALTER TABLE "User" DROP COLUMN IF EXISTS "state";
ALTER TABLE "User" DROP COLUMN IF EXISTS "zip";
ALTER TABLE "User" DROP COLUMN IF EXISTS "country";
ALTER TABLE "User" DROP COLUMN IF EXISTS "latitude";
ALTER TABLE "User" DROP COLUMN IF EXISTS "longitude";

