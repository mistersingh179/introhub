import prisma from "@/prismaClient";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import getAllProfiles from "@/services/getAllProfiles";
import sendEmail from "@/services/emails/sendEmail";
import { IntroStates } from "@/lib/introStates";
import getFirstName from "@/services/getFirstName";
import introducingBothHtml from "@/email-templates/IntroducingBothHtml";
import accquireLock from "@/services/helpers/accquireLock";

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

  const html = introducingBothHtml(intro, contactProfiles, requestProfiles);

  console.log("*** actuallySendEmail: ", actuallySendEmail);

  if (actuallySendEmail && !intro.introducingEmailThreadId) {
    const lockAcquired = await accquireLock(
      `send-introducing-email:${intro.id}`,
      30_000,
    );
    if (lockAcquired) {
      await sendEmail({
        account: facilitatorAccount,
        body: html,
        from: intro.facilitator.email!,
        to: intro.contact.email!,
        cc: intro.requester.email!,
        subject: `Introduction: ${contactName}, meet ${requesterName}!`,
        postEmailActionData: {
          intro,
          successState: IntroStates["introducing email sent"],
          failureState: IntroStates["introducing email send failure"],
          storeThreadIdInColumn: "introducingEmailThreadId",
        },
      });
    } else {
      console.log(
        `will bail on sending email as failed to acquire lock for intro ID: ${intro.id}`,
      );
    }
  } else {
    console.log("did not send email: ", intro.id);
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
          // status: IntroStates["pending approval"],
          id: "cm397hkle0001d9enm4g3tziu",
        },
        include: {
          contact: true,
          facilitator: true,
          requester: true,
        },
      });
    const ans = await sendIntroducingBothEmail(intro);
    // console.log("ans: ", ans);
    process.exit(0);
  })();
}
