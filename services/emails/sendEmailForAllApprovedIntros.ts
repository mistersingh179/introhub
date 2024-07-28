import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import sendIntroducingBothEmail from "@/services/emails/sendIntroducingBothEmail";

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
    await sendIntroducingBothEmail(intro);
  }
};

export default sendEmailForAllApprovedIntros;

if (require.main === module) {
  (async () => {
    const response = await sendEmailForAllApprovedIntros();
    console.log(response);
  })();
}
