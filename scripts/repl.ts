import prisma from "../prismaClient";
import { z, ZodError } from "zod";
import { IntroStates } from "@/lib/introStates";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  console.log("in repl");
  console.log(typeof IntroStates.rejected);
  console.log([IntroStates.rejected].length);
  console.log([IntroStates.rejected, IntroStates.approved].includes("pending approval" as IntroStates));
})();

export {};
