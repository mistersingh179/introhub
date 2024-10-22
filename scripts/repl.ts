import prisma from "../prismaClient";
import OpenAI from "openai";
import * as tf from "@tensorflow/tfjs";
import { Contact, Food, Prisma } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";
import refreshAccessToken from "@/services/helpers/refreshAccessToken";
import {ChatOpenAI} from "@langchain/openai";
import {allowedEmailsForTesting, fullScope} from "@/app/utils/constants";
const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  console.log("Starting repl!");

  const users = await prisma.user.findMany({
    where: {
      agreedToAutoProspecting: true,
      accounts: {
        some: {
          scope: fullScope
        }
      }
    },
  });

  console.log(users);
})();

export {};
