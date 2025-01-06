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
          gt: new Date(2024, 11, 1)
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
  let failCount = 0;
  let successCount = 0;
  for (const intro of allOldPendingApprovalIntros) {
    try{
      await sendAskingPermissionToMakeIntroEmail(intro);
      console.log("successfully called code to send permission seeking email: ", intro);
      successCount++;
    }catch(err){
      console.log('got error while trying to send permission seeking email: ', intro, err);
      failCount++;
    }
  }
  console.log("result of processOldPendingApprovalIntros: ", successCount, failCount);
  return allOldPendingApprovalIntros;
};

export default processOldPendingApprovalIntros;

if (require.main === module) {
  (async () => {
    await processOldPendingApprovalIntros();
  })();
}
