import prisma from "../prismaClient";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone/dist/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  console.log("in repl!")

})();

export {};
