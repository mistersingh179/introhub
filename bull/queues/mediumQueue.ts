import redisClient from "@/lib/redisClient";
import {Queue, QueueEvents} from "bullmq";
import {MediumInputDataType, MediumJobNames, MediumOutputDataType} from "@/bull/dataTypes";

const queueName = "medium";

const mediumQueue: Queue<MediumInputDataType, MediumOutputDataType, MediumJobNames> =
  new Queue(queueName, {
    connection: redisClient,
    defaultJobOptions: {
      removeOnComplete: 100,
      removeOnFail: 100,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000
      }
    },
  });

mediumQueue.on("error", (err) => {
  console.log("queue error: ", err);
});

export const mediumQueueEvents = new QueueEvents(queueName, {
  connection: redisClient,
});

export default mediumQueue;