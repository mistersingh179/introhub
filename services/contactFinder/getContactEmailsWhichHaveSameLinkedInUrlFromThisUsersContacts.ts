import { Contact, Prisma, User } from "@prisma/client";
import prisma from "@/prismaClient";

const getContactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts = async (
  user: User,
): Promise<string[]> => {
  const sql = Prisma.sql`
      select C2.*
      from "Contact" C
               inner join "PersonProfile" PP on PP.email = C.email
               inner join "PersonProfile" PP2 on PP2."linkedInUrl" = PP."linkedInUrl"
               inner join "Contact" C2 on C2.email = PP2.email
      where C."userId" = ${user.id}
        and C2."userId" != ${user.id}`;

  const contacts = await prisma.$queryRaw<Contact[]>(sql);

  const contactEmails = contacts.map((c) => c.email);
  console.log("getContactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts: ", user.email, contactEmails);
  return contactEmails;
};

export default getContactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await getContactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts(user);
    console.log(ans);
  })();
}
