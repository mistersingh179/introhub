import processRateLimitedRequest from "@/services/processRateLimitedRequest";
import prisma from "@/prismaClient";
import { Contact, Introduction, User } from "@prisma/client";
import findBestContactForIntro from "@/services/contactFinder/findBestContactForIntro";
import generateAnIntroduction from "@/services/generateAnIntroduction";

const processUserForAutoProspecting = async (
  user: User,
): Promise<Introduction | null> => {
  const prospect = await findBestContactForIntro(user);
  if (prospect) {
    const intro = await generateAnIntroduction(user, prospect);
    console.log("auto generated intro request: ", user, prospect, intro);
    return intro;
  } else {
    console.log("unable to find best contact for auto intro: ", user, prospect);
    return null;
  }
};

export default processUserForAutoProspecting;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where:{
        email: 'sandeep@introhub.net'
      }
    });
    const ans = await processUserForAutoProspecting(user);
    console.log("ans: ", ans);
  })();
}
