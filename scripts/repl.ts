import prisma from "../prismaClient";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { RunnableSequence } from "@langchain/core/runnables";
import {differenceInMilliseconds, differenceInSeconds, formatDistance, subDays} from "date-fns";
import {IntroStates} from "@/lib/introStates";

const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  console.log("Starting repl!");

  const introductionId = 'cm395l9as0001oya4jyk32d0w'

  const intro = await prisma.introduction.findFirstOrThrow({
    where: {
      // facilitatorId: user.id,
      id: introductionId,
      status: IntroStates["pending approval"],
    },
    include: {
      contact: true,
      facilitator: true,
      requester: true,
    },
  });

  console.log(intro);


})();

export {};
