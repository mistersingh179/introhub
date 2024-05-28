import redisClient from "@/lib/redisClient";
import { Queue, QueueEvents } from "bullmq";
import {
  HighInputDataType,
  HighJobNames,
  HighOutputDataType,
} from "@/bull/dataTypes";

const queueName = "high";
const highQueue: Queue<HighInputDataType, HighOutputDataType, HighJobNames> =
  new Queue(queueName, {
    connection: redisClient,
    defaultJobOptions: {
      removeOnComplete: 50,
      removeOnFail: 50,
    },
  });

highQueue.on("error", (err) => {
  console.log("queue error: ", err);
});

export const highQueueEvents = new QueueEvents(queueName, {
  connection: redisClient,
});

export default highQueue;
