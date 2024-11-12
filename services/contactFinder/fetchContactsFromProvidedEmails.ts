import { Contact, User } from "@prisma/client";
import prisma from "@/prismaClient";
import getContactIdsTouchedByUser from "@/services/contactFinder/getContactIdsTouchedByUser";
import getContactIdsTouchedRecently from "@/services/contactFinder/getContactIdsTouchedRecently";
import getFacilitatorIdsWhoAlreadyMadeIntros from "@/services/contactFinder/getFacilitatorIdsWhoAlreadyMadeIntros";
import getContactIdsOfOthersUsersKnownToThisUser from "@/services/contactFinder/getContactIdsOfOthersUsersKnownToThisUser";
import getFacilitatorIdsWhoAreMissingFullScope from "@/services/contactFinder/getFacilitatorIdsWhoAreMissingFullScope";
import getContactIdsWhichHaveSameLinkedInUrlFromThisUsersContacts from "@/services/contactFinder/getContactIdsWhichHaveSameLinkedInUrlFromThisUsersContacts";
import getContactIdsWhichHaveSameLinkedInUrlAsThisUser from "@/services/contactFinder/getContactIdsWhichHaveSameLinkedInUrlAsThisUser";
import getFacilitatorIdsOfCompetitors from "@/services/contactFinder/getFacilitatorIdsOfCompetitors";

const fetchContactsFromProvidedEmails = async (
  user: User,
  emails: string[],
): Promise<Contact[]> => {
  const contactIdsOfOthersUsersKnownToThisUser =
    await getContactIdsOfOthersUsersKnownToThisUser(user);
  const contactIdsWhichHaveSameLinkedInUrlFromThisUsersContacts =
    await getContactIdsWhichHaveSameLinkedInUrlFromThisUsersContacts(user);
  const contactIdsWhichHaveSameLinkedInUrlAsThisUser =
    await getContactIdsWhichHaveSameLinkedInUrlAsThisUser(user);
  const contactIdsTouchedByUser = await getContactIdsTouchedByUser(user);
  const contactIdsTouchedRecently = await getContactIdsTouchedRecently();
  const facilitatorIdsUsedRecently =
    await getFacilitatorIdsWhoAlreadyMadeIntros();
  const facilitatorIdsWhoAreMissingFullScope =
    await getFacilitatorIdsWhoAreMissingFullScope();
  const facilitatorIdsOfCompetitors =
    await getFacilitatorIdsOfCompetitors(user);

  const contactsAvailable = await prisma.contact.findMany({
    where: {
      email: {
        in: emails,
      },
      id: {
        notIn: [
          ...contactIdsTouchedRecently,
          ...contactIdsTouchedByUser,
          ...contactIdsOfOthersUsersKnownToThisUser,
          ...contactIdsWhichHaveSameLinkedInUrlFromThisUsersContacts,
          ...contactIdsWhichHaveSameLinkedInUrlAsThisUser,
        ],
      },
      userId: {
        notIn: [
          ...facilitatorIdsUsedRecently,
          ...facilitatorIdsWhoAreMissingFullScope,
          user.id,
          ...facilitatorIdsOfCompetitors,
        ],
      },
      user: {
        agreedToAutoProspecting: true,
        tokenIssue: false,
      },
      available: true,
      emailCheckPassed: true,
    },
  });

  console.log("contactsAvailable: ", contactsAvailable.length);
  return contactsAvailable;
};

export default fetchContactsFromProvidedEmails;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const emails = (
      await prisma.contact.findMany({
        take: 100,
      })
    ).map((c) => c.email);

    const ans = await fetchContactsFromProvidedEmails(user, emails);
    console.log(ans);
  })();
}
