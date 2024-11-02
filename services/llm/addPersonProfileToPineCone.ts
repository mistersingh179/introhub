import { PersonProfile } from "@prisma/client";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone/dist/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import prisma from "@/prismaClient";

const addPersonProfileToPineCone = async (personProfile: PersonProfile) => {
  personProfile = await prisma.personProfile.findFirstOrThrow({
    where: {
      id: personProfile.id,
      llmDescription: {
        not: null,
      },
    },
  });

  const pinecone = new PineconeClient();
  const indexname = process.env.PINECONE_INDEX!;

  const embeddingsModel = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const vectorStore = new PineconeStore(embeddingsModel, {
    pineconeIndex: pinecone.index(indexname),
    namespace: "personProfile",
  });

  const addingResult = await vectorStore.addDocuments(
    [
      {
        metadata: {
          email: personProfile.email,
        },
        pageContent: personProfile.llmDescription!,
      },
    ],
    {
      ids: [personProfile.email],
    },
  );

  console.log(addingResult);
};

export default addPersonProfileToPineCone;

if (require.main === module) {
  (async () => {
    const pp = await prisma.personProfile.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
        llmDescription: {
          not: null,
        },
      },
    });
    await addPersonProfileToPineCone(pp);
  })();
}
