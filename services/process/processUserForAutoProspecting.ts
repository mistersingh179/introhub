import prisma from "@/prismaClient";
import { Introduction, User } from "@prisma/client";
import findBestContactForIntro from "@/services/contactFinder/findBestContactForIntro";
import generateAnIntroduction from "@/services/generateAnIntroduction";
import isUserMissingPersonalInfo from "@/services/isUserMissingPersonalInfo";
import isProspectEmailVerified from "@/services/isProspectEmailVerified";

const processUserForAutoProspecting = async (
  user: User,
): Promise<Introduction | null> => {
  const userMissingPersonalInfo = await isUserMissingPersonalInfo(user);
  if (userMissingPersonalInfo) {
    console.log("wont process user as missing personal info", user);
    return null;
  }

  const prospect = await findBestContactForIntro(user);
  if (!prospect) {
    console.log("unable to find best contact for auto intro: ", user, prospect);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        unableToAutoProspect: true,
      },
    });
    return null;
  }

  const emailVerified = await isProspectEmailVerified(prospect);
  if (!emailVerified) {
    throw new Error("prospect email could not be verified " + prospect.email);
  }

  const intro = await generateAnIntroduction(user, prospect);
  console.log("auto generated intro: ", user.email, prospect.email, intro.id);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      unableToAutoProspect: false,
    },
  });

  return intro;
};

export default processUserForAutoProspecting;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "mistersingh179@gmail.com",
      },
    });
    const ans = await processUserForAutoProspecting(user);
    console.log("ans: ", ans);
  })();
}
