import mediumQueue from "@/bull/queues/mediumQueue";
import proxyCurlQueue from "@/bull/queues/proxyCurlQueue";

const addDownloadMessagesForAllAccounts = async () => {
  const jobObj = await mediumQueue.add("downloadMessagesForAllAccounts", null, {
    repeat: {
      pattern: "0 4 * * *",
    },
  });
  const { name, id, opts } = jobObj;
  console.log("schedule job: ", name, id, opts);
};

const addBuildContactsForAllUsers = async () => {
  const jobObj = await mediumQueue.add("buildContactsForAllUsers", null, {
    repeat: {
      pattern: "0 5 * * *",
    },
  });
  const { name, id, opts } = jobObj;
  console.log("schedule job: ", name, id, opts);
};

const addEnrichAllContacts = async () => {
  const jobObj = await proxyCurlQueue.add("enrichAllContacts", null, {
    repeat: {
      pattern: "0 6 * * *",
    },
  });
  const { name, id, opts } = jobObj;
  console.log("schedule job: ", name, id, opts);
};

const setupCronJobs = async () => {
  await addDownloadMessagesForAllAccounts();
  await addBuildContactsForAllUsers();
  await addEnrichAllContacts();
};

export default setupCronJobs;
