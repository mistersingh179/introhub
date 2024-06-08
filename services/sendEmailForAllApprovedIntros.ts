import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import MediumQueue from "@/bull/queues/mediumQueue";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { SendEmailInput } from "@/services/sendEmail";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import getAllProfiles from "@/services/getAllProfiles";

const sendEmailForAllApprovedIntros = async () => {
  console.log("in sendEmailForAllApprovedIntros");
  const intros: IntroWithContactFacilitatorAndRequester[] =
    await prisma.introduction.findMany({
      where: {
        status: IntroStates.approved,
      },
      include: {
        facilitator: true,
        contact: true,
        requester: true,
      },
    });
  console.log("intros: ", intros);
  for (const intro of intros) {
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
  }
};

export default sendEmailForAllApprovedIntros;

if (require.main === module) {
  (async () => {
    const response = await sendEmailForAllApprovedIntros();
    console.log(response);
  })();
}
