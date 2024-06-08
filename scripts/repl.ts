import prisma from "../prismaClient";
import getFiltersFromSearchParams from "@/services/getFiltersFromSearchParams";
import getProspectsBasedOnFilters, {
  PaginatedValues,
} from "@/services/getProspectsBasedOnFilters";
import { startOfToday, subDays } from "date-fns";
import prepareProspectsData from "@/services/prepareProspectsData";
import {IntroStates} from "@/lib/introStates";
import {IntroWithContactFacilitatorAndRequester} from "@/app/dashboard/introductions/list/page";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: "clwrwfkm00000w98m2jfyc4k6"
    }
  })
  console.log("user.credits: ", user.credits);
  const usersRequestedPendingIntros: IntroWithContactFacilitatorAndRequester[] = await prisma.introduction.findMany({
    where: {
      requesterId: user.id,
      status: IntroStates["pending credits"],
    },
    include: {
      requester: true,
      facilitator: true,
      contact: true,
    },
    take: user.credits,
  });
  console.log("usersRequestedPendingIntros:" , usersRequestedPendingIntros);


})();

export {};
