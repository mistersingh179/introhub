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
  console.log(
    "found contact: ",
    user.email,
    group.name,
    prospect.email,
    prospect.id,
  );

  const emailVerified = await isProspectEmailVerified(prospect);
  if (!emailVerified) {
    throw new Error("prospect email could not be verified " + prospect.email);
  }

  const intro = await generateAnIntroduction(user, prospect);
  console.log(
    "auto generated intro: ",
    user.email,
    group.name,
    prospect.email,
    intro.id,
  );

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
          approved: true,
        },
      },
    },
  });
  console.log("myApprovedGroups: ", myApprovedGroups);

  const introsGenerated: Introduction[] = [];
  for (const group of myApprovedGroups) {
    console.log("running auto prospecting for: ", user.email, group.name);
    try {
      const result = await findAndGenerateIntro(user, group);
      console.log("intro generated: ", user.email, group.name, result);
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
        user.email,
        group.name,
      );
    }
  }

  console.log(
    "intros generated: ",
    user.email,
    introsGenerated.length,
    introsGenerated,
  );
  return introsGenerated;
};

export default processUserForAutoProspecting;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "rod@introhub.net",
      },
    });
    const ans = await processUserForAutoProspecting(user);
    console.log("ans: ", ans);
  })();
}
