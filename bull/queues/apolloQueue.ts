import redisClient from "@/lib/redisClient";
import {Queue, QueueEvents} from "bullmq";
import {ApolloInputDataType, ApolloJobNames, ApolloOutputDataType} from "@/bull/dataTypes";

const queueName = "apollo";

const apolloQueue: Queue<ApolloInputDataType, ApolloOutputDataType, ApolloJobNames> =
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

apolloQueue.on("error", (err) => {
  console.log("apolloQueue error: ", err);
});

export const apolloQueueEvents = new QueueEvents(queueName, {
  connection: redisClient,
});

export default apolloQueue;