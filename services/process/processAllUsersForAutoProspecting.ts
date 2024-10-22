import prisma from "@/prismaClient";
import HighQueue from "@/bull/queues/highQueue";
import {fullScope} from "@/app/utils/constants";

const processAllUsersForAutoProspecting = async () => {
  const users = await prisma.user.findMany({
    where: {
      agreedToAutoProspecting: true,
      accounts: {
        some: {
          scope: fullScope
        }
      }
    },
  });
  for (const user of users) {
    const jobObj = await HighQueue.add("processUserForAutoProspecting", user, {
      attempts: 3,
    });
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
