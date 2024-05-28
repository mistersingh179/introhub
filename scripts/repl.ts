import prisma from "../prismaClient";
import prepareProspectsData from "@/services/prepareProspectsData";
import { getNewProspectsHtml } from "@/email-templates/NewProspects";
import { subDays } from "date-fns";
import HighQueue from "@/bull/queues/highQueue";
import refreshScopes from "@/services/refreshScopes";

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
  const userId = 'cluvta2ke0000fat3dhwdwkim';

  const scopes = await refreshScopes(userId);
  console.log(scopes);

  // const jobObj = await HighQueue.add("onBoardUser", { userId });
  // const { name, id } = jobObj;
  //
  // const result = { message: "thanks!", name, id, userId };
  // console.log(result);
})();

export {};
