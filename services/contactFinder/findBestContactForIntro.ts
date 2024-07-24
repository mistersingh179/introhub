import { Contact, User } from "@prisma/client";
import prisma from "@/prismaClient";
import fetchWantedContact from "@/services/contactFinder/fetchWantedContact";
import fetchContactFromUserFilters from "@/services/contactFinder/fetchContactFromUserFilters";
import fetchNextAvailableContact from "@/services/contactFinder/fetchNextAvailableContact";

const findBestContactForIntro = async (user: User): Promise<Contact | null> => {
  console.log("in findBestProspectForIntro with: ", user);

  const fetchContactFunctions = [
    fetchWantedContact,
    fetchContactFromUserFilters,
    fetchNextAvailableContact,
  ];

  for (const fetchContact of fetchContactFunctions) {
    const contact = await fetchContact(user);
    if (contact) {
      console.log("found best prospect: ", user, contact);
      return contact;
    }
  }

  console.log("unable to find any prospect for user: ", user);
  return null;
};
export default findBestContactForIntro;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    await findBestContactForIntro(user);
  })();
}
