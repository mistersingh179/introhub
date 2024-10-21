import mediumWorker from "@/bull/workers/mediumWorker";
import setupCronJobs from "@/bull/setupCronJobs";
import highWorker from "@/bull/workers/highWorker";
import proxyCurlWorker from "@/bull/workers/proxyCurlWorker";
import apolloWorker from "@/bull/workers/apolloWorker";
import openAiWorker from "@/bull/workers/openAiWorker";

(async () => {
  console.log("starting workers");
  mediumWorker.run();
  highWorker.run();
  proxyCurlWorker.run();
  apolloWorker.run();
  openAiWorker.run();

  await setupCronJobs();
})();

const gracefulShutdown = async (signal: string) => {
  console.log("starting graceful shutdown of workers: ", signal);

  await mediumWorker.close();
  await highWorker.close();
  await proxyCurlWorker.close();
  await apolloWorker.close();
  await openAiWorker.close();

  console.log("all worker's closed after waiting for jobs to finish");

  setTimeout(async () => {
    console.log("exiting with force as jobs won't finish");
    await mediumWorker.close(true);
    await highWorker.close(true);
    await proxyCurlWorker.close(true);
    await apolloWorker.close(true);
    await openAiWorker.close(true);
    console.log("all worker closed without waiting for jobs to finish");
  }, 1000);

  setTimeout(() => {
    console.log("just exiting abruptly NOW as workers wont shutdown");
    process.exit(0);
  }, 2000);

  console.log("exiting now");
  process.exit(0);
};

process.on("SIGINT", async () => {
  await gracefulShutdown("SIGINT");
});

process.on("SIGTERM", async () => {
  await gracefulShutdown("SIGTERM");
});

process.on("uncaughtException", function (err) {
  console.log("runAllWorkers process – uncaughtException: ", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("runAllWorkers process – unhandledRejection: ", promise, reason);
});
