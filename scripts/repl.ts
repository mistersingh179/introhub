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
  const users = await prisma.user.findMany({
    where: {
      agreedToAutoProspecting: true,
      accounts: {
        some: {
          scope: { contains: fullScope },
        },
      },
    },
  });
  const foo: string[] = []
  for (const user of users) {
    const result = await sendIntroDigestEmail(user, false);
    if(result){
      foo.push(user.email!)
    }
  }
  console.log(foo);

})();

export {};
