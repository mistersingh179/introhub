import { Contact, Prisma, User } from "@prisma/client";
import prisma from "@/prismaClient";

const getContactIdsWhichHaveSameLinkedInUrlFromThisUsersContacts = async (
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

  const contactIds = contacts.map((i) => i.id);
  console.log("getContactIdsWhichHaveSameLinkedInUrlFromThisUsersContacts: ", user.email, contactIds);
  return contactIds;
};

export default getContactIdsWhichHaveSameLinkedInUrlFromThisUsersContacts;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await getContactIdsWhichHaveSameLinkedInUrlFromThisUsersContacts(user);
    console.log(ans);
  })();
}
