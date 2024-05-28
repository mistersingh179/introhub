import { Contact, User } from "@prisma/client";
import prisma from "@/prismaClient";
import { ContactWithUser } from "@/app/dashboard/introductions/create/[contactId]/page";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";

const prepareProspectsData = async (prospects: Contact[]) => {
  const userIds = [...new Set(prospects.map((p) => p.userId))];
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });
  const usersIdHash = users.reduce<Record<string, User>>((acc, cv) => {
    acc[cv.id] = cv;
    return acc;
  }, {});
  const prospectsWithUser = prospects.reduce<ContactWithUser[]>((acc, cv) => {
    const p = {
      ...cv,
      user: usersIdHash[cv.userId],
    };
    acc.push(p);
    return acc;
  }, []);

  let emails = prospectsWithUser.reduce<string[]>((acc, prospect) => {
    acc.push(prospect.email);
    acc.push(prospect.user.email!);
    return acc;
  }, []);
  emails = [...new Set(emails)];
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  return { prospectsWithUser, emailToProfile, companyUrlToProfile };
};

export default prepareProspectsData;

if (require.main === module) {
  (async () => {
    const prospects = await prisma.contact.findMany({
      take: 2,
    });
    const ans = await prepareProspectsData(prospects);
    console.log("*** ans: ", ans);
  })();
}
