import prisma from "../prismaClient";
import { z, ZodError } from "zod";
import { IntroStates } from "@/lib/introStates";
import chalk from "chalk";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  await prisma.user.findFirstOrThrow();
})();

export {};
