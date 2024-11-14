import prisma from "../prismaClient";
import OpenAI from "openai";
import { Contact, Food, Prisma } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";
import refreshAccessToken from "@/services/helpers/refreshAccessToken";
import { getHeaderValue, parseEmail } from "@/services/downloadMetaData";
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

  const threadId = "192916901f415ae3";

  const threads = await gmail.users.threads.get({
    userId: "me",
    id: threadId,
  });

  for (const message of threads.data.messages ?? []) {
    console.log("message: ", message);
    const headers = message.payload?.headers;
    const body = message.payload?.body;
    if (!headers || !body) {
      console.log("skipping message as no headers/body: ", headers, body);
      continue;
    }
    console.log(
      "body: ",
      Buffer.from(body.data ?? "", "base64").toString("utf-8"),
    );
    const fromObj = parseEmail(getHeaderValue(headers, "From"));
    console.log("fromObj: ", fromObj);
    // console.log(message.payload?.parts);
    for (const part of message.payload?.parts ?? []) {
      console.log(
        part.mimeType,
        Buffer.from(part.body?.data ?? "", "base64").toString("utf-8"),
      );
    }
  }
})();

export {};
