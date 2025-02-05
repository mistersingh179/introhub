import { Contact, Group, User } from "@prisma/client";
import prisma from "@/prismaClient";
import fetchWantedContact from "@/services/contactFinder/fetchWantedContact";
import fetchContactUsingIcp from "@/services/contactFinder/fetchContactUsingIcp";
import {PlatformGroupName} from "@/app/utils/constants";

const findBestContactForIntro = async (
  user: User,
  group: Group,
): Promise<Contact | null> => {
  console.log("in findBestProspectForIntro for user: ", user.email);

  const fetchContactFunctions = [fetchContactUsingIcp];

  for (const fetchContact of fetchContactFunctions) {
    const contact = await fetchContact(user, group);
    if (contact) {
      console.log("found best prospect for: ", user.email, contact);
      return contact;
    }
  }

  console.log("unable to find any prospect for user: ", user.email);
  return null;
};
export default findBestContactForIntro;

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
      },
    });
    await findBestContactForIntro(user, platfromGroup);
  })();
}
