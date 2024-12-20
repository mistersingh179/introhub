import prisma from "@/prismaClient";
import setupCompetitorsOnUser from "@/services/setupCompetitorsOnUser";

const setupCompetitorsOnAllUsers = async () => {
  console.log("Starting setupCompetitorsOnAllUsers");

  const users = await prisma.user.findMany({
    where: {
      competitorsInitiated: {
        none: {},
      },
    },
  });

  for (const user of users) {
    console.log("setting up on: ", user.email)
    await setupCompetitorsOnUser(user);
  }

  console.log("Finishing setupCompetitorsOnAllUsers");
};

export default setupCompetitorsOnAllUsers;

if (require.main === module) {
  (async () => {
    await setupCompetitorsOnAllUsers();
  })();
}
