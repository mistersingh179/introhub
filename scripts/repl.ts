import prisma from "../prismaClient";
import { z, ZodError } from "zod";
import { IntroStates } from "@/lib/introStates";
import chalk from "chalk";
import {SendEmailInput} from "@/services/sendEmail";
import MediumQueue from "@/bull/queues/mediumQueue";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  const intro = await prisma.introduction.findFirstOrThrow();
  const account = await prisma.account.findFirstOrThrow();

  const sendEmailInput: SendEmailInput = {
    account,
    body: intro.messageForContact,
    from: "Sandeep Arneja <sandeep@brandweaver.ai>",
    to: "Mister Singh <mistersingh179@gmail.com>",
    cc: "Sandeep Arneja ONE <sandeep+1@brandweaver.ai>",
    subject: "good morning 🥳",
  }

  const jobObj = await MediumQueue.add("sendEmail", sendEmailInput);
  const { name, id } = jobObj;
  console.log("scheduled sendEmail job: ", name, id);
})();

export {};
