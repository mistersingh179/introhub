import { User } from "@prisma/client";
import prisma from "@/prismaClient";
import fetchWantedContact from "@/services/contactFinder/fetchWantedContact";

const getContactIdsTouchedByUser = async (user: User): Promise<string[]> => {
  const introsRequestedByUser = await prisma.introduction.findMany({
    where: {
      requesterId: user.id,
    },
  });
  const contactIds = introsRequestedByUser.map((i) => i.contactId);
  console.log("getContactIdsTouchedByUser: ", user, contactIds);
  return contactIds;
};

export default getContactIdsTouchedByUser;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await getContactIdsTouchedByUser(user);
    console.log(ans);
  })();
}
