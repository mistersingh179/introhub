import { MetricsTime, Worker } from "bullmq";
import redisClient from "@/lib/redisClient";
import {
  HighInputDataType,
  HighJobNames,
  HighOutputDataType,
} from "@/bull/dataTypes";
import onBoardUser, { OnBoardUserInput } from "@/services/onBoardUser";
import sendProspectsCreatedToday from "@/services/sendProspectsCreatedToday";
import processAllFiltersForEmail from "@/services/processAllFiltersForEmail";

const queueName = "high";
const highWorker = new Worker<
  HighInputDataType,
  HighOutputDataType,
  HighJobNames
>(
  queueName,
  async (job, token) => {
    const { id, name, data } = job;
    console.log("in processing function", name);
    switch (job.name) {
      case "onBoardUser": {
        const input = data as OnBoardUserInput;
        return await onBoardUser(input);
      }
      case "sendProspectsCreatedToday": {
        return await sendProspectsCreatedToday();
      }
      case "processAllFiltersForEmail": {
        return await processAllFiltersForEmail();
      }
      default:
        console.error("got unknown job!");
    }
  },
  {
    connection: redisClient,
    concurrency: Number(process.env.WORKER_CONCURRENCY_COUNT),
    limiter: {
      max: 100,
      duration: 1000,
    },
    autorun: false,
    metrics: {
      maxDataPoints: MetricsTime.TWO_WEEKS,
    },
  },
);

highWorker.on("error", (err) => {
  console.log("highWorker: worker has an error: ", err);
});

highWorker.on("completed", (job) => {
  const { name, data, id, opts } = job;
  console.log("highWorker: job completed: ", name, id, data);
});

highWorker.on("active", (job) => {
  const { name, data, id, opts } = job;
  console.log("highWorker: job active: ", name, id, data);
});

highWorker.on("drained", () => {
  console.log("highWorker: all jobs have been drained");
});

highWorker.on("failed", (job) => {
  console.log(
    "highWorker failed: ",
    job?.name,
    job?.id,
    job?.data,
    job?.stacktrace,
  );
});

export default highWorker;
