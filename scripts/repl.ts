import prisma from "../prismaClient";
import { Contact, Prisma } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";
import { google } from "googleapis";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {
  console.log("Hello world !");
  const jobTitlesWithCount = await prisma.personExperience.groupBy({
    by: "jobTitle",
    _count: {
      jobTitle: true,
    },
    orderBy: {
      _count: {
        jobTitle: 'desc'
      }
    },
    take: 5
  });
  console.log(jobTitlesWithCount);

})();

export {};
