import { Contact, Prisma, User } from "@prisma/client";
import prisma from "@/prismaClient";

const getContactIdsOfOthersUsersKnownToThisUser = async (
  user: User,
): Promise<string[]> => {
  const sql = Prisma.sql`
      select C2.*
      from "Contact" C
               inner join "Contact" C2 on C2.email = C.email and C2."userId" != ${user.id}
      where C."userId" = ${user.id}`;

  const contacts = await prisma.$queryRaw<Contact[]>(sql);

  const contactIds = contacts.map((i) => i.id);
  console.log("getContactIdsKnownToUser: ", user.email, contactIds);
  return contactIds;
};

export default getContactIdsOfOthersUsersKnownToThisUser;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await getContactIdsOfOthersUsersKnownToThisUser(user);
    console.log(ans);
  })();
}
