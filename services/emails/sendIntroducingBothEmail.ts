import prisma from "@/prismaClient";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import getAllProfiles from "@/services/getAllProfiles";
import sendEmail, { systemEmail } from "@/services/emails/sendEmail";
import introOverviewHtml from "@/email-templates/IntroOverviewHtml";
import { IntroStates } from "@/lib/introStates";
import { Profiles } from "@/app/dashboard/introductions/list/IntroTable";
import getFirstName from "@/services/getFirstName";
import askPermissionToMakeIntroHtml from "@/email-templates/AskPermissionToMakeIntroHtml";
import introducingBothHtml from "@/email-templates/IntroducingBothHtml";

const sendIntroducingBothEmail = async (
  intro: IntroWithContactFacilitatorAndRequester,
  actuallySendEmail: boolean = true,
) => {
  const facilitatorAccount = await prisma.account.findFirstOrThrow({
    where: {
      user: {
        email: intro.facilitator.email,
      },
    },
  });

  let emails = [
    intro.contact.email!,
    intro.requester.email!,
    intro.facilitator.email!,
  ];

  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  const { contactProfiles, requestProfiles, facilitatorProfiles } =
    getAllProfiles(intro, emailToProfile, companyUrlToProfile);

  const requesterName = getFirstName(
    requestProfiles.personProfile.fullName,
    "An IntroHub user",
  );

  const contactName = getFirstName(contactProfiles.personProfile.fullName);

  const html = introducingBothHtml(
    intro,
    contactProfiles,
    requestProfiles,
  );

  console.log("*** actuallySendEmail: ", actuallySendEmail);

  if (actuallySendEmail) {
    await sendEmail({
      account: facilitatorAccount,
      body: html,
      from: intro.facilitator.email!,
      to: intro.contact.email!,
      cc: intro.requester.email!,
      subject: `Introduction: ${contactName} & ${requesterName}`,
      postEmailActionData:{
        intro,
        successState: IntroStates["introducing email sent"],
        failureState: IntroStates["introducing email send failure"]
      },
    });
  }

  return html;
};

export default sendIntroducingBothEmail;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const intro: IntroWithContactFacilitatorAndRequester =
      await prisma.introduction.findFirstOrThrow({
        where: {
          facilitator: user,
          status: IntroStates["pending approval"],
        },
        include: {
          contact: true,
          facilitator: true,
          requester: true,
        },
      });
    const ans = await sendIntroducingBothEmail(intro);
    console.log("ans: ", ans);
    process.exit(0);
  })();
}
