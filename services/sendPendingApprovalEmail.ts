import prisma from "@/prismaClient";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import getAllProfiles from "@/services/getAllProfiles";
import sendEmail, { systemEmail } from "@/services/sendEmail";
import introOverviewHtml from "@/email-templates/IntroOverviewHtml";
import { IntroStates } from "@/lib/introStates";
import { Profiles } from "@/app/dashboard/introductions/list/IntroTable";
import getFirstName from "@/services/getFirstName";

export const rodEmail = "rod@introhub.net";

const sendPendingApprovalEmail = async (
  intro: IntroWithContactFacilitatorAndRequester,
  actuallySendEmail: boolean = true,
) => {
  const systemAccount = await prisma.account.findFirstOrThrow({
    where: {
      user: {
        email: systemEmail,
      },
    },
  });

  const facilitatorsPendingIntro = await prisma.introduction.findFirst({
    where: {
      requester: intro.facilitator,
      status: IntroStates["pending credits"],
    },
    include: {
      contact: true,
      facilitator: true,
      requester: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  let emails = [
    intro.contact.email!,
    intro.requester.email!,
    intro.facilitator.email!,
  ];

  if (facilitatorsPendingIntro) {
    emails = emails.concat([
      facilitatorsPendingIntro.contact.email!,
      facilitatorsPendingIntro.requester.email!,
      facilitatorsPendingIntro.facilitator.email!,
    ]);
  }

  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  const { contactProfiles, requestProfiles, facilitatorProfiles } =
    getAllProfiles(intro, emailToProfile, companyUrlToProfile);

  let facilitatorsPendingIntroContactProfiles: Profiles | null = null;
  if (facilitatorsPendingIntro) {
    const { contactProfiles } = getAllProfiles(
      facilitatorsPendingIntro,
      emailToProfile,
      companyUrlToProfile,
    );
    facilitatorsPendingIntroContactProfiles = contactProfiles;
  }

  const html = introOverviewHtml(
    intro,
    contactProfiles,
    requestProfiles,
    facilitatorProfiles,
    facilitatorsPendingIntro,
    facilitatorsPendingIntroContactProfiles,
  );

  console.log("*** actuallySendEmail: ", actuallySendEmail);

  const requesterName = getFirstName(
    requestProfiles.personProfile.fullName,
    "An IntroHub user",
  );
  const contactName = getFirstName(
    contactProfiles.personProfile.fullName,
    "your contact",
  );

  if (actuallySendEmail) {
    await sendEmail({
      account: systemAccount,
      body: html,
      from: systemEmail,
      to: intro.facilitator.email!,
      cc: "",
      subject: `Pending Your approval – ${requesterName} wants to meet ${contactName}`,
    });
  }

  return html;
};

export default sendPendingApprovalEmail;

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
    const ans = await sendPendingApprovalEmail(intro);
    console.log("ans: ", ans);
    process.exit(0);
  })();
}
