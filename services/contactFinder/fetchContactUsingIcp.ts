import {Contact, Group, User} from "@prisma/client";
import prisma from "@/prismaClient";
import getMatchingProspectsFromPinecone from "@/services/llm/getMatchingProspectsFromPinecone";
import getMatchingProspectsFromLlm from "@/services/llm/getMatchingProspectsFromLlm";
import fetchContactsFromProvidedEmails from "@/services/contactFinder/fetchContactsFromProvidedEmails";
import {PlatformGroupName} from "@/app/utils/constants";

const fetchContactUsingIcp = async (user: User, group: Group): Promise<Contact | null> => {
  if (!user.icpDescription) {
    return null;
  }

  // Step 1: Get ICP matching prospects from Pinecone
  // todo - should also take group and give only contact emails which are from a user in that group
  const pineconeMatchedEmails = await getMatchingProspectsFromPinecone(
    user.icpDescription,
    1000,
  );
  if (pineconeMatchedEmails.length === 0) {
    return null;
  }

  // Step 2: Get available prospects from DB while using pinecone matching prospects
  const contactsAvailable = await fetchContactsFromProvidedEmails(
    user,
    pineconeMatchedEmails,
    group
  );
  if (contactsAvailable.length === 0) {
    return null;
  }

  // Step 3: order contacts based on order from pinecone
  const contactsAvailableMap = new Map(
    contactsAvailable.map((contact) => [contact.email, contact]),
  );
  const contactsAvailableSorted = pineconeMatchedEmails
    .map((email) => contactsAvailableMap.get(email))
    .filter(Boolean) as Contact[];

  const sortedAvailableEmails = contactsAvailableSorted.map((c) => c.email);
  console.log("sortedAvailableEmails: ", sortedAvailableEmails);

  // Step 4. from LLM get best matching contact
  const batchSize = 25;
  for (let i = 0; i < sortedAvailableEmails.length; i += batchSize) {
    console.log("in batched llm loop with starting point of: ", i);
    const emailsBatch = sortedAvailableEmails.slice(i, i + batchSize);
    const llmMatchingProsectsEmails = await getMatchingProspectsFromLlm(
      user.icpDescription,
      emailsBatch,
    );
    console.log("llmMatchingProsectsEmails: ", llmMatchingProsectsEmails);
    if (llmMatchingProsectsEmails.length === 0) {
      console.log("nothing matched with llm");
      continue;
    }
    const llmMatchingProspect = await prisma.contact.findFirst({
      where: {
        email: llmMatchingProsectsEmails[0],
      },
    });
    if (llmMatchingProspect) {
      return llmMatchingProspect;
    }
  }

  return null;
};

export default fetchContactUsingIcp;

if (require.main === module) {
  (async () => {
    const platfromGroup = await prisma.group.findFirstOrThrow({
      where: {
        name: PlatformGroupName
      }
    })
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
        // email: "mistersingh179@gmail.com",
      },
    });
    const ans = await fetchContactUsingIcp(user, platfromGroup);
    console.log("ans: ", ans);
  })();
}
