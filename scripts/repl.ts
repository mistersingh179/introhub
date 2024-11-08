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

  const introDate = new Date(2024, 10, 2);
  const now = new Date();
  const targetDate = subDays(now, 7);

  const timeLeft = differenceInMilliseconds(introDate, targetDate);
  const words = formatDistance(introDate, targetDate, {
    addSuffix: true
  });

  console.log(words);
})();

export {};
