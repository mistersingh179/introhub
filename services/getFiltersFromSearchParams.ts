import { ProspectsSearchParams } from "@/app/dashboard/prospects/page";
import { SelectedFilterValues } from "@/services/getProspectsBasedOnFilters";
import querystring from "querystring";

const getValueAsArray = (
  param: string | string[] | null | undefined,
): string[] | undefined => {
  if (!param) {
    return undefined;
  } else if (Array.isArray(param)) {
    return param;
  } else {
    return [param];
  }
};

export type GetFiltersFromSearchParams = (
  searchParams: ProspectsSearchParams | undefined | string,
) => SelectedFilterValues;

const getFiltersFromSearchParams: GetFiltersFromSearchParams = (
  searchParams,
) => {
  if (typeof searchParams === "string") {
    searchParams = querystring.parse(searchParams);
  }

  const selectedCities = getValueAsArray(searchParams?.selectedCities);
  const selectedStates = getValueAsArray(searchParams?.selectedStates);
  const selectedJobTitles = getValueAsArray(searchParams?.selectedJobTitles);
  const selectedIndustries = getValueAsArray(searchParams?.selectedIndustries);
  const selectedGroups = getValueAsArray(searchParams?.selectedGroups);
  const selectedCategories = getValueAsArray(searchParams?.selectedCategories);
  const selectedUserEmails = getValueAsArray(searchParams?.selectedUserEmails);
  const selectedEmail = searchParams?.selectedEmail;
  const selectedWebsite = searchParams?.selectedWebsite;
  const sizeFrom = searchParams?.sizeFrom;
  const sizeTo = searchParams?.sizeTo;
  const createdAfter = searchParams?.createdAfter;

  const result = {
    selectedCities,
    selectedStates,
    selectedJobTitles,
    selectedIndustries,
    selectedGroups,
    selectedCategories,
    selectedEmail,
    selectedWebsite,
    selectedUserEmails,
    createdAfter,
    sizeFrom,
    sizeTo
  };

  console.log("getFiltersFromSearchParams: ", result);
  return result;
};

export default getFiltersFromSearchParams;
