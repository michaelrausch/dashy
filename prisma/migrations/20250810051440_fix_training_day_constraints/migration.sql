/*
  Warnings:

  - A unique constraint covering the columns `[userId,dayOfWeek]` on the table `training_day` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."training_day_dayOfWeek_key";

-- DropIndex
DROP INDEX "public"."training_day_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "training_day_userId_dayOfWeek_key" ON "public"."training_day"("userId", "dayOfWeek");
