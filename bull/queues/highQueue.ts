import redisClient from "@/lib/redisClient";
import {Queue, QueueEvents} from "bullmq";

const queueName = "high";

const highQueue: Queue =
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