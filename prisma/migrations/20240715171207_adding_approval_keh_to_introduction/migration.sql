-- AlterTable
ALTER TABLE "Introduction" ADD COLUMN     "approvalKey" TEXT NOT NULL DEFAULT gen_random_uuid();
