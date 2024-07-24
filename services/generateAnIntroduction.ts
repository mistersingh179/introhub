import { Contact, User } from "@prisma/client";
import prisma from "@/prismaClient";
import {IntroStates} from "@/lib/introStates";
import sendAskingPermissionToMakeIntroEmail from "@/services/sendAskingPermissionToMakeIntroEmail";

const generateAnIntroduction = async (requester: User, prospect: Contact) => {
  console.log("going to generate an intro for: ", requester, prospect);
  const intro = await prisma.introduction.create({
    data: {
      contactId: prospect.id,
      facilitatorId: prospect.userId,
      requesterId: requester.id,
      status: IntroStates["pending approval"],
      messageForContact: '',
      messageForFacilitator: '',
    },
    include: {
      contact: true,
      facilitator: true,
      requester: true,
    }
  });
  await sendAskingPermissionToMakeIntroEmail(intro);
};

export default generateAnIntroduction;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const prospect = await prisma.contact.findFirstOrThrow({});
    await generateAnIntroduction(user, prospect);
  })();
}
