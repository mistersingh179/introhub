import { Contact, Prisma, User } from "@prisma/client";
import prisma from "@/prismaClient";

const getContactEmailsWhichHaveSameLinkedInUrlAsThisUser = async (
  user: User,
): Promise<string[]> => {
  const sql = Prisma.sql`
      WITH UserInfo AS (SELECT PP."linkedInUrl"
                        FROM "User" U
                                 INNER JOIN "PersonProfile" PP ON U.email = PP.email
                        WHERE U.id = ${user.id})
      SELECT C.*
      FROM "Contact" C
               INNER JOIN "PersonProfile" PP ON C.email = PP.email
               INNER JOIN UserInfo UI ON PP."linkedInUrl" = UI."linkedInUrl";`;

  const contacts = await prisma.$queryRaw<Contact[]>(sql);

  const contactEmails = [...new Set(contacts.map((c) => c.email))];
  console.log("getContactEmailsWhichHaveSameLinkedInUrlAsThisUser: ", user.email, contactEmails);
  return contactEmails;
};

export default getContactEmailsWhichHaveSameLinkedInUrlAsThisUser;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await getContactEmailsWhichHaveSameLinkedInUrlAsThisUser(user);
    console.log(ans);
  })();
}
