import {Contact, Group, User} from "@prisma/client";
import prisma from "@/prismaClient";
import getContactEmailsTouchedByUser from "@/services/contactFinder/getContactEmailsTouchedByUser";
import getContactEmailsTouchedRecently from "@/services/contactFinder/getContactEmailsTouchedRecently";
import getFacilitatorIdsWhoAlreadyMadeIntros from "@/services/contactFinder/getFacilitatorIdsWhoAlreadyMadeIntros";
import getContactEmailsOfThisUser from "@/services/contactFinder/getContactEmailsOfThisUser";
import getFacilitatorIdsWhoAreMissingFullScope from "@/services/contactFinder/getFacilitatorIdsWhoAreMissingFullScope";
import getContactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts from "@/services/contactFinder/getContactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts";
import getFacilitatorIdsOfCompetitors from "@/services/contactFinder/getFacilitatorIdsOfCompetitors";
import {PlatformGroupName} from "@/app/utils/constants";

const fetchWantedContact = async (user: User, group: Group): Promise<Contact | null> => {
  const contactEmailsOfOthersUsersKnownToThisUser =
    await getContactEmailsOfThisUser(user);
  const contactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts =
    await getContactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts(user);
  const contactEmailsTouchedByUser = await getContactEmailsTouchedByUser(user);
  const contactEmailsTouchedRecently = await getContactEmailsTouchedRecently();
  const facilitatorIdsUsedRecently =
    await getFacilitatorIdsWhoAlreadyMadeIntros();
  const facilitatorIdsWhoAreMissingFullScope =
    await getFacilitatorIdsWhoAreMissingFullScope();
  const facilitatorIdsOfCompetitors = await getFacilitatorIdsOfCompetitors(user);

  const wantedContact = await prisma.contact.findFirst({
    where: {
      wantedBy: {
        some: {
          userId: user.id,
        },
      },
      email: {
        notIn: [
          ...contactEmailsTouchedRecently,
          ...contactEmailsTouchedByUser,
          ...contactEmailsOfOthersUsersKnownToThisUser,
          ...contactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts,
        ],
      },
      userId: {
        notIn: [
          ...facilitatorIdsUsedRecently,
          ...facilitatorIdsWhoAreMissingFullScope,
          ...facilitatorIdsOfCompetitors
        ],
      },
      user: {
        agreedToAutoProspecting: true,
        tokenIssue: false,
        memberships: {
          some: {
            group,
            approved: true,
          }
        }
      },
      available: true,
      emailCheckPassed: true,
    },
  });
  console.log("got wantedContact for user: ", user.email, wantedContact);
  return wantedContact;
};

export default fetchWantedContact;

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
    const ans = await fetchWantedContact(user, platfromGroup);
    console.log("ans: ", ans);
  })();
}
