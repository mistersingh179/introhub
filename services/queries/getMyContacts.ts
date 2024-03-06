import prisma from "@/prismaClient";
import downloadMessages from "@/services/downloadMessages";
import { User } from "@prisma/client";

export type Contact = {
  name: string;
  address: string;
  count: number;
};

type GetMyContacts = (user: User) => Promise<Contact[]>;
const getMyContacts: GetMyContacts = async (user) => {
  const result = await prisma.message.groupBy({
    by: ["fromAddress", "fromName"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    where: {
      userId: user.id,
    },
  });
  const contacts: Contact[] = result
    .filter((rec) => rec.fromAddress)
    .map((rec) => ({
      name: rec.fromName ?? "",
      address: rec.fromAddress!,
      count: rec._count.id,
    }));

  return contacts;
};

export default getMyContacts;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@brandweaver.ai",
      },
      include: {
        accounts: true,
      },
    });
    const result = await getMyContacts(user);
    console.log(result);
  })();
}
