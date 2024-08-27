import prisma from "@/prismaClient";
import HighQueue from "@/bull/queues/highQueue";

const processAllUsersForAutoProspecting = async () => {
  const users = await prisma.user.findMany({
    where: {
      agreedToAutoProspecting: true,
    },
  });
  for (const user of users) {
    const jobObj = await HighQueue.add("processUserForAutoProspecting", user, {
      attempts: 3,
    });
    const { name, id } = jobObj;
    console.log("scheduled job for auto prospecting: ", name, id);
  }
  const rodUser = await prisma.user.findFirst({
    where: {
      email: "rod@introhub.net",
    },
  });
  if (rodUser) {
    Array.from({ length: 3 }).map(async (x) => {
      await HighQueue.add("processUserForAutoProspecting", rodUser, {
        attempts: 3,
      });
    });
  }
};

export default processAllUsersForAutoProspecting;

if (require.main === module) {
  (async () => {
    const ans = await processAllUsersForAutoProspecting();
    console.log("ans: ", ans);
  })();
}
