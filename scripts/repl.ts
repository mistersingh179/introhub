import prisma from "../prismaClient";

import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { IntroStates } from "@/lib/introStates";
import getGmailObject from "@/services/helpers/getGmailObject";
import {startOfToday, subDays} from "date-fns";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {
  const ans = await prisma.user.findMany({
    where: {
      agreedToAutoProspecting: true
    }
  });

  console.log(ans);
})();

export {};
