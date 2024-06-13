import prisma from "../prismaClient";

import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { IntroStates } from "@/lib/introStates";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {
  // let introsToProcess: IntroWithContactFacilitatorAndRequester[] | undefined =
  //   await prisma.introduction.findMany({
  //     include: {
  //       requester: true,
  //       facilitator: true,
  //       contact: true
  //     },
  //     take: 100
  //   });
  // const introsToProcess: IntroWithContactFacilitatorAndRequester[] | undefined =
  //   undefined;
  // // console.log("introsToProcess?.length: ", introsToProcess?.length);
  // console.log(
  //   introsToProcess?.map((x: IntroWithContactFacilitatorAndRequester) => x.id),
  // );
  let a = undefined;
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

  console.log("intros: ", intros.length);
})();

export {};
