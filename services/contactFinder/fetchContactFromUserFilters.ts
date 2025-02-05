import { Contact, User } from "@prisma/client";
import prisma from "@/prismaClient";
import getContactEmailsTouchedByUser from "@/services/contactFinder/getContactEmailsTouchedByUser";
import getContactEmailsTouchedRecently from "@/services/contactFinder/getContactEmailsTouchedRecently";
import getFacilitatorIdsWhoAlreadyMadeIntros from "@/services/contactFinder/getFacilitatorIdsWhoAlreadyMadeIntros";
import getFiltersFromSearchParams from "@/services/getFiltersFromSearchParams";
import getProspectsBasedOnFilters, {
  PaginatedValues,
} from "@/services/getProspectsBasedOnFilters";
import getContactEmailsOfThisUser from "@/services/contactFinder/getContactEmailsOfThisUser";
import getFacilitatorIdsWhoAreMissingFullScope from "@/services/contactFinder/getFacilitatorIdsWhoAreMissingFullScope";
import getContactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts
  from "@/services/contactFinder/getContactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts";

const fetchContactFromUserFilters = async (
  user: User,
): Promise<Contact | null> => {
  const contactEmailsOfThisUser =
    await getContactEmailsOfThisUser(user);
  const contactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts =
    await getContactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts(user);
  const contactEmailsTouchedByUser = await getContactEmailsTouchedByUser(user);
  const contactEmailsTouchedRecently = await getContactEmailsTouchedRecently();
  const facilitatorIdsUsedRecently =
    await getFacilitatorIdsWhoAlreadyMadeIntros();
  const facilitatorIdsWhoAreMissingFullScope =
    await getFacilitatorIdsWhoAreMissingFullScope();

  const filters = await prisma.filters.findMany({
    where: {
      userId: user.id,
    },
  });

  for (const filtersObj of filters) {
    console.log("using filter: ", filtersObj.name);
    const searchParamsObj = getFiltersFromSearchParams(filtersObj.searchParams);
    const paginationValues: PaginatedValues = {
      currentPage: 1,
      itemsPerPage: Number.MAX_SAFE_INTEGER,
      recordsToSkip: 0,
    };
    const { prospects } = await getProspectsBasedOnFilters(
      searchParamsObj,
      paginationValues,
      user,
    );
    console.log("got back prospects count: ", prospects.length);

    const contactIdsFromUserFilter = prospects.map((p) => p.id);

    const emailsToNotTake = [
      ...new Set([
        ...contactEmailsTouchedRecently,
        ...contactEmailsTouchedByUser,
        ...contactEmailsOfThisUser,
        ...contactEmailsWhichHaveSameLinkedInUrlFromThisUsersContacts,
      ]),
    ];

    const contactFromFilter = await prisma.contact.findFirst({
      where: {
        email: {
          notIn: emailsToNotTake
        },
        id: {
          in: contactIdsFromUserFilter,
        },
        userId: {
          notIn: [
            ...facilitatorIdsUsedRecently,
            ...facilitatorIdsWhoAreMissingFullScope,
          ],
        },
        user: {
          agreedToAutoProspecting: true,
          tokenIssue: false,
        },
        available: true,
        emailCheckPassed: true
      },
    });

    if (contactFromFilter) {
      console.log("got contactFromFilter: ", contactFromFilter.email);
      return contactFromFilter;
    }
  }

  console.log("got contactFromFilter NULL");
  return null;
};

export default fetchContactFromUserFilters;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await fetchContactFromUserFilters(user);
    console.log(ans);
  })();
}
