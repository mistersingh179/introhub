import prisma from "@/prismaClient";
import setupCompetitorsOnUser from "@/services/setupCompetitorsOnUser";

const setupCompetitorsOnAllUsers = async () => {
  console.log("Starting setupCompetitorsOnAllUsers");

  const users = await prisma.user.findMany({});

  for (const user of users) {
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
