import prisma from "@/prismaClient";
import { User } from "@prisma/client";
import areTwoUsersCompetitive from "@/services/llm/areTwoUsersCompetitive";

const setupCompetitorsOnUser = async (user: User) => {
  console.log("in setupCompetitorsOnUser with user: ", user.email);

  const otherUsers = await prisma.user.findMany({
    where: {
      id: {
        not: user.id,
      },
    },
  });

  for (const otherUser of otherUsers) {
    console.log("initiator: ", user.email, " receiver: ", otherUser.email);
    try {
      const { competitive, reason } = await areTwoUsersCompetitive(
        user.email!,
        otherUser.email!,
      );
      if (competitive) {
        await prisma.competition.createMany({
          data: [
            {
              initiatorId: user.id,
              receiverId: otherUser.id,
              reason,
            },
            {
              initiatorId: otherUser.id,
              receiverId: user.id,
              reason,
            },
          ],
          skipDuplicates: true,
        });
      }
    } catch (e) {
      console.log(
        "unable to check & save competition between: ",
        user.email,
        otherUser.email,
      );
    }
  }
};

export default setupCompetitorsOnUser;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: { email: "sandeep@introhub.net" },
    });
    await setupCompetitorsOnUser(user);
  })();
}
