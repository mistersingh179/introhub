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
  const intros = await prisma.introduction.groupBy({
    by: ['facilitatorId'],
    where: {
      createdAt: {
        gte: subDays(new Date(), 200)
      }
    },
    _count: {
      facilitatorId: true,
    },
    having: {
      facilitatorId: {
        _count: {
          gte: 2
        }
      },
    }
  })

  console.log(intros);
})();

export {};
