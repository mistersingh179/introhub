import prisma from "../prismaClient";
import downloadMessages from "@/services/downloadMessages";
import mediumQueue, { mediumQueueEvents } from "@/bull/queues/mediumQueue";
import { Prisma } from "@prisma/client";
import { formatISO, fromUnixTime, subHours } from "date-fns";
import MediumQueue from "@/bull/queues/mediumQueue";
import { ParsedMailbox, parseOneAddress } from "email-addresses";
import highQueue from "@/bull/queues/highQueue";
import { randomInt } from "node:crypto";
import getGmailObject from "@/services/helpers/getGmailObject";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  // console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

const MY_GOOGLE_API_KEY = "AIzaSyCCiO10EMimJzYb5qSbrxtbiCxAwo-131U";

(async () => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: ""
    },
    include: {
      accounts: true,
      messages: {
        take: 1,
      },
    },
  });
  console.log('user: ', user);
})();

export {};
