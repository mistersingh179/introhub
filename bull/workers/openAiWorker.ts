import { MetricsTime, Worker } from "bullmq";
import redisClient from "@/lib/redisClient";
import {
  OpenAiInputDataType,
  OpenAiJobNames,
  OpenAiOutputDataType,
} from "@/bull/dataTypes";
import addLlmDescriptionOnPersonProfile from "@/services/llm/addLlmDescriptionOnPersonProfile";
import { PersonProfile } from "@prisma/client";
import addLlmDescriptionOnAll from "@/services/addLlmDescriptionOnAll";

const queueName = "openAi";

const openAiWorker: Worker<
  OpenAiInputDataType,
  OpenAiOutputDataType,
  OpenAiJobNames
> = new Worker(
  queueName,
  async (job, token) => {
    const { name, data, opts } = job;
    console.log("in processing function", name);
    switch (job.name) {
      case "addLlmDescriptionOnPersonProfile": {
        const pp = data as PersonProfile;
        return await addLlmDescriptionOnPersonProfile(pp);
      }
      case "addLlmDescriptionOnAll": {
        return await addLlmDescriptionOnAll();
      }
      default:
        console.error("got unknown job!");
    }
  },
  {
    connection: redisClient,
    concurrency: Number(process.env.WORKER_CONCURRENCY_COUNT),
    limiter: {
      max: 50, // Max 100 requests per minute
      duration: 60 * 1000, // (1 minute)
    },
    autorun: false,
    metrics: {
      maxDataPoints: MetricsTime.TWO_WEEKS,
    },
  },
);

openAiWorker.on("error", (err) => {
  console.log("medium worker has an error: ", err);
});

openAiWorker.on("completed", (job) => {
  const { name, data, id, opts } = job;
  // console.log("job completed: ", name, data, id, opts);
  console.log("job completed: ", name, id);
});

openAiWorker.on("active", (job) => {
  const { name, data, id, opts } = job;
  console.log("job active: ", name, id);
});

openAiWorker.on("drained", () => {
  console.log("all jobs have been drained");
});

openAiWorker.on("failed", (job) => {
  console.log(
    "openAiWorker failed: ",
    job?.name,
    job?.id,
    job?.data,
    job?.stacktrace,
  );
});

openAiWorker.on("ready", () => {
  console.log("worker is ready");
});

export default openAiWorker;
