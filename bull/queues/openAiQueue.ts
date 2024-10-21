import redisClient from "@/lib/redisClient";
import {Queue, QueueEvents} from "bullmq";
import {OpenAiInputDataType, OpenAiJobNames, OpenAiOutputDataType} from "@/bull/dataTypes";

const queueName = "openAi";

const openAiQueue: Queue<OpenAiInputDataType, OpenAiOutputDataType, OpenAiJobNames> =
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

openAiQueue.on("error", (err) => {
  console.log("openAiQueue error: ", err);
});

export const openAiQueueEvents = new QueueEvents(queueName, {
  connection: redisClient,
});

export default openAiQueue;