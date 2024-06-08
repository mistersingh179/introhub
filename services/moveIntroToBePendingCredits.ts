import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import { goingToChangeIntroStatus } from "@/services/canStateChange";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import removeCreditsFromUser from "@/services/removeCreditsFromUser";

const moveIntroToBePendingCredits = async (
  intro: IntroWithContactFacilitatorAndRequester,
) => {
  console.log("in moveIntroToBePendingCredits");
  intro = await prisma.introduction.findFirstOrThrow({
    where: { id: intro.id },
    include: {
      requester: true,
      facilitator: true,
      contact: true,
    },
  });
  await goingToChangeIntroStatus(intro.id, IntroStates["pending credits"]);
  await prisma.introduction.update({
    where: {
      id: intro.id,
    },
    data: {
      status: IntroStates["pending credits"],
    },
  });
};

export default moveIntroToBePendingCredits;

if (require.main === module) {
  (async () => {
    const intros = await prisma.introduction.findMany({
      where: {
        status: IntroStates["pending credits"],
      },
      include: {
        requester: true,
        facilitator: true,
        contact: true,
      },
    });
    console.log("intros: ", intros);
    for (const intro of intros) {
      const response = await moveIntroToBePendingCredits(intro);
      console.log(response);
    }
  })();
}
