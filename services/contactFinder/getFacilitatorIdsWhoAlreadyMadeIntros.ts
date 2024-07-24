import prisma from "@/prismaClient";
import { startOfToday } from "date-fns";

const getFacilitatorIdsWhoAlreadyMadeIntros = async (): Promise<string[]> => {
  const intros = await prisma.introduction.groupBy({
    where: {
      createdAt: {
        gte: startOfToday(),
      },
    },
    by: ["facilitatorId"],
    _count: {
      facilitatorId: true,
    },
    having: {
      facilitatorId: {
        _count: {
          gte: 2,
        },
      },
    },
  });
  const facilitatorIds = intros.map((i) => i.facilitatorId);
  console.log("getFacilitatorIdsUsedRecently: ", facilitatorIds);
  return facilitatorIds;
};

export default getFacilitatorIdsWhoAlreadyMadeIntros;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await getFacilitatorIdsWhoAlreadyMadeIntros();
    console.log(ans);
  })();
}
