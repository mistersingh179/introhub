import { Contact, User } from "@prisma/client";
import prisma from "@/prismaClient";
import getContactIdsTouchedByUser from "@/services/contactFinder/getContactIdsTouchedByUser";
import getContactIdsTouchedRecently from "@/services/contactFinder/getContactIdsTouchedRecently";
import getFacilitatorIdsWhoAlreadyMadeIntros from "@/services/contactFinder/getFacilitatorIdsWhoAlreadyMadeIntros";
import getFiltersFromSearchParams from "@/services/getFiltersFromSearchParams";
import getProspectsBasedOnFilters, {
  PaginatedValues,
} from "@/services/getProspectsBasedOnFilters";

const fetchContactFromUserFilters = async (
  user: User,
): Promise<Contact | null> => {
  const contactIdsTouchedByUser = await getContactIdsTouchedByUser(user);
  const contactIdsTouchedRecently = await getContactIdsTouchedRecently();
  const facilitatorIdsUsedRecently =
    await getFacilitatorIdsWhoAlreadyMadeIntros();

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

    const contactFromFilter = await prisma.contact.findFirst({
      where: {
        id: {
          in: contactIdsFromUserFilter,
          notIn: [...contactIdsTouchedRecently, ...contactIdsTouchedByUser],
        },
        userId: {
          notIn: facilitatorIdsUsedRecently,
        },
      },
    });

    if (contactFromFilter) {
      console.log("got contactFromFilter: ", contactFromFilter);
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
