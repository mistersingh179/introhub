-- DropForeignKey
ALTER TABLE "Filters" DROP CONSTRAINT "Filters_userId_fkey";

-- AddForeignKey
ALTER TABLE "Filters" ADD CONSTRAINT "Filters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
