import prisma from "@/prismaClient";
import mediumQueue from "@/bull/queues/mediumQueue";

const buildContactsForAllUsers = async () => {
  const users = await prisma.user.findMany();
  for (const user of users) {
    const jobObj = await mediumQueue.add("buildContacts", user);
    const { name, id } = jobObj;
    console.log("scheduled buildContactsForAllUsers job: ", name, id);
  }
};

export default buildContactsForAllUsers;
