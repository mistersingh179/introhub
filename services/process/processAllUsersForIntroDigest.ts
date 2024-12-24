import prisma from "@/prismaClient";
import { fullScope } from "@/app/utils/constants";
import MediumQueue from "@/bull/queues/mediumQueue";

const processAllUsersForIntroDigest = async () => {
  const users = await prisma.user.findMany({
    where: {
      agreedToAutoProspecting: true,
      accounts: {
        some: {
          scope: { contains: fullScope },
        },
      },
    },
  });
  for (const user of users) {
    const jobObj = await MediumQueue.add("sendIntroDigestEmail", user);
    const { name, id } = jobObj;
    console.log("scheduled job sendIntroDigestEmail: ", user.email, name, id);
  }
};

export default processAllUsersForIntroDigest;

if (require.main === module) {
  (async () => {
    const ans = await processAllUsersForIntroDigest();
    console.log("ans: ", ans);
  })();
}
