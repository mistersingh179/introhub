import mediumQueue from "@/bull/queues/mediumQueue";

const addSetupDownloadMessages = async () => {
  const jobObj = await mediumQueue.add("setupDownloadMessages", null, {
    repeat: {
      pattern: "0 4 * * *"
    }
  });
  const {name, id} = jobObj;
  console.log("schedule job: ", name, id);
}

const setupCronJobs = async () => {
  await addSetupDownloadMessages();
}

export default setupCronJobs;