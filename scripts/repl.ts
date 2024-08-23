import prisma from "../prismaClient";
import {
  addDays,
  addHours,
  addMinutes,
  formatDistance,
  formatDistanceStrict,
  startOfDay,
  startOfHour,
  startOfMinute,
} from "date-fns";
import { UTCDate } from "@date-fns/utc";
import apolloQueue from "@/bull/queues/apolloQueue";
import apolloWorker from "@/bull/workers/apolloWorker";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {

  console.log(apolloWorker.isPaused());
  console.log(apolloWorker.isRunning());

  apolloWorker.resume();

  const ttlMs = await apolloQueue.getRateLimitTtl();
  const now = new Date();
  console.log("seconds: ", Math.round(ttlMs / 1000));
  console.log("minutes: ", Math.round(ttlMs / 1000 / 60));

})();

export {};
