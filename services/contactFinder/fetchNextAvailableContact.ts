import { Contact, User } from "@prisma/client";
import prisma from "@/prismaClient";
import getContactIdsTouchedByUser from "@/services/contactFinder/getContactIdsTouchedByUser";
import getContactIdsTouchedRecently from "@/services/contactFinder/getContactIdsTouchedRecently";
import getFacilitatorIdsWhoAlreadyMadeIntros from "@/services/contactFinder/getFacilitatorIdsWhoAlreadyMadeIntros";
import getContactIdsOfOthersUsersKnownToThisUser from "@/services/contactFinder/getContactIdsOfOthersUsersKnownToThisUser";

const fetchNextAvailableContact = async (
  user: User,
): Promise<Contact | null> => {
  console.log("in fetchNextAvailableContact with: ", user.email);

  const contactIdsOfOthersUsersKnownToThisUser =
    await getContactIdsOfOthersUsersKnownToThisUser(user);
  const contactIdsTouchedByUser = await getContactIdsTouchedByUser(user);
  const contactIdsTouchedRecently = await getContactIdsTouchedRecently();
  const facilitatorIdsUsedRecently =
    await getFacilitatorIdsWhoAlreadyMadeIntros();

  const nextAvailableContact = await prisma.contact.findFirst({
    where: {
      id: {
        notIn: [
          ...contactIdsTouchedRecently,
          ...contactIdsTouchedByUser,
          ...contactIdsOfOthersUsersKnownToThisUser,
        ],
      },
      userId: {
        notIn: [...facilitatorIdsUsedRecently, user.id],
      },
      user: {
        agreedToAutoProspecting: true
      }
    },
  });
  console.log(
    "got nextAvailableContact for user: ",
    user.email,
    nextAvailableContact,
  );

  return nextAvailableContact;
};

export default fetchNextAvailableContact;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await fetchNextAvailableContact(user);
    console.log(ans);
  })();
}
