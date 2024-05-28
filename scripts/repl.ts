import prisma from "../prismaClient";
import prepareProspectsData from "@/services/prepareProspectsData";
import { getNewProspectsHtml } from "@/email-templates/NewProspects";
import { subDays } from "date-fns";
import HighQueue from "@/bull/queues/highQueue";

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
  const userId = 'clwjp1tda000f13y8f29ky4ki';

  const jobObj = await HighQueue.add("onBoardUser", { userId });
  const { name, id } = jobObj;

  const result = { message: "thanks!", name, id, userId };
  console.log(result);
})();

export {};
