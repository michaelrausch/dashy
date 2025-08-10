-- CreateTable
CREATE TABLE "public"."training_day" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "activity" TEXT NOT NULL DEFAULT 'rest',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_day_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "training_day_userId_key" ON "public"."training_day"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "training_day_dayOfWeek_key" ON "public"."training_day"("dayOfWeek");

-- AddForeignKey
ALTER TABLE "public"."training_day" ADD CONSTRAINT "training_day_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
