import prisma from "@/prismaClient";
import OpenAiQueue from "@/bull/queues/openAiQueue";

const addLlmDescriptionOnAll = async () => {

  // todo - we are working on person profile without ensuring that a contact for that exists
  const personProfiles = await prisma.personProfile.findMany({
    where: {
      llmDescription: null,
    },
  });
  for (const pp of personProfiles) {
    const jObj = await OpenAiQueue.add("addLlmDescriptionOnPersonProfile", pp);
    const { name, id } = jObj;
    console.log("scheduled addLlmDescriptionOnPersonProfile job", name, id, pp);
  }
};

export default addLlmDescriptionOnAll;
