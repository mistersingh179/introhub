import prisma from "../prismaClient";
import redisClient from "@/lib/redisClient";
import { Message, Prisma } from "@prisma/client";
import {
  parseAddressList,
  ParsedMailbox,
  parseOneAddress,
} from "email-addresses";
import mediumWorker from "@/bull/workers/mediumWorker";
import mediumQueue from "@/bull/queues/mediumQueue";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

const MY_GOOGLE_API_KEY = "AIzaSyCCiO10EMimJzYb5qSbrxtbiCxAwo-131U";

(async () => {
  const user = await prisma.user.findFirstOrThrow();
  const jobObj = await mediumQueue.add("buildContacts", user);
  console.log(jobObj);
})();

export {};
