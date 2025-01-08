import prisma from "../prismaClient";
import Redlock from "redlock";
import redisClient from "@/lib/redisClient";
import sleep from "@/lib/sleep";

const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  // const redlock = new Redlock([redisClient], {
  //   retryCount: 10,          // Retry up to 10 times
  //   retryDelay: 10,        // Wait 1 second between retries
  //   retryJitter: 10,         // Add jitter of up to 10ms
  // });
  //
  // try {
  //   await redlock.using(["foo"], 5000, async (signal: AbortSignal) => {
  //     console.log("Starting task after acquiring lock...");
  //     await sleep(4000); // Simulate task
  //     console.log("Finished task, releasing lock...");
  //   });
  // } catch (err) {
  //   console.error("Failed to acquire lock:", err);
  // } finally {
  //   process.exit(0);
  // }
})();

export {};
