import { Contact, User } from "@prisma/client";
import prisma from "@/prismaClient";
import getContactIdsTouchedByUser from "@/services/contactFinder/getContactIdsTouchedByUser";
import getContactIdsTouchedRecently from "@/services/contactFinder/getContactIdsTouchedRecently";
import getFacilitatorIdsWhoAlreadyMadeIntros from "@/services/contactFinder/getFacilitatorIdsWhoAlreadyMadeIntros";
import getContactIdsOfOthersUsersKnownToThisUser from "@/services/contactFinder/getContactIdsOfOthersUsersKnownToThisUser";

const fetchWantedContact = async (user: User): Promise<Contact | null> => {
  const contactIdsOfOthersUsersKnownToThisUser =
    await getContactIdsOfOthersUsersKnownToThisUser(user);
  const contactIdsTouchedByUser = await getContactIdsTouchedByUser(user);
  const contactIdsTouchedRecently = await getContactIdsTouchedRecently();
  const facilitatorIdsUsedRecently =
    await getFacilitatorIdsWhoAlreadyMadeIntros();

  const wantedContact = await prisma.contact.findFirst({
    where: {
      wantedBy: {
        some: {
          userId: user.id,
        },
      },
      id: {
        notIn: [
          ...contactIdsTouchedRecently,
          ...contactIdsTouchedByUser,
          ...contactIdsOfOthersUsersKnownToThisUser,
        ],
      },
      userId: {
        notIn: facilitatorIdsUsedRecently,
      },
    },
  });
  console.log("got wantedContact for user: ", user.email, wantedContact);
  return wantedContact;
};

export default fetchWantedContact;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await fetchWantedContact(user);
    console.log("ans: ", ans);
  })();
}
