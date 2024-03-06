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
import { Account, User } from "@prisma/client";
import downloadMetaData, {
  DownloadMetaDataInput,
} from "@/services/downloadMetaData";
import setupDownloadMessages from "@/services/setupDownloadMessages";
import accquireLock from "@/services/helpers/accquireLock";
import { addMilliseconds, getTime } from "date-fns";
import { randomInt } from "node:crypto";

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
        const gotALock = await accquireLock(key, 20);
        if (gotALock) {
          return await downloadMessages(input);
        } else {
          console.log("*** unable to get lock. moving job to delay! ***")
          await job.moveToDelayed(Date.now() + randomInt(20, 50), token);
          throw new DelayedError();
        }
      }
      case "downloadMetaData": {
        const input = data as DownloadMetaDataInput;
        const key = `googleapi:account:${input.account.id}`;
        const gotALock = await accquireLock(key, 20);
        if (gotALock) {
          return await downloadMetaData(input);
        } else {
          console.log("*** unable to get lock. moving job to delay!")
          await job.moveToDelayed(Date.now() + randomInt(20, 50), token);
          throw new DelayedError();
        }
      }
      case "setupDownloadMessages": {
        return await setupDownloadMessages();
      }
      default:
        console.error("got unknown job!");
    }
  },
  {
    connection: redisClient,
    concurrency: 5,
    autorun: false,
    metrics: {
      maxDataPoints: MetricsTime.TWO_WEEKS,
    },
  },
);

const keyName = (job: Job) => {

}


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

export default mediumWorker;
