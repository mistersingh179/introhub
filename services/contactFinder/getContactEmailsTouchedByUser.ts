import { User } from "@prisma/client";
import prisma from "@/prismaClient";
import fetchWantedContact from "@/services/contactFinder/fetchWantedContact";

const getContactEmailsTouchedByUser = async (user: User): Promise<string[]> => {
  const introsRequestedByUser = await prisma.introduction.findMany({
    where: {
      requesterId: user.id,
    },
    include: {
      contact: true,
    },
  });
  const contactEmails = [
    ...new Set(introsRequestedByUser.map((i) => i.contact.email)),
  ];
  console.log("getContactIdsTouchedByUser: ", user.email, contactEmails);
  return contactEmails;
};

export default getContactEmailsTouchedByUser;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await getContactEmailsTouchedByUser(user);
    console.log(ans);
  })();
}
