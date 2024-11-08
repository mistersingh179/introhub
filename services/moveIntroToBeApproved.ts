import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import { goingToChangeIntroStatus } from "@/services/canStateChange";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import sendIntroducingBothEmail from "@/services/emails/sendIntroducingBothEmail";

const moveIntroToBeApproved = async (
  intro: IntroWithContactFacilitatorAndRequester,
) => {
  console.log("in moveIntroToBeApproved");
  intro = await prisma.introduction.findFirstOrThrow({
    where: { id: intro.id },
    include: {
      requester: true,
      facilitator: true,
      contact: true,
    },
  });
  await goingToChangeIntroStatus(intro.id, IntroStates.approved);
  const now = new Date();
  await prisma.introduction.update({
    where: {
      id: intro.id,
    },
    data: {
      status: IntroStates.approved,
      approvedAt: now,
    },
  });
  await sendIntroducingBothEmail(intro);
};

export default moveIntroToBeApproved;

if (require.main === module) {
  (async () => {
    const intros = await prisma.introduction.findMany({
      where: {
        status: IntroStates["permission email sent"],
        requester: {
          credits: {
            gt: 1,
          },
        },
      },
      include: {
        requester: true,
        facilitator: true,
        contact: true,
      },
    });
    console.log("intros: ", intros);
    for (const intro of intros) {
      const response = await moveIntroToBeApproved(intro);
      console.log(response);
    }
  })();
}
