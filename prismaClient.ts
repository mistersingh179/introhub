import { PrismaClient } from "@prisma/client";
import loadEnvVariables from '@/lib/loadEnvVariables';
loadEnvVariables();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [{ emit: "event", level: "query" }],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
