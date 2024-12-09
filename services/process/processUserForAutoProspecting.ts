import prisma from "@/prismaClient";
import { Group, Introduction, User } from "@prisma/client";
import findBestContactForIntro from "@/services/contactFinder/findBestContactForIntro";
import generateAnIntroduction from "@/services/generateAnIntroduction";
import isUserMissingPersonalInfo from "@/services/isUserMissingPersonalInfo";
import isProspectEmailVerified from "@/services/isProspectEmailVerified";

const findAndGenerateIntro = async (
  user: User,
  group: Group,
): Promise<Introduction | null> => {
  console.log("processing user for group: ", user.email, group.name);

  const prospect = await findBestContactForIntro(user, group);
  if (!prospect) {
    console.log("unable to find best contact for auto intro: ", user, prospect);
    // await prisma.user.update({
    //   where: {
    //     id: user.id,
    //   },
    //   data: {
    //     unableToAutoProspect: true,
    //   },
    // });
    return null;
  }

  const emailVerified = await isProspectEmailVerified(prospect);
  if (!emailVerified) {
    throw new Error("prospect email could not be verified " + prospect.email);
  }

  const intro = await generateAnIntroduction(user, prospect);
  console.log("auto generated intro: ", user.email, prospect.email, intro.id);

  return intro;
};

const processUserForAutoProspecting = async (
  user: User,
): Promise<Introduction[] | null> => {
  const userMissingPersonalInfo = await isUserMissingPersonalInfo(user);
  if (userMissingPersonalInfo) {
    console.log("wont process user as missing personal info", user);
    return null;
  }

  const myApprovedGroups = await prisma.group.findMany({
    where: {
      memberships: {
        some: {
          userId: user.id,
          approved: true
        },
      },
    },
  });

  const introsGenerated: Introduction[] = [];
  for (const group of myApprovedGroups) {
    try {
      const result = await findAndGenerateIntro(user, group);
      if (result) {
        introsGenerated.push(result);
      } else {
        // todo - will make unable to auto prospect true unable to auto prospect for any group
        // await prisma.user.update({
        //   where: {
        //     id: user.id,
        //   },
        //   data: {
        //     unableToAutoProspect: false,
        //   },
        // });
      }
    } catch (err) {
      console.log(
        "got error while calling findAndGenerateIntro. will continue with next group.",
        user,
        group,
      );
    }
  }

  return introsGenerated;
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
