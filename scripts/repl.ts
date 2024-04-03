import prisma from "../prismaClient";
import { Prisma } from "@prisma/client";
import {PersonProfileWithExperiences} from "@/app/dashboard/introductions/create/[contactId]/page";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  const personProfile: PersonProfileWithExperiences =
    await prisma.personProfile.findFirstOrThrow({
      where: {
        email: 'sandeep@brandweaver.ai',
      },
      include: {
        personExperiences: true,
      },
    });
  const personExperience = personProfile.personExperiences[0];
  console.log(personExperience);
})();

export {};
