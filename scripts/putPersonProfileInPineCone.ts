import prisma from "@/prismaClient";
import addPersonProfileToPineCone from "@/services/llm/addPersonProfileToPineCone";

(async () => {
  const personProfiles = await prisma.personProfile.findMany({
    where: {
      llmDescription: {
        not: null
      }
    }
  });
  for(const pp of personProfiles){
    console.log(pp);
    await addPersonProfileToPineCone(pp);
  }

})()