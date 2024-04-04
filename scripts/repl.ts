import prisma from "../prismaClient";
import { Prisma } from "@prisma/client";
import { PersonProfileWithExperiences } from "@/app/dashboard/introductions/create/[contactId]/page";
import { z } from "zod";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  const regex = new RegExp(/\*\*\[.*]\*\*/g)
  console.log(regex.test("foo bar **[hi]**"))
})();

export {};
