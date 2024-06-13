import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import MediumQueue from "@/bull/queues/mediumQueue";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { SendEmailInput } from "@/services/sendEmail";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import getAllProfiles from "@/services/getAllProfiles";

const sendEmailForApprovedIntro = async (
  intro: IntroWithContactFacilitatorAndRequester,
) => {
  console.log("in sendEmailForApprovedIntro with: ", intro);
  intro = await prisma.introduction.findFirstOrThrow({
    where: {
      status: IntroStates.approved,
      id: intro.id,
    },
    include: {
      facilitator: true,
      contact: true,
      requester: true,
    },
  });
  const account = await prisma.account.findFirstOrThrow({
    where: {
      userId: intro.facilitatorId,
    },
  });

  const emails = [
    intro.contact.email!,
    intro.facilitator.email!,
    intro.requester.email!,
  ];
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  const { contactProfiles, requestProfiles, facilitatorProfiles } =
    getAllProfiles(intro, emailToProfile, companyUrlToProfile);

  const sendEmailInput: SendEmailInput = {
    account,
    subject: `Intro request: ${contactProfiles.personProfile.fullName} <-> ${intro.requester.name}`,
    body: intro.messageForContact,
    from: intro.facilitator.email!,
    cc: intro.requester.email!,
    to: intro.contact.email,
    intro: intro,
  };

  // todo - sendIntroEmail job should use service & update intro & save email id/thread-id
  const jobObj = await MediumQueue.add("sendEmail", sendEmailInput);
  const { name, id } = jobObj;
  console.log("scheduled sendEmail job: ", name, id);
};

export default sendEmailForApprovedIntro;

if (require.main === module) {
  (async () => {
    const intro = await prisma.introduction.findFirstOrThrow({
      where: {
        status: IntroStates.approved,
      },
      include: {
        facilitator: true,
        contact: true,
        requester: true,
      },
    });
    const response = await sendEmailForApprovedIntro(intro);
    console.log(response);
  })();
}
