import prisma from "../prismaClient";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import type { Document } from "@langchain/core/documents";

const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  console.log("Starting repl!");

  const profiles = await prisma.personProfile.findMany({
    where: {
      llmDescription: {
        not: null,
      },
    },
    take: 10,
  });

  console.log("profiles: ", profiles.length);

  const embeddingsModel = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const pinecone = new PineconeClient();
  const indexname = process.env.PINECONE_INDEX!;

  console.log(await pinecone.describeIndex(indexname));
  console.log(await pinecone.Index(indexname).describeIndexStats());

  const vectorStore = new PineconeStore(embeddingsModel, {
    pineconeIndex: pinecone.index(indexname),
    namespace: "personProfile",
  });

  // const vectorStore = new MemoryVectorStore(embeddings);

  const documents: Document[] = profiles.map<Document>((p) => {
    return {
      metadata: {
        email: String(p.email),
      },
      pageContent: String(p.llmDescription),
    };
  });

  await vectorStore.addDocuments(documents, {
    ids: documents.map((d) => String(d.id)),
  });

  while (true) {
    const indexDescription = await pinecone.describeIndex(indexname);
    console.log(indexDescription);
    if (indexDescription.status.ready) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  const ans = await embeddingsModel.embedDocuments([
    "manager large company outside of USA",
  ]);
  console.log(ans);

  const query = "manager large company outside of USA";

  const vector = await embeddingsModel.embedDocuments([query]);
  console.log(await vectorStore.similaritySearchVectorWithScore(vector[0], 1));

  console.log(await vectorStore.similaritySearchWithScore(query, 1));
})();

export {};
