import prisma from "@/prismaClient";
import { auth } from "@/auth";
import { Session } from "next-auth";

import { Contact, Prisma, User } from "@prisma/client";
import FiltersForm from "@/app/dashboard/prospects/FiltersForm";
import sleep from "@/lib/sleep";

import ProspectsTable from "@/app/dashboard/prospects/ProspectsTable";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import { ContactWithUser } from "@/app/dashboard/introductions/create/[contactId]/page";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import getUniqueValuesWithOrderPreserved from "@/services/getUniqueValuesWithOrderPreserved";
import getProspectsBasedOnFilters, {
  PaginatedValues,
  SelectedFilterValues,
} from "@/services/getProspectsBasedOnFilters";

export type ProspectsSearchParams = {
  query?: string;
  selectedCities?: string | string[];
  selectedStates?: string | string[];
  selectedJobTitles?: string | string[];
  selectedIndustries?: string | string[];
  selectedCategories?: string | string[];
  selectedUserEmails?: string | string[];
  selectedEmail?: string;
  selectedWebsite?: string;
  page?: string | string[];
  createdAfter?: string;
};

export type ContactWithUserInfo = Contact & {
  userEmail: string;
  userImage: string;
  userName: string;
  website: string;
};

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

export type GetSelectedFilterValues = (
  searchParams: ProspectsSearchParams | undefined,
) => SelectedFilterValues;

const getSelectedFilterValues: GetSelectedFilterValues = (searchParams) => {
  const selectedCities = getValueAsArray(searchParams?.selectedCities);
  const selectedStates = getValueAsArray(searchParams?.selectedStates);
  const selectedJobTitles = getValueAsArray(searchParams?.selectedJobTitles);
  const selectedIndustries = getValueAsArray(searchParams?.selectedIndustries);
  const selectedCategories = getValueAsArray(searchParams?.selectedCategories);
  const selectedUserEmails = getValueAsArray(searchParams?.selectedUserEmails);
  const selectedEmail = searchParams?.selectedEmail;
  const selectedWebsite = searchParams?.selectedWebsite;
  const createdAfter = searchParams?.createdAfter;

  const result = {
    selectedCities,
    selectedStates,
    selectedJobTitles,
    selectedIndustries,
    selectedCategories,
    selectedEmail,
    selectedWebsite,
    selectedUserEmails,
    createdAfter,
  };

  console.log("selected: ", result);
  return result;
};

type GetPaginationValues = (
  searchParams: ProspectsSearchParams | undefined,
) => PaginatedValues;

const getPaginationValues: GetPaginationValues = (searchParams) => {
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 10;
  const recordsToSkip = (currentPage - 1) * itemsPerPage;

  const result = { currentPage, itemsPerPage, recordsToSkip };

  console.log("paginated values: ", result);
  return result;
};

type GetAllFilterValues = (user: User) => Promise<{
  cities: string[];
  states: string[];
  jobTitles: string[];
  industries: string[];
  categories: string[];
  userEmails: string[];
}>;

const getAllFilterValues: GetAllFilterValues = async (user) => {
  const citiesWithCount = await prisma.personProfile.groupBy({
    by: "city",
    _count: {
      city: true,
    },
    orderBy: {
      _count: {
        city: "desc",
      },
    },
  });
  const cities = getUniqueValuesWithOrderPreserved(citiesWithCount, "city");

  const statesWithCount = await prisma.personProfile.groupBy({
    by: "state",
    _count: {
      state: true,
    },
    orderBy: {
      _count: {
        state: "desc",
      },
    },
  });
  const states = getUniqueValuesWithOrderPreserved(statesWithCount, "state");

  const jobTitlesWithCount = await prisma.personExperience.groupBy({
    by: "jobTitle",
    _count: {
      jobTitle: true,
    },
    orderBy: {
      _count: {
        jobTitle: "desc",
      },
    },
  });
  const jobTitles = getUniqueValuesWithOrderPreserved(
    jobTitlesWithCount,
    "jobTitle",
  );

  const industriesWithCount = await prisma.companyProfile.groupBy({
    by: "industry",
    _count: {
      industry: true,
    },
    orderBy: {
      _count: {
        industry: "desc",
      },
    },
  });
  const industries = getUniqueValuesWithOrderPreserved(
    industriesWithCount,
    "industry",
  );

  const categoriesWithCount = await prisma.category.groupBy({
    by: "name",
    _count: {
      name: true,
    },
    orderBy: {
      _count: {
        name: "desc",
      },
    },
  });
  const categories = getUniqueValuesWithOrderPreserved(
    categoriesWithCount,
    "name",
  );

  const usersWithCount = await prisma.user.groupBy({
    by: "email",
    where: {
      email: {
        not: user.email,
      },
    },
    _count: {
      email: true,
    },
    orderBy: {
      _count: {
        email: "desc",
      },
    },
  });
  const userEmails = getUniqueValuesWithOrderPreserved(usersWithCount, "email");
  console.log("userEmails.length: ", userEmails.length);

  const result = {
    cities,
    states,
    jobTitles,
    industries,
    categories,
    userEmails,
  };

  return result;
};

export default async function Prospects({
  searchParams,
}: {
  searchParams?: ProspectsSearchParams;
}) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  // await sleep(500);
  console.log("*** searchParams ***: ", searchParams);

  const { cities, states, jobTitles, industries, categories, userEmails } =
    await getAllFilterValues(user);

  const paginationValues: PaginatedValues = getPaginationValues(searchParams);
  const filters: SelectedFilterValues = getSelectedFilterValues(searchParams);
  const { prospects, totalRecordsCount } = await getProspectsBasedOnFilters(
    filters,
    paginationValues,
    user,
  );

  const userIds = [...new Set(prospects.map((p) => p.userId))];
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });
  const usersIdHash = users.reduce<Record<string, User>>((acc, cv) => {
    acc[cv.id] = cv;
    return acc;
  }, {});
  const prospectsWithUser = prospects.reduce<ContactWithUser[]>((acc, cv) => {
    const p = {
      ...cv,
      user: usersIdHash[cv.userId],
    };
    acc.push(p);
    return acc;
  }, []);

  let emails = prospectsWithUser.reduce<string[]>((acc, prospect) => {
    acc.push(prospect.email);
    acc.push(prospect.user.email!);
    return acc;
  }, []);
  emails = [...new Set(emails)];
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  // console.log("*** prospectsWithUser: ", prospectsWithUser);

  return (
    <>
      <div className={"flex flex-row justify-start items-center gap-4"}>
        <h1 className={"text-2xl my-4"}>Prospects – {totalRecordsCount}</h1>
      </div>

      <div className={"flex flex-col md:flex-row gap-4 items-start"}>
        <div className={"w-full md:basis-1/4 mt-2 border p-4"}>
          <Collapsible defaultOpen={true}>
            <div className={"flex flex-row justify-between items-center"}>
              <h1>Filters</h1>
              {/*<div className="text-sm text-muted-foreground">*/}
              {/*  15 possible Results*/}
              {/*</div>*/}
              <CollapsibleTrigger asChild className={"md:hidden"}>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <FiltersForm
                cities={cities}
                states={states}
                jobTitles={jobTitles}
                industries={industries}
                categories={categories}
                userEmails={userEmails}
              />
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className={"w-full"}>
          <ProspectsTable
            prospectsWithUser={prospectsWithUser}
            emailToProfile={emailToProfile}
            companyUrlToProfile={companyUrlToProfile}
          />
        </div>
      </div>
    </>
  );
}
