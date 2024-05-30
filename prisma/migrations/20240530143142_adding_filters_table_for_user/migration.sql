-- CreateTable
CREATE TABLE "Filters" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "searchParams" TEXT NOT NULL,

    CONSTRAINT "Filters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Filters" ADD CONSTRAINT "Filters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
