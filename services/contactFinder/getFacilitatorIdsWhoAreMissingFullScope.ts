import prisma from "@/prismaClient";
import { startOfToday } from "date-fns";
import {fullScope} from "@/app/utils/constants";

const getFacilitatorIdsWhoAreMissingFullScope = async (): Promise<string[]> => {
  const facilitators = await prisma.user.findMany({
    where: {
      accounts: {
        some: {
          provider: "google",
          NOT: {
            scope: fullScope
          },
        },
      },
    },
  });
  const facilitatorIds = facilitators.map((i) => i.id);
  console.log("getFacilitatorIdsWhoAreMissingFullScope: ", facilitatorIds);
  return facilitatorIds;
};

export default getFacilitatorIdsWhoAreMissingFullScope;

if (require.main === module) {
  (async () => {
    const ans = await getFacilitatorIdsWhoAreMissingFullScope();
    console.log(ans);
  })();
}
