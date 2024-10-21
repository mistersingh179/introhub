import { MetricsTime, Worker } from "bullmq";
import redisClient from "@/lib/redisClient";
import {
  ApolloInputDataType,
  ApolloJobNames,
  ApolloOutputDataType,
} from "@/bull/dataTypes";
import enrichContactUsingApollo from "@/services/enrichContactUsingApollo";
import {
  addDays,
  addHours,
  addMinutes,
  startOfDay,
  startOfHour,
  startOfMinute,
} from "date-fns";
import { randomInt } from "node:crypto";
import enrichAllRemainingContactsUsingApollo from "@/services/enrichAllRemainingContactsUsingApollo";
import enrichAllRemainingUsersUsingApollo from "@/services/enrichAllRemainingUsersUsingApollo";
import peopleEnrichmentApiResponse from "@/services/peopleEnrichmentApiResponse";
import { UTCDate } from "@date-fns/utc";
import { ApolloTooManyRequestsError } from "@/services/helpers/apollo/ApolloTooManyRequestsError";

const queueName = "apollo";

function calculateTimeToNextWindow(
  windowType: "minute" | "hour" | "day",
): number {
  const now = new UTCDate();

  switch (windowType) {
    case "minute":
      const nextMinute = startOfMinute(addMinutes(now, 1));
      return nextMinute.getTime() - now.getTime();
    case "hour":
      const nextHour = startOfHour(addHours(now, 1));
      return nextHour.getTime() - now.getTime();
    case "day":
      const nextDay = startOfDay(addDays(now, 1));
      return nextDay.getTime() - now.getTime();
  }
}

const handleRateLimiting = async (
  apolloWorker: Worker<
    ApolloInputDataType,
    ApolloOutputDataType,
    ApolloJobNames
  >,
  rateLimitInfo?: ApolloRateLimitInfo,
) => {
  if (!rateLimitInfo) return;

  const randomStop = randomInt(1, 10);
  console.log("rateLimitInfo: ", rateLimitInfo, randomStop);

  if (rateLimitInfo["x-minute-requests-left"] <= randomStop) {
    const additionalDelay = randomInt(5, 15) * 1_000; // 5 to 15 seconds
    const waitTime = calculateTimeToNextWindow("minute") + additionalDelay;
    console.log("manually rate limiting for minute: ", waitTime);
    await apolloWorker.rateLimit(waitTime);
    throw Worker.RateLimitError();
  } else if (rateLimitInfo["x-hourly-requests-left"] <= randomStop) {
    const additionalDelay = randomInt(2, 5) * 60 * 1_000; // 5 to 5 minutes
    const waitTime = calculateTimeToNextWindow("hour") + additionalDelay;
    console.log("manually rate limiting for hour: ", waitTime);
    await apolloWorker.rateLimit(waitTime);
    throw Worker.RateLimitError();
  } else if (rateLimitInfo["x-24-hour-requests-left"] <= randomStop) {
    const additionalDelay = randomInt(20, 40) * 60 * 1_000; // 20 to 40 minutes
    // const waitTime = calculateTimeToNextWindow("day") + additionalDelay;
    const waitTime = 1 * 60 * 60 * 1_000 + additionalDelay; // 1 hour + additional
    console.log("manually rate limiting for 24 hour: ", waitTime);
    await apolloWorker.rateLimit(waitTime);
    throw Worker.RateLimitError();
  }
};

const apolloWorker: Worker<
  ApolloInputDataType,
  ApolloOutputDataType,
  ApolloJobNames
> = new Worker(
  queueName,
  async (job, token) => {
    const { name, data, opts } = job;
    console.log("in processing function", name);
    switch (job.name) {
      case "peopleEnrichmentApiResponse": {
        const contactEmail = data as string;
        try {
          const result = await peopleEnrichmentApiResponse(contactEmail);
          const { response, rateLimitInfo } = result;
          await handleRateLimiting(apolloWorker, rateLimitInfo);
          return response;
        } catch (err) {
          if (err instanceof ApolloTooManyRequestsError) {
            console.log("caught apollo error: ", err.rateLimitInfo);
            await handleRateLimiting(apolloWorker, err.rateLimitInfo);
          }
        }
        return undefined;
      }
      case "enrichContactUsingApollo": {
        const input = data as string;
        try {
          const result = await enrichContactUsingApollo(input);
          if (result) {
            const { response, rateLimitInfo } = result;
            await handleRateLimiting(apolloWorker, rateLimitInfo);
            return response;
          }
        } catch (err) {
          if (err instanceof ApolloTooManyRequestsError) {
            console.log("caught apollo error: ", err.rateLimitInfo);
            await handleRateLimiting(apolloWorker, err.rateLimitInfo);
          }
        }
        return undefined;
      }
      case "enrichAllRemainingContactsUsingApollo": {
        return await enrichAllRemainingContactsUsingApollo();
      }
      case "enrichAllRemainingUsersUsingApollo": {
        return await enrichAllRemainingUsersUsingApollo();
      }
      default:
        console.error("got unknown job!");
    }
  },
  {
    connection: redisClient,
    concurrency: Number(process.env.WORKER_CONCURRENCY_COUNT),
    limiter: {
      max: 195, // Max 195 requests per minute
      // max: 2000, // Max 195 requests per minute
      duration: 60 * 1000, // 60,000 ms (1 minute)
    },
    autorun: false,
    metrics: {
      maxDataPoints: MetricsTime.TWO_WEEKS,
    },
  },
);

apolloWorker.on("error", (err) => {
  console.log("medium worker has an error: ", err);
});

apolloWorker.on("completed", (job) => {
  const { name, data, id, opts } = job;
  // console.log("job completed: ", name, data, id, opts);
  console.log("job completed: ", name, id);
});

apolloWorker.on("active", (job) => {
  const { name, data, id, opts } = job;
  console.log("job active: ", name, id);
});

apolloWorker.on("drained", () => {
  console.log("all jobs have been drained");
});

apolloWorker.on("failed", (job) => {
  console.log(
    "apolloWorker failed: ",
    job?.name,
    job?.id,
    job?.data,
    job?.stacktrace,
  );
});

apolloWorker.on("ready", () => {
  console.log("worker is ready");
});

export default apolloWorker;
