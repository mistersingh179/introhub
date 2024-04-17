import prisma from "../prismaClient";
import redisClient from "@/lib/redisClient";
import ProxyCurlQueue from "@/bull/queues/proxyCurlQueue";
import { Prisma, User } from "@prisma/client";
import { ContactWithUserInfo } from "@/app/dashboard/prospects/page";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  console.log("hello world from repl!");
})();

export {};
