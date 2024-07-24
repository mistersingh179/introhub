import { User } from "@prisma/client";
import prisma from "@/prismaClient";
import fetchWantedContact from "@/services/contactFinder/fetchWantedContact";
import { subDays } from "date-fns";

const getContactIdsTouchedRecently = async (): Promise<string[]> => {
  const now = new Date();

  const introsMadeRecently = await prisma.introduction.findMany({
    where: {
      createdAt: {
        gt: subDays(now, 7),
      },
    },
  });
  const contactIds = introsMadeRecently.map((i) => i.contactId);

  return contactIds;
};

export default getContactIdsTouchedRecently;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await getContactIdsTouchedRecently();
    console.log(ans);
  })();
}
