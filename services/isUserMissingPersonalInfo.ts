import { User } from "@prisma/client";
import prisma from "@/prismaClient";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import getProfiles from "@/services/getProfiles";

const isUserMissingPersonalInfo = async (user: User): Promise<boolean> => {
  if (!user.email) {
    console.log("can't process user as missing email: ", user);
    await updateUser(user, true);
    return true;
  }

  if (!user.name) {
    console.log("can't process user as missing name: ", user);
    await updateUser(user, true);
    return true;
  }

  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles([user.email]);
  const profiles = getProfiles(user.email, emailToProfile, companyUrlToProfile);
  const linkedInUrl = profiles.companyProfile?.linkedInUrl;

  if (!linkedInUrl) {
    console.log("cant process as user missing linkedInUrl");
    await updateUser(user, true);
    return true;
  }

  await updateUser(user, false);
  return false;
};

const updateUser = async (user: User, missingPersonalInfo: boolean) => {
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      missingPersonalInfo,
    },
  });
};

export default isUserMissingPersonalInfo;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "bar@foo.com",
      },
    });
    const ans = await isUserMissingPersonalInfo(user);
    console.log("ans: ", ans);
    process.exit(0);
  })();
}
