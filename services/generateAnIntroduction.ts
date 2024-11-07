import { Contact, Introduction, User } from "@prisma/client";
import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import sendAskingPermissionToMakeIntroEmail from "@/services/emails/sendAskingPermissionToMakeIntroEmail";

const generateAnIntroduction = async (
  requester: User,
  prospect: Contact,
): Promise<Introduction> => {
  console.log("generating intro for: ", requester.email, prospect.email);
  const intro = await prisma.introduction.create({
    data: {
      contactId: prospect.id,
      facilitatorId: prospect.userId,
      requesterId: requester.id,
      status: IntroStates["pending approval"],
      messageForContact: "",
      messageForFacilitator: "",
    },
    include: {
      contact: true,
      facilitator: true,
      requester: true,
    },
  });
  await sendAskingPermissionToMakeIntroEmail(intro);
  return intro;
};

export default generateAnIntroduction;

if (require.main === module) {
  (async () => {
    // requester - rod
    // prospect - mister
    // facilitator - sandeep

    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "rod@introhub.net",
      },
    });
    const prospect = await prisma.contact.findFirstOrThrow({
      where: {
        email: 'mistersingh179@gmail.com',
        user: {
          email: 'sandeep@introhub.net'
        }
      },
      include: {
        user: true
      }
    });
    // console.log("prospect: ", prospect);
    await generateAnIntroduction(user, prospect);
  })();
}
