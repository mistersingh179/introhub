import mediumQueue from "@/bull/queues/mediumQueue";
import proxyCurlQueue from "@/bull/queues/proxyCurlQueue";
import apolloQueue from "@/bull/queues/apolloQueue";
import highQueue from "@/bull/queues/highQueue";

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

// const addEnrichAllRemainingContactsUsingApollo = async () => {
//   const jobObj = await apolloQueue.add(
//     "enrichAllRemainingContactsUsingApollo",
//     null,
//     {
//       repeat: {
//         pattern: "0 10 * * *",
//       },
//     },
//   );
//   const { name, id, opts } = jobObj;
//   console.log("schedule job: ", name, id, opts);
// };

const addEnrichAllRemainingUsersUsingApollo = async () => {
  const jobObj = await apolloQueue.add(
    "enrichAllRemainingUsersUsingApollo",
    null,
    {
      repeat: {
        pattern: "30 10 * * *",
      },
    },
  );
  const { name, id, opts } = jobObj;
  console.log("schedule job: ", name, id, opts);
};

const addSendProspectsCreateToday = async () => {
  const jobObj = await highQueue.add("sendProspectsCreatedToday", undefined, {
    repeat: {
      pattern: "0 11 * * *",
    },
  });
  const { name, id, opts } = jobObj;
  console.log("schedule job: ", name, id, opts);
};

const addProcessAllFiltersForEmail = async () => {
  const jobObj = await highQueue.add("processAllFiltersForEmail", undefined, {
    repeat: {
      pattern: "15 11 * * *",
    },
  });
  const { name, id, opts } = jobObj;
  console.log("schedule job: ", name, id, opts);
};

const addProcessAllUsersForAutoProspecting = async () => {
  const jobObj = await highQueue.add(
    "processAllUsersForAutoProspecting",
    undefined,
    {
      repeat: {
        pattern: "0 9 * * *",
      },
    },
  );
  const { name, id, opts } = jobObj;
  console.log("schedule job: ", name, id, opts);
};

// const addSendEmailForAllApprovedIntros = async () => {
//   const jobObj = await highQueue.add(
//     "sendEmailForAllApprovedIntros",
//     undefined,
//     {
//       repeat: {
//         pattern: "0 11 * * *",
//       },
//     },
//   );
//   const { name, id, opts } = jobObj;
//   console.log("schedule job: ", name, id, opts);
// };

const setupCronJobs = async () => {
  await addDownloadMessagesForAllAccounts();
  await addBuildContactsForAllUsers();
  await addEnrichAllContacts();
  // await addEnrichAllRemainingContactsUsingApollo();
  await addEnrichAllRemainingUsersUsingApollo();
  await addSendProspectsCreateToday();
  await addProcessAllFiltersForEmail();
  // await addSendEmailForAllApprovedIntros();
  await addProcessAllUsersForAutoProspecting();
};

export default setupCronJobs;
