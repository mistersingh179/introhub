import prisma from "@/prismaClient";
import setupCompetitorsOnUser from "@/services/setupCompetitorsOnUser";

const setupCompetitorsOnAllUsers = async () => {
  console.log("in setupCompetitorsOnAllUsers");

  const users = await prisma.user.findMany({});

  for (const user of users) {
    await setupCompetitorsOnUser(user);
  }
};

export default setupCompetitorsOnAllUsers;

if (require.main === module) {
  (async () => {
    await setupCompetitorsOnAllUsers();
  })();
}
