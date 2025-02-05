import { Contact, User } from "@prisma/client";
import prisma from "@/prismaClient";
import getContactEmailsTouchedByUser from "@/services/contactFinder/getContactEmailsTouchedByUser";
import getContactEmailsTouchedRecently from "@/services/contactFinder/getContactEmailsTouchedRecently";
import getFacilitatorIdsWhoAlreadyMadeIntros from "@/services/contactFinder/getFacilitatorIdsWhoAlreadyMadeIntros";
import getContactEmailsOfThisUser from "@/services/contactFinder/getContactEmailsOfThisUser";
import getFacilitatorIdsWhoAreMissingFullScope from "@/services/contactFinder/getFacilitatorIdsWhoAreMissingFullScope";

const fetchNextAvailableContact = async (
  user: User,
): Promise<Contact | null> => {
  console.log("in fetchNextAvailableContact with: ", user.email);

  const contactEmailsOfOthersUsersKnownToThisUser =
    await getContactEmailsOfThisUser(user);
  const contactEmailsTouchedByUser = await getContactEmailsTouchedByUser(user);
  const contactEmailsTouchedRecently = await getContactEmailsTouchedRecently();
  const facilitatorIdsUsedRecently =
    await getFacilitatorIdsWhoAlreadyMadeIntros();
  const facilitatorIdsWhoAreMissingFullScope =
    await getFacilitatorIdsWhoAreMissingFullScope();

  const nextAvailableContact = await prisma.contact.findFirst({
    where: {
      email: {
        notIn: [
          ...contactEmailsTouchedRecently,
          ...contactEmailsTouchedByUser,
          ...contactEmailsOfOthersUsersKnownToThisUser,
        ],
      },
      userId: {
        notIn: [
          ...facilitatorIdsUsedRecently,
          user.id,
          ...facilitatorIdsWhoAreMissingFullScope,
        ],
      },
      user: {
        agreedToAutoProspecting: true,
      },
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
