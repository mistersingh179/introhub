import prisma from "@/prismaClient";
import {IntroWithContactFacilitatorAndRequester} from "@/app/dashboard/introductions/list/page";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import getAllProfiles from "@/services/getAllProfiles";
import sendEmail from "@/services/emails/sendEmail";
import {IntroStates} from "@/lib/introStates";
import getFirstName from "@/services/getFirstName";
import askPermissionToMakeIntroHtml from "@/email-templates/AskPermissionToMakeIntroHtml";

const sendAskingPermissionToMakeIntroEmail = async (
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

  const html = askPermissionToMakeIntroHtml(
    intro,
    contactProfiles,
    requestProfiles,
  );

  console.log("*** actuallySendEmail: ", actuallySendEmail);

  const requesterName = getFirstName(
    requestProfiles.personProfile.fullName,
    "An IntroHub user",
  );

  if (actuallySendEmail) {
    await sendEmail({
      account: facilitatorAccount,
      body: html,
      from: intro.facilitator.email!,
      to: intro.contact.email!,
      cc: "",
      subject: `Can I introduce you to ${requesterName}?`,
      postEmailActionData: {
        intro: intro,
        successState: IntroStates['permission email sent'],
        failureState: IntroStates["permission email send failure"],
        storeThreadIdInColumn: "permissionEmailThreadId"
      }
    });
  }

  return html;
};

export default sendAskingPermissionToMakeIntroEmail;

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
    const ans = await sendAskingPermissionToMakeIntroEmail(intro);
    console.log("ans: ", ans);
    process.exit(0);
  })();
}
