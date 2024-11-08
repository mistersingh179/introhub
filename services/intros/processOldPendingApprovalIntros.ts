import { User } from "@prisma/client";
import prisma from "@/prismaClient";
import { subDays } from "date-fns";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/pendingQueue/page";
import sendIntroducingBothEmail from "@/services/emails/sendIntroducingBothEmail";
import { IntroStates } from "@/lib/introStates";
import sendAskingPermissionToMakeIntroEmail from "@/services/emails/sendAskingPermissionToMakeIntroEmail";

const processOldPendingApprovalIntros = async (): Promise<
  IntroWithContactFacilitatorAndRequester[]
> => {
  const now = new Date();
  const allOldPendingApprovalIntros: IntroWithContactFacilitatorAndRequester[] =
    await prisma.introduction.findMany({
      where: {
        createdAt: {
          lt: subDays(now, 7),
        },
        status: IntroStates["pending approval"],
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
    });
  console.log("allOldPendingApprovalIntros: ", allOldPendingApprovalIntros);
  for (const intro of allOldPendingApprovalIntros) {
    await sendAskingPermissionToMakeIntroEmail(intro);
  }
  return allOldPendingApprovalIntros;
};

export default processOldPendingApprovalIntros;

if (require.main === module) {
  (async () => {
    await processOldPendingApprovalIntros();
  })();
}
