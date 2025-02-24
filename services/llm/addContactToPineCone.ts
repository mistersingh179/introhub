import { Contact } from "@prisma/client";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone/dist/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import prisma from "@/prismaClient";

const addContactToPineCone = async (contact: Contact) => {
  console.log("In addContactToPineCone with: ", contact);

  const personProfile = await prisma.personProfile.findFirst({
    where: {
      email: contact.email,
      llmDescription: {
        not: null,
      },
    },
  });

  if (!personProfile?.llmDescription) {
    console.log("bailing addContactToPineCone as no llmDescription available");
    return;
  }

  const pinecone = new PineconeClient();
  const indexname = process.env.PINECONE_INDEX!;

  const embeddingsModel = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const vectorStore = new PineconeStore(embeddingsModel, {
    pineconeIndex: pinecone.index(indexname),
    namespace: "contacts",
  });

  const addingResult = await vectorStore.addDocuments(
    [
      {
        metadata: {
          email: contact.email,
          userId: contact.userId,
        },
        pageContent: personProfile.llmDescription,
      },
    ],
    {
      ids: [contact.id],
    },
  );

  console.log(addingResult);
};

export default addContactToPineCone;

if (require.main === module) {
  (async () => {
    const contact = await prisma.contact.findFirstOrThrow({
      where: {
        user: {
          email: "sandeep@introhub.net",
        },
      },
    });
    await addContactToPineCone(contact);
  })();
}
