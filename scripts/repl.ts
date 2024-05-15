import prisma from "../prismaClient";
import { Contact, Prisma } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";
import { google } from "googleapis";
import apolloQueue from "@/bull/queues/apolloQueue";
import {randomInt} from "node:crypto";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {
  console.log("Hello world !");
  const randomDelay = randomInt(1000, 5000);
  const jobObj = await apolloQueue.add(
    "enrichContactUsingApollo",
    "foo3@bar.xyz",
    {
      delay: randomDelay
    }
  );
  console.log(jobObj);

  // const ttl = await apolloQueue.getRateLimitTtl();
  // console.log(ttl);

  // console.log(randomInt(1,5));
})();

export {};
