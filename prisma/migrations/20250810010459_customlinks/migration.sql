-- CreateTable
CREATE TABLE "public"."custom_links" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'from-gray-500 to-gray-600',
    "gradient" TEXT NOT NULL DEFAULT 'bg-gradient-to-br from-gray-500 to-gray-600',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_links_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."custom_links" ADD CONSTRAINT "custom_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
