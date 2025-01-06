import prisma from "../prismaClient";
import { subDays } from "date-fns";
import { IntroStates } from "@/lib/introStates";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/pendingQueue/page";
import {fullScope} from "@/app/utils/constants";
import MediumQueue from "@/bull/queues/mediumQueue";
import sendIntroDigestEmail from "@/services/emails/sendIntroDigestEmail";

const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
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
  console.log("allOldPendingApprovalIntros: ", allOldPendingApprovalIntros.length)


})();

export {};
