import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import MediumQueue from "@/bull/queues/mediumQueue";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { SendEmailInput } from "@/services/sendEmail";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import getAllProfiles from "@/services/getAllProfiles";
import getFirstName from "@/services/getFirstName";

const sendEmailForRejectedIntro = async (
  intro: IntroWithContactFacilitatorAndRequester,
) => {
  console.log("in sendEmailForRejectedIntro with: ", intro);
  intro = await prisma.introduction.findFirstOrThrow({
    where: {
      status: IntroStates.rejected,
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

  const contactName = getFirstName(contactProfiles.personProfile.fullName);
  const requesterName = getFirstName(intro.requester.name);
  const facilitatorName = getFirstName(intro.facilitator.name, "IntroHub User");

  const sendEmailInput: SendEmailInput = {
    account,
    subject: `Connecting You Both: ${contactName} & ${requesterName}`,
    body: `Hi ${requesterName},\
    I asked ${contactName} if I can introduce you to them, but they denied by invitation.\
    Regards,\
    ${facilitatorName}`,
    from: intro.facilitator.email!,
    cc: intro.requester.email!,
    to: intro.contact.email,
    // intro: intro,
  };

  // todo - sendIntroEmail job should use service & update intro & save email id/thread-id
  const jobObj = await MediumQueue.add("sendEmail", sendEmailInput);
  const { name, id } = jobObj;
  console.log("scheduled sendEmail job: ", name, id);
};

export default sendEmailForRejectedIntro;

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
    const response = await sendEmailForRejectedIntro(intro);
    console.log(response);
  })();
}
