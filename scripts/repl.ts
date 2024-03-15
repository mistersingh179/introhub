import prisma from "../prismaClient";
import loadEnvVariables from '@/lib/loadEnvVariables';
import redisClient from "@/lib/redisClient";
loadEnvVariables();

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  const FOO_BAR = String(process.env.FOO_BAR) ?? "";
  console.log('FOO_BAR: ', FOO_BAR)
  await redisClient.get("foo");
})();

export {};
