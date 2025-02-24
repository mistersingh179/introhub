import { PersonProfile } from "@prisma/client";
import getPersonDescription from "@/services/llm/getPersonDescription";
import prisma from "@/prismaClient";
import addPersonProfileToPineCone from "@/services/llm/addPersonProfileToPineCone";
import addContactToPineCone from "@/services/llm/addContactToPineCone";

const addLlmDescriptionOnPersonProfile = async (
  personProfile: PersonProfile,
) => {
  if (personProfile.llmDescription) {
    console.log("bailing as we already have llm description");
    return;
  }

  const llmDescription = await getPersonDescription(personProfile);
  if (llmDescription) {
    personProfile = await prisma.personProfile.update({
      where: { email: personProfile.email },
      data: { llmDescription },
    });

    await addPersonProfileToPineCone(personProfile);

    const contacts = await prisma.contact.findMany({
      where: {
        email: personProfile.email
      }
    });
    for(const contact of contacts){
      await addContactToPineCone(contact)
    }

  }
};

export default addLlmDescriptionOnPersonProfile;

if (require.main === module) {
  (async () => {
    const pp = await prisma.personProfile.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    await addLlmDescriptionOnPersonProfile(pp);
  })();
}
