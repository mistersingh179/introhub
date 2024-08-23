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

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {
  // const delayMs = 200
  // throw Worker.RateLimitError(delayMs);
  // console.log("checking if apollo queue is being rate limited!");
  // await apolloWorker.rateLimit(1);

  // const ttlMs = await apolloQueue.getRateLimitTtl();
  // const now = new Date();
  // console.log("seconds: ", Math.round(ttlMs / 1000));
  // console.log("minutes: ", Math.round(ttlMs / 1000 / 60));
  // console.log(formatDistance(now, addMilliseconds(now, ttlMs)));

  const now = new UTCDate();
  const future = addHours(addMinutes(addDays(now, 2), 500), 7);
  console.log(formatDistance(now, future));
  console.log(formatDistanceStrict(now, future));

  function calculateTimeToNextWindow(
    windowType: "minute" | "hour" | "day",
  ): number {
    switch (windowType) {
      case "minute":
        const nextMinute = startOfMinute(addMinutes(now, 1));
        return nextMinute.getTime() - now.getTime();
      case "hour":
        const nextHour = startOfHour(addHours(now, 1));
        return nextHour.getTime() - now.getTime();
      case "day":
        const nextDay = startOfDay(addDays(now, 1));
        console.log("nextDay: ", nextDay);
        return nextDay.getTime() - now.getTime();
    }
  }

  // console.log("now: ", now);
  // const ans = calculateTimeToNextWindow("day");
  // console.log(ans/1000/60/60);
})();

export {};
