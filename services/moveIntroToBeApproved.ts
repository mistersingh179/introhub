import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import { goingToChangeIntroStatus } from "@/services/canStateChange";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import sendEmailForApprovedIntro from "@/services/sendEmailForApprovedIntro";
import sendIntroducingBothEmail from "@/services/sendIntroducingBothEmail";

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
  await prisma.introduction.update({
    where: {
      id: intro.id,
    },
    data: {
      status: IntroStates.approved,
    },
  });
  await sendIntroducingBothEmail(intro);
};

export default moveIntroToBeApproved;

if (require.main === module) {
  (async () => {
    const intros = await prisma.introduction.findMany({
      where: {
        status: IntroStates["pending credits"],
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
