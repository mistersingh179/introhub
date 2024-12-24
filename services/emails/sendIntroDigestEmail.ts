import prisma from "@/prismaClient";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import sendEmail from "@/services/emails/sendEmail";
import { IntroStates } from "@/lib/introStates";
import introDigestHtml from "@/email-templates/IntroDigestHtml";
import { User } from "@prisma/client";
import { subDays } from "date-fns";
import { rodEmail } from "@/app/utils/constants";

const sendIntroDigestEmail = async (
  user: User,
  actuallySendEmail: boolean = true,
) => {
  const now = new Date();

  const RodAccount = await prisma.account.findFirstOrThrow({
    where: {
      user: {
        email: rodEmail,
      },
      provider: "google",
    },
  });

  const introsInYourQueue: IntroWithContactFacilitatorAndRequester[] =
    await prisma.introduction.findMany({
      where: {
        facilitatorId: user.id,
        createdAt: {
          gte: subDays(now, 7),
        },
        status: IntroStates["pending approval"],
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  console.log("introsInYourQueue: ", introsInYourQueue);

  const introsWeAreMakingForYou: IntroWithContactFacilitatorAndRequester[] =
    await prisma.introduction.findMany({
      where: {
        requesterId: user.id,
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 10,
    });

  console.log("introsWeAreMakingForYou: ", introsWeAreMakingForYou);

  if(introsWeAreMakingForYou.concat(introsInYourQueue).length === 0){
    console.log("since there are no intros we will bail!");
    return "";
  }

  const emails = [
    ...new Set(
      introsInYourQueue
        .concat(introsWeAreMakingForYou)
        .reduce<string[]>((acc, intro) => {
          acc.push(intro.contact.email);
          acc.push(intro.requester.email!);
          acc.push(intro.facilitator.email!);
          return acc;
        }, []),
    ),
  ];

  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  // const { contactProfiles, requestProfiles, facilitatorProfiles } =
  //   getAllProfiles(introduction, emailToProfile, companyUrlToProfile);

  const html = introDigestHtml(
    introsInYourQueue,
    introsWeAreMakingForYou,
    emailToProfile,
    companyUrlToProfile,
  );


  console.log("*** actuallySendEmail: ", actuallySendEmail);

  if (actuallySendEmail) {
    await sendEmail({
      account: RodAccount,
      body: html,
      from: rodEmail,
      to: user.email!,
      cc: "",
      subject: `Daily Digest`,
    });
  }

  return html;
};

export default sendIntroDigestEmail;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await sendIntroDigestEmail(user, false);
    console.log("ans: ", ans);
    process.exit(0);
  })();
}
