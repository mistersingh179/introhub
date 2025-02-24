import { Contact, User } from "@prisma/client";
import prisma from "@/prismaClient";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone/dist/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

const findContactsOnUser = async (
  user: User,
  searchTerm: string,
): Promise<Contact[]> => {
  console.log("In findContactsOnUser with: ", user, searchTerm);

  const pinecone = new PineconeClient();
  const indexname = process.env.PINECONE_INDEX!;

  const embeddingsModel = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const vectorStore = new PineconeStore(embeddingsModel, {
    pineconeIndex: pinecone.index(indexname),
    namespace: "contacts",
  });

  const vectorMatchedContacts = await vectorStore.similaritySearchWithScore(
    searchTerm,
    10,
    {
      userId: {
        $eq: user.id,
      },
    },
  );

  const contactIds = vectorMatchedContacts
    .map((x) => x[0].id)
    .filter((x) => x !== undefined) as string[];

  console.log("matching contactIds: ", contactIds)

  const contacts = await prisma.contact.findMany({
    where: {
      id: {
        in: contactIds,
      },
    },
  });

  console.log(contacts);

  return contacts;
};

export default findContactsOnUser;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    await findContactsOnUser(user, "a good person");
  })();
}
