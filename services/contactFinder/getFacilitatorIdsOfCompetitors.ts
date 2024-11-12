import prisma from "@/prismaClient";
import { User } from "@prisma/client";

const getFacilitatorIdsOfCompetitors = async (
  user: User,
): Promise<string[]> => {
  const { competitorsInitiated } = await prisma.user.findFirstOrThrow({
    where: { id: user.id },
    include: {
      competitorsInitiated: true,
    },
  });

  const otherUsersIds = competitorsInitiated.map((u) => u.receiverId);
  console.log("getFacilitatorIdsOfCompetitors: ", otherUsersIds);
  return otherUsersIds;
};

export default getFacilitatorIdsOfCompetitors;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    console.log("my user id: ", user.id);
    const ans = await getFacilitatorIdsOfCompetitors(user);
    console.log(ans);
  })();
}
