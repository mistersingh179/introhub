import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import { goingToChangeIntroStatus } from "@/services/canStateChange";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import sendEmailForApprovedIntro from "@/services/sendEmailForApprovedIntro";
import sendEmailForRejectedIntro from "@/services/sendEmailForRejectedIntro";

const moveIntroToBeRejected = async (
  intro: IntroWithContactFacilitatorAndRequester,
) => {
  console.log("in moveIntroToBeRejected");
  intro = await prisma.introduction.findFirstOrThrow({
    where: { id: intro.id },
    include: {
      requester: true,
      facilitator: true,
      contact: true,
    },
  });
  await goingToChangeIntroStatus(intro.id, IntroStates.rejected);
  await prisma.introduction.update({
    where: {
      id: intro.id,
    },
    data: {
      status: IntroStates.rejected,
    },
  });
  // await sendEmailForRejectedIntro(intro);
};

export default moveIntroToBeRejected;

if (require.main === module) {
  (async () => {
    const intros = await prisma.introduction.findMany({
      where: {
        status: IntroStates["pending approval"],
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
      const response = await moveIntroToBeRejected(intro);
      console.log(response);
    }
  })();
}
