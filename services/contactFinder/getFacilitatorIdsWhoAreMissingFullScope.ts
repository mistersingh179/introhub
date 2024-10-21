import prisma from "@/prismaClient";
import { startOfToday } from "date-fns";

const getFacilitatorIdsWhoAreMissingFullScope = async (): Promise<string[]> => {
  const facilitators = await prisma.user.findMany({
    where: {
      accounts: {
        some: {
          provider: "google",
          NOT: {
            scope: {
              contains: "https://mail.google.com/",
              mode: 'insensitive'
            },
          },
        },
      },
    },
  });
  const facilitatorIds = facilitators.map((i) => i.id);
  console.log("getFacilitatorIdsWhoAreMissingSendScope: ", facilitatorIds);
  return facilitatorIds;
};

export default getFacilitatorIdsWhoAreMissingFullScope;

if (require.main === module) {
  (async () => {
    const ans = await getFacilitatorIdsWhoAreMissingFullScope();
    console.log(ans);
  })();
}
