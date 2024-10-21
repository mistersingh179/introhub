import prisma from "../prismaClient";
import OpenAI from "openai";
import * as tf from "@tensorflow/tfjs";
import { Contact, Food, Prisma } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";
import refreshAccessToken from "@/services/helpers/refreshAccessToken";
const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  console.log("Starting repl!");

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: "sandeep@introhub.net",
    },
    include: {
      accounts: true,
    },
  });

  console.log("accounts: ", user.accounts.length);
  let account = user.accounts[0];
  console.log(account.scope);

  const gmail = await getGmailObject(account);

  const labels = await gmail.users.labels.list({
    userId: 'me'
  });

  console.log(labels.data.labels);

  // const creationResponse = await gmail.users.labels.create({
  //   userId: 'me',
  //   requestBody: {
  //     name: 'IH5',
  //     // messageListVisibility: 'hide',
  //     // labelListVisibility: 'labelHide',
  //   }
  // });
  //
  // console.log(creationResponse);

})();

export {};
