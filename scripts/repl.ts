import prisma from "../prismaClient";
import getFiltersFromSearchParams from "@/services/getFiltersFromSearchParams";
import getProspectsBasedOnFilters, {
  PaginatedValues,
} from "@/services/getProspectsBasedOnFilters";
import { startOfToday, subDays } from "date-fns";
import prepareProspectsData from "@/services/prepareProspectsData";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {
  console.log("Hello world !");

  const filtersObj = await prisma.filters.findFirstOrThrow({
    where: {
      dailyEmail: true,
    },
  });
  console.log("filtersObj: ", filtersObj);
  const searchParamsObj = getFiltersFromSearchParams(filtersObj.searchParams);
  searchParamsObj.createdAfter = subDays(startOfToday(), 1).toISOString();
  console.log("searchParamsObj: ", searchParamsObj);
  const user = await prisma.user.findFirstOrThrow();
  user.id = "does-not-exist";
  const paginationValues: PaginatedValues = {
    currentPage: 1,
    itemsPerPage: 10,
    recordsToSkip: 0,
  };
  const { prospects, filteredRecordsCount } = await getProspectsBasedOnFilters(
    searchParamsObj,
    paginationValues,
    user,
  );
  const { prospectsWithUser, emailToProfile, companyUrlToProfile } =
    await prepareProspectsData(prospects);

  console.log("prospects: ", prospects);
})();

export {};
