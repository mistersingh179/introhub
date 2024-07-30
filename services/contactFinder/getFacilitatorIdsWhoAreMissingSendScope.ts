import prisma from "@/prismaClient";
import { startOfToday } from "date-fns";

const getFacilitatorIdsWhoAreMissingSendScope = async (): Promise<string[]> => {
  const facilitators = await prisma.user.findMany({
    where: {
      accounts: {
        some: {
          provider: "google",
          NOT: {
            scope: {
              contains: "send",
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

export default getFacilitatorIdsWhoAreMissingSendScope;

if (require.main === module) {
  (async () => {
    const ans = await getFacilitatorIdsWhoAreMissingSendScope();
    console.log(ans);
  })();
}
