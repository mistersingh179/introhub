import prisma from "../prismaClient";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { RunnableSequence } from "@langchain/core/runnables";
import {subDays} from "date-fns";
import {IntroStates} from "@/lib/introStates";

const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  console.log("Starting repl!");

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: "rod@introhub.net",
    },
  });
  const now = new Date();
  const ans = await prisma.introduction.findMany({
    where: {
      requesterId: user.id,
      approvedAt: {
        gte: subDays(now, 7),
      },
      status: IntroStates.approved
    },
    include: {
      contact: true,
      facilitator: true,
      requester: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  console.log(ans);
})();

export {};
