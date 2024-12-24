import prisma from "../prismaClient";
import { subDays } from "date-fns";
import { IntroStates } from "@/lib/introStates";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/pendingQueue/page";

const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: "sandeep@introhub.net",
    },
  });
  const now = new Date();

  const introsInYourQueue: IntroWithContactFacilitatorAndRequester[] =
    await prisma.introduction.findMany({
      where: {
        facilitatorId: user.id,
        createdAt: {
          gte: subDays(now, 7),
        },
        status: IntroStates["pending approval"],
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  console.log("introsInYourQueue: ", introsInYourQueue);

  const introsWeAreMakingForYou: IntroWithContactFacilitatorAndRequester[] =
    await prisma.introduction.findMany({
      where: {
        requesterId: user.id,
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 10
    });

  console.log("introsWeAreMakingForYou: ", introsWeAreMakingForYou);
})();

export {};
