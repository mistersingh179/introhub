import prisma from "@/prismaClient";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone/dist/pinecone";
import { PineconeStore } from "@langchain/pinecone";

const getMatchingProspectsFromPinecone = async (
  icpDescription: string,
  k: number = 100,
  minScore: number = 0.25,
): Promise<string[]> => {
  console.log("in getMatchingProspectsFromPinecone with: ", icpDescription, k);

  const embeddingsModel = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const pinecone = new PineconeClient();
  const indexname = process.env.PINECONE_INDEX!;

  const vectorStore = new PineconeStore(embeddingsModel, {
    pineconeIndex: pinecone.index(indexname),
    namespace: "personProfile",
  });

  const vectorMatchedProspects = await vectorStore.similaritySearchWithScore(
    icpDescription,
    k,
  );

  console.log("vectorMatchedProspects: ", vectorMatchedProspects.length);

  const emails: string[] = vectorMatchedProspects
    .filter((item) => item[1] >= minScore)
    .map((item) => String(item[0].id));

  console.log("vectored matched emails: ", emails.length);
  return emails;
};

export default getMatchingProspectsFromPinecone;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
        icpDescription: {
          not: null,
        },
      },
    });
    

    const ans = await getMatchingProspectsFromPinecone(user.icpDescription!, 1000);
    console.log("ans: ", ans);
  })();
}
