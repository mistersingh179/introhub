import { MetricsTime, Worker } from "bullmq";
import redisClient from "@/lib/redisClient";
import {
  ProxyCurlInputDataType,
  ProxyCurlJobNames,
  ProxyCurlOutputDataType,
} from "@/bull/dataTypes";
import enrichContact, {EnrichContactInput} from "@/services/enrichContact";
import downloadMessagesForAllAccounts from "@/services/downloadMessagesForAllAccounts";
import enrichAllContacts from "@/services/enrichAllContacts";

const queueName = "proxyCurl";

const proxyCurlWorker: Worker<
  ProxyCurlInputDataType,
  ProxyCurlOutputDataType,
  ProxyCurlJobNames
> = new Worker(
  queueName,
  async (job, token) => {
    const { name, data, opts } = job;
    console.log("in processing function", name);
    switch (job.name) {
      case "enrichContact": {
        const input = data as EnrichContactInput;
        return await enrichContact(input);
      }
      case "enrichAllContacts": {
        return await enrichAllContacts();
      }
      default:
        console.error("got unknown job!");
    }
  },
  {
    connection: redisClient,
    concurrency: Number(process.env.WORKER_CONCURRENCY_COUNT),
    limiter: {
      max: 300,
      duration: 1000,
    },
    autorun: false,
    metrics: {
      maxDataPoints: MetricsTime.TWO_WEEKS,
    },
  },
);

proxyCurlWorker.on("error", (err) => {
  console.log("medium worker has an error: ", err);
});

proxyCurlWorker.on("completed", (job) => {
  const { name, data, id, opts } = job;
  // console.log("job completed: ", name, data, id, opts);
  console.log("job completed: ", name, id);
});

proxyCurlWorker.on("active", (job) => {
  const { name, data, id, opts } = job;
  console.log("job active: ", name, id);
});

proxyCurlWorker.on("drained", () => {
  console.log("all jobs have been drained");
});

proxyCurlWorker.on("failed", (job) => {
  console.log("proxyCurlWorker failed: ", job?.name, job?.id, job?.data, job?.stacktrace);
});

proxyCurlWorker.on("ready", () => {
  console.log("worker is ready");
});

export default proxyCurlWorker;
