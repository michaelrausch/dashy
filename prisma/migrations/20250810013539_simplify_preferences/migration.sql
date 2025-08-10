/*
  Warnings:

  - You are about to drop the column `enabledPrivateLinks` on the `user_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `enabledPublicLinks` on the `user_preferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."user_preferences" DROP COLUMN "enabledPrivateLinks",
DROP COLUMN "enabledPublicLinks",
ADD COLUMN     "enabledLinks" TEXT[] DEFAULT ARRAY[]::TEXT[];
