import { DelayedError, Job, MetricsTime, Worker } from "bullmq";
import redisClient from "@/lib/redisClient";
import { addMilliseconds, addSeconds, getTime } from "date-fns";
import accquireLock from "@/services/helpers/accquireLock";
import {ProxyCurlError} from "@/services/helpers/proxycurl/ProxyCurlError";

const queueName = "high";
const highWorker = new Worker(
  queueName,
  async (job, token) => {
    console.log("in high worker");
    throw new ProxyCurlError("oops is the message", {foo: "bar"});
  },
  {
    connection: redisClient,
    concurrency: 1,
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
  console.log("highWorker failed: ", job?.name, job?.id, job?.data, job?.stacktrace);
});

export default highWorker;
