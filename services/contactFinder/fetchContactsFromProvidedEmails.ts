import { Contact, Group, User } from "@prisma/client";
import prisma from "@/prismaClient";
import getContactEmailsTouchedByUser from "@/services/contactFinder/getContactEmailsTouchedByUser";
import getContactEmailsTouchedRecently from "@/services/contactFinder/getContactEmailsTouchedRecently";
import getFacilitatorIdsWhoAlreadyMadeIntros from "@/services/contactFinder/getFacilitatorIdsWhoAlreadyMadeIntros";
import getContactEmailsOfThisUser from "@/services/contactFinder/getContactEmailsOfThisUser";
import getFacilitatorIdsWhoAreMissingFullScope from "@/services/contactFinder/getFacilitatorIdsWhoAreMissingFullScope";
import getContactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts from "@/services/contactFinder/getContactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts";
import getContactEmailsWhichHaveSameLinkedInUrlAsThisUser from "@/services/contactFinder/getContactEmailsWhichHaveSameLinkedInUrlAsThisUser";
import getFacilitatorIdsOfCompetitors from "@/services/contactFinder/getFacilitatorIdsOfCompetitors";
import { PlatformGroupName } from "@/app/utils/constants";

const fetchContactsFromProvidedEmails = async (
  user: User,
  emails: string[],
  group: Group,
): Promise<Contact[]> => {
  const contactEmailsOfThisUser = await getContactEmailsOfThisUser(user);
  const contactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts =
    await getContactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts(user);
  const contactEmailsWhichHaveSameLinkedInUrlAsThisUser =
    await getContactEmailsWhichHaveSameLinkedInUrlAsThisUser(user);
  const contactEmailsTouchedByUser = await getContactEmailsTouchedByUser(user);
  const contactEmailsTouchedRecently = await getContactEmailsTouchedRecently();
  const facilitatorIdsUsedRecently =
    await getFacilitatorIdsWhoAlreadyMadeIntros();
  const facilitatorIdsWhoAreMissingFullScope =
    await getFacilitatorIdsWhoAreMissingFullScope();
  const facilitatorIdsOfCompetitors =
    await getFacilitatorIdsOfCompetitors(user);

  const emailsToNotTake = [
    ...new Set([
      ...contactEmailsTouchedRecently,
      ...contactEmailsTouchedByUser,
      ...contactEmailsOfThisUser,
      ...contactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts,
      ...contactEmailsWhichHaveSameLinkedInUrlAsThisUser,
    ]),
  ];

  const contactsAvailable = await prisma.contact.findMany({
    where: {
      email: {
        in: emails,
        notIn: emailsToNotTake,
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
        memberships: {
          some: {
            group: {
              id: group.id
            },
            approved: true,
          },
        },
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
    const emails = (
      await prisma.contact.findMany({
        take: 100,
      })
    ).map((c) => c.email);

    const ans = await fetchContactsFromProvidedEmails(user, emails, platfromGroup);
    console.log(ans);
  })();
}
