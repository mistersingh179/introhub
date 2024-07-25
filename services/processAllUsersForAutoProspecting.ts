import processRateLimitedRequest from "@/services/processRateLimitedRequest";
import prisma from "@/prismaClient";
import processUserForAutoProspecting from "@/services/processUserForAutoProspecting";
import HighQueue from "@/bull/queues/highQueue";

const processAllUsersForAutoProspecting = async () => {
  const users = await prisma.user.findMany();
  for (const user of users) {
    const jobObj = await HighQueue.add("processUserForAutoProspecting", user);
    const { name, id } = jobObj;
    console.log("scheduled job for auto prospecting: ", name, id);
  }
};

export default processAllUsersForAutoProspecting;

if (require.main === module) {
  (async () => {
    const ans = await processAllUsersForAutoProspecting();
    console.log("ans: ", ans);
  })();
}
