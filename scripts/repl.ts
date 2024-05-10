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
      jobTitle: true
    },
    orderBy: {
      _count: {
        jobTitle: 'asc',
      },
    },
  });
  const uniqueJobTitles = new Map();
  for (const rec of jobTitlesWithCount) {
    if(rec && rec.jobTitle){
      const trimmedTitle = rec.jobTitle.trim();
      if (trimmedTitle !== "" && !uniqueJobTitles.has(trimmedTitle)) {
        uniqueJobTitles.set(trimmedTitle, rec._count.jobTitle);
      }
    }
  }

  const orderedJobTitles = Array.from(uniqueJobTitles, ([title, count]) => ({ title, count }));

  console.log('Ordered Job Titles:', orderedJobTitles);
  console.log(orderedJobTitles[0].title, "***", orderedJobTitles[orderedJobTitles.length - 1].title);

})();

export {};
