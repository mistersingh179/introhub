import { User } from "@prisma/client";
import prisma from "@/prismaClient";
import fetchWantedContact from "@/services/contactFinder/fetchWantedContact";
import { subDays } from "date-fns";

const getContactEmailsTouchedRecently = async (): Promise<string[]> => {
  const now = new Date();

  const introsMadeRecently = await prisma.introduction.findMany({
    where: {
      createdAt: {
        gt: subDays(now, 7),
      },
    },
    include: {
      contact: true,
    },
  });
  const contactEmails = [
    ...new Set(introsMadeRecently.map((i) => i.contact.email)),
  ];

  return contactEmails;
};

export default getContactEmailsTouchedRecently;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await getContactEmailsTouchedRecently();
    console.log(ans);
  })();
}
