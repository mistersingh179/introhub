import { User } from "@prisma/client";
import prisma from "@/prismaClient";
import { subDays } from "date-fns";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/pendingQueue/page";
import sendIntroducingBothEmail from "@/services/emails/sendIntroducingBothEmail";
import { IntroStates } from "@/lib/introStates";

const processOldApprovedIntros = async (): Promise<
  IntroWithContactFacilitatorAndRequester[]
> => {
  const now = new Date();
  const allOldApprovedIntros: IntroWithContactFacilitatorAndRequester[] =
    await prisma.introduction.findMany({
      where: {
        approvedAt: {
          lt: subDays(now, 7),
        },
        status: IntroStates.approved,
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
    });
  console.log("allOldApprovedIntros: ", allOldApprovedIntros);
  for (const intro of allOldApprovedIntros) {
    await sendIntroducingBothEmail(intro);
  }
  return allOldApprovedIntros;
};

export default processOldApprovedIntros;

if (require.main === module) {
  (async () => {
    await processOldApprovedIntros();
  })();
}
