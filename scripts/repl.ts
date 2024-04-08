import prisma from "../prismaClient";
import { Prisma } from "@prisma/client";
import { PersonProfileWithExperiences } from "@/app/dashboard/introductions/create/[contactId]/page";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import {ProxyCurlError} from "@/services/helpers/proxycurl/ProxyCurlError";
import HighQueue from "@/bull/queues/highQueue";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  const jobObj = await HighQueue.add("foo", {});
  const { name, id } = jobObj;
  console.log("result of adding job: ", name, id);
})();

export {};
