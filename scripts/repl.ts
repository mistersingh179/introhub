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

  const allowedEmails = ['rod@intorhub.net', 'sandeep@introhub.net', 'rod@brandweaver.ai', 'a'];
  const from = 'a';
  if(allowedEmails.find((x) => x === from)){
    console.log("foudnit");
  }

})();

export {};
