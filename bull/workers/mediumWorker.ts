import { DelayedError, Job, MetricsTime, Worker } from "bullmq";
import redisClient from "@/lib/redisClient";
import {
  MediumInputDataType,
  MediumJobNames,
  MediumOutputDataType,
} from "@/bull/dataTypes";
import downloadMessages, {
  DownloadMessagesInput,
} from "@/services/downloadMessages";
import downloadMetaData, {
  DownloadMetaDataInput,
} from "@/services/downloadMetaData";
import downloadMessagesForAllAccounts from "@/services/downloadMessagesForAllAccounts";
import { randomInt } from "node:crypto";
import processRateLimitedRequest from "@/services/processRateLimitedRequest";
import { User } from "@prisma/client";
import buildContacts from "@/services/buildContacts";
import buildContactsForAllUsers from "@/services/buildContactsForAllUsers";

const queueName = "medium";

const mediumWorker: Worker<
  MediumInputDataType,
  MediumOutputDataType,
  MediumJobNames
> = new Worker(
  queueName,
  async (job, token) => {
    const { name, data, opts } = job;
    console.log("in processing function", name);
    switch (job.name) {
      case "downloadMessages": {
        const input = data as DownloadMessagesInput;
        const key = `googleapi:account:${input.account.id}`;
        const goodToGo = await processRateLimitedRequest(key);
        if (goodToGo) {
          return await downloadMessages(input);
        } else {
          await job.moveToDelayed(Date.now() + randomInt(1000, 2000), token);
          throw new DelayedError();
        }
      }
      case "downloadMetaData": {
        const input = data as DownloadMetaDataInput;
        const key = `googleapi:account:${input.account.id}`;
        const goodToGo = await processRateLimitedRequest(key);
        if (goodToGo) {
          return await downloadMetaData(input);
        } else {
          await job.moveToDelayed(Date.now() + randomInt(1000, 2000), token);
          throw new DelayedError();
        }
      }
      case "downloadMessagesForAllAccounts": {
        return await downloadMessagesForAllAccounts();
      }
      case "buildContacts": {
        const input = data as User;
        return await buildContacts(input);
      }
      case "buildContactsForAllUsers": {
        return await buildContactsForAllUsers();
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

mediumWorker.on("error", (err) => {
  console.log("medium worker has an error: ", err);
});

mediumWorker.on("completed", (job) => {
  const { name, data, id, opts } = job;
  // console.log("job completed: ", name, data, id, opts);
  console.log("job completed: ", name, id);
});

mediumWorker.on("active", (job) => {
  const { name, data, id, opts } = job;
  console.log("job active: ", name, id);
});

mediumWorker.on("drained", () => {
  console.log("all jobs have been drained");
});

mediumWorker.on("failed", (job) => {
  console.log("job failed: ", job);
});

mediumWorker.on("ready", () => {
  console.log("worker is ready");
});

export default mediumWorker;
