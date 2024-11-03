import prisma from "../prismaClient";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { RunnableSequence } from "@langchain/core/runnables";

const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  console.log("Starting repl!");

  const personJsonObject = {
    name: "foo",
    age: 40,
    profession: "software developer",
  };

  const chatTemplate = ChatPromptTemplate.fromMessages([
    new SystemMessage("You are a comedian."),
    HumanMessagePromptTemplate.fromTemplate(
      "Given the persons attributes below, tell me a joke. \n\n" +
        "personJsonObject: {personJsonObject}",
    ),
  ]);

  const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });
  const parser = new StringOutputParser();

  const secondChatTemplate = ChatPromptTemplate.fromMessages([
    new SystemMessage("You are a comedy show judge."),
    HumanMessagePromptTemplate.fromTemplate(
      "Given the persons attributes below and joke, tell me if it is a good joke or not \n\n" +
        "personJsonObject: {personJsonObject}, joke: {joke}",
    ),
  ]);

  const chain1 = chatTemplate.pipe(model).pipe(parser);
  const chain2 = secondChatTemplate.pipe(model).pipe(parser);

  const chain = RunnableSequence.from([
    {
      personJsonObject: (input) => input.personJsonObjectperson,
      joke: chain1,
    },
    chain2,
  ]);

  console.log(await chain.invoke({ personJsonObject }));
})();

export {};
