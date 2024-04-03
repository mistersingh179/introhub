import redisClient from "@/lib/redisClient";
import {Queue, QueueEvents} from "bullmq";
import {ProxyCurlInputDataType, ProxyCurlJobNames, ProxyCurlOutputDataType} from "@/bull/dataTypes";

const queueName = "proxyCurl";

const proxyCurlQueue: Queue<ProxyCurlInputDataType, ProxyCurlOutputDataType, ProxyCurlJobNames> =
  new Queue(queueName, {
    connection: redisClient,
    defaultJobOptions: {
      removeOnComplete: 100,
      removeOnFail: 100,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000
      },
    },
  });

proxyCurlQueue.on("error", (err) => {
  console.log("proxyCurlQueue error: ", err);
});

export const mediumQueueEvents = new QueueEvents(queueName, {
  connection: redisClient,
});

export default proxyCurlQueue;