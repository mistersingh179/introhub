import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import getAllProfiles from "@/services/getAllProfiles";
import getFirstName from "@/services/getFirstName";

const buildThreadIds = async () => {
  console.log("in buildThreadIds: ", buildThreadIds);

  const intros = await prisma.introduction.findMany({
    where: {
      messageForContact: "",
      status: IntroStates["introducing email sent"],
      threadId: null,
    },
    include: {
      requester: true,
      facilitator: true,
      contact: true,
    },
  });

  console.log("intros with missing threadId: ", intros.length);

  for (const intro of intros) {
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
    const contactName = getFirstName(contactProfiles.personProfile?.fullName);
    if (!contactName) {
      continue;
    }
    const subject = `Introduction: ${contactName} & ${requesterName}`;
    const message = await prisma.message.findMany({
      where: {
        userId: intro.requesterId,
        subject,
      },
    });
    console.log("subject: ", subject);
    if (message.length === 1) {
      console.log("message:  ", message.length, message);
      const threadId = message[0].threadId;

      console.log("threadId: ", threadId);
      if (!intro.threadId) {
        await prisma.introduction.update({
          where: {
            id: intro.id,
          },
          data: {
            threadId,
          },
        });
      }
    }
  }
};

export default buildThreadIds;

if (require.main === module) {
  (async () => {
    await buildThreadIds();
  })();
}
