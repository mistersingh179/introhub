import { Contact, Prisma, User } from "@prisma/client";
import prisma from "@/prismaClient";

const getContactEmailsOfThisUser = async (
  user: User,
): Promise<string[]> => {
  const contacts = await prisma.contact.findMany({
    where: {
      userId: user.id
    }
  })
  const contactEmails = [...new Set(contacts.map((c) => c.email))];
  console.log("getContactEmailsOfThisUser: ", user.email, contactEmails.length);
  return contactEmails;
};

export default getContactEmailsOfThisUser;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await getContactEmailsOfThisUser(user);
    console.log(ans);
  })();
}
