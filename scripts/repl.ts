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
import peopleEnrichmentApiCall from "@/services/helpers/apollo/peopleEnrichmentApiCall";
import { CronJob } from "cron";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {
  const job = new CronJob(
    "* * * * * *", // cronTime
    async function () {
        try{
          // const ans = await peopleEnrichmentApiCall("sandeep@introhub.net");
          console.log(new Date());
        }catch(err){}
    }, // onTick
    null, // onComplete
    true, // start
    "America/New_York", // timeZone
  );

  // setInterval(async () => {
  //   try{
  //     const ans = await peopleEnrichmentApiCall("sandeep@introhub.net");
  //   }catch(err){}
  // }, )

  return;

  // const now = new UTCDate();
  // const nextDay = startOfDay(addDays(now, 1));
  // const waitTime = nextDay.getTime() - now.getTime()
  // console.log(waitTime, waitTime/1000/60/60);

  console.log(apolloWorker.isPaused());
  console.log(apolloWorker.isRunning());

  // apolloWorker.resume();

  // await apolloWorker.rateLimit(1)
  const ttlMs = await apolloQueue.getRateLimitTtl();
  const now = new Date();
  console.log("seconds: ", Math.round(ttlMs / 1000));
  console.log("minutes: ", Math.round(ttlMs / 1000 / 60));
})();

export {};
