import prisma from "../prismaClient";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  differenceInMilliseconds,
  differenceInSeconds,
  formatDistance,
  subDays,
} from "date-fns";
import { IntroStates } from "@/lib/introStates";
import { PlatformGroupName } from "@/app/utils/constants";
import refreshScopes from "@/services/refreshScopes";
import getUniqueValuesWithOrderPreserved from "@/services/getUniqueValuesWithOrderPreserved";

const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  const intro = await prisma.introduction.findFirstOrThrow({
    where: {
      id: 'cm4ykntza0003josk3dqrvata'
    },
    include: {
      contact: true,
      requester: true,
      facilitator: true
    }
  });
  console.log(intro);
  // await prisma.personProfile.update({
  //   data: {
  //     fullName: 'Sandeep Arneja'
  //   },
  //   where: {
  //     email: 'sandeep@introhub.net'
  //   }
  // })
})();

export {};
