import prisma from "@/prismaClient";
import getProspectsBasedOnFilters, {
  PaginatedValues,
  SelectedFilterValues,
} from "@/services/getProspectsBasedOnFilters";
import { startOfToday } from "date-fns";

const getProspectsCreatedToday = async () => {
  const user = await prisma.user.findFirstOrThrow();
  const nonExistentUser = { ...user, id: "-1" };

  const filters: SelectedFilterValues = {
    createdAfter: startOfToday().toISOString(),
  };
  const paginationValues: PaginatedValues = {
    currentPage: 1,
    itemsPerPage: Number.MAX_SAFE_INTEGER,
    recordsToSkip: 0,
  };
  const prospects = await getProspectsBasedOnFilters(
    filters,
    paginationValues,
    nonExistentUser,
  );
  console.log("prospects: ", prospects);
};

export default getProspectsCreatedToday;

if (require.main === module) {
  (async () => {
    const prospects = await getProspectsCreatedToday();
    console.log("prospects: ", prospects);
    process.exit(0);
  })();
}
