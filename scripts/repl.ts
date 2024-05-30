import prisma from "../prismaClient";
import numeral from "numeral";
import getFiltersFromSearchParams from "@/services/getFiltersFromSearchParams";
import querystring from "querystring";
import getProspectsBasedOnFilters, {PaginatedValues} from "@/services/getProspectsBasedOnFilters";

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

  const searchParamsString =
    "page=1&selectedCities=Hicksville&selectedCities=Denver&selectedStates=New+York&selectedStates=Colorado&selectedStates=Washington&selectedJobTitles=Co-founder&selectedJobTitles=Co-founder+%26+CEO&selectedJobTitles=Entrepreneur+In+Residence&selectedJobTitles=Chief+Technology+Officer&selectedJobTitles=Chief+Executive+Officer&createdAfter=2024-04-01T04%3A00%3A00.000Z";

  const filters = getFiltersFromSearchParams(searchParamsString);

  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: "clwrwfkm00000w98m2jfyc4k6"
    }
  });
  const paginationValues: PaginatedValues = {
    currentPage: 1,
    itemsPerPage: 10,
    recordsToSkip: 0,
  };
  const {prospects, filteredRecordsCount} = await getProspectsBasedOnFilters(filters, paginationValues, user);
  console.log(prospects);

})();

export {};
