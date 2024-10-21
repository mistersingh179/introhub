import prisma from "../prismaClient";
import OpenAI from "openai";
import * as tf from "@tensorflow/tfjs";
import { Contact, Food, Prisma } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";
import refreshAccessToken from "@/services/helpers/refreshAccessToken";
import {ChatOpenAI} from "@langchain/openai";
const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  console.log("Starting repl!");

  const user = await prisma.user.findFirst({
    where: {
      email: "sandeep@introhub.net",
    },
  });

  const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });
  const ans = await model.invoke("hi");
  console.log(ans);

  console.log(user);
})();

export {};
