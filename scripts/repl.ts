import prisma from "../prismaClient";
import { Prisma } from "@prisma/client";
import {PersonProfileWithExperiences} from "@/app/dashboard/introductions/create/[contactId]/page";
import {z} from "zod";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  const schema = z.string().min(10);
  const ans = schema.parse("dfd");
  console.log(ans);
})();

export {};
