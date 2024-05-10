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

type ProspectsSearchParams = {
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

type GetSelectedFilterValues = (
  searchParams: ProspectsSearchParams | undefined,
) => {
  selectedCities: string[] | undefined;
  selectedStates: string[] | undefined;
  selectedJobTitles: string[] | undefined;
  selectedIndustries: string[] | undefined;
  selectedCategories: string[] | undefined;
  selectedUserEmails: string[] | undefined;
  selectedEmail: string | undefined;
  selectedWebsite: string | undefined;
};

const getSelectedFilterValues: GetSelectedFilterValues = (searchParams) => {
  const selectedCities = getValueAsArray(searchParams?.selectedCities);
  const selectedStates = getValueAsArray(searchParams?.selectedStates);
  const selectedJobTitles = getValueAsArray(searchParams?.selectedJobTitles);
  const selectedIndustries = getValueAsArray(searchParams?.selectedIndustries);
  const selectedCategories = getValueAsArray(searchParams?.selectedCategories);
  const selectedUserEmails = getValueAsArray(searchParams?.selectedUserEmails);
  const selectedEmail = searchParams?.selectedEmail;
  const selectedWebsite = searchParams?.selectedWebsite;

  const result = {
    selectedCities,
    selectedStates,
    selectedJobTitles,
    selectedIndustries,
    selectedCategories,
    selectedEmail,
    selectedWebsite,
    selectedUserEmails,
  };

  console.log("selected: ", result);
  return result;
};

type GetPaginationValues = (
  searchParams: ProspectsSearchParams | undefined,
) => {
  currentPage: number;
  itemsPerPage: number;
  recordsToSkip: number;
};

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
    _count: true,
  });
  const cities = citiesWithCount
    .filter((rec) => rec.city)
    .map((rec) => rec.city as string);

  const statesWithCount = await prisma.personProfile.groupBy({
    by: "state",
    _count: true,
  });
  const states = statesWithCount
    .filter((rec) => rec.state)
    .map((rec) => rec.state as string);

  const jobTitlesWithCount = await prisma.personExperience.groupBy({
    by: "jobTitle",
    _count: {
      jobTitle: true,
    },
    orderBy: {
      _count: {
        jobTitle: 'desc'
      }
    }
  });
  const uniqueJobTitles = new Map<string, null>();
  jobTitlesWithCount.forEach(rec => {
    const trimmedTitle = rec.jobTitle?.trim();
    if (trimmedTitle && trimmedTitle !== "") {
      uniqueJobTitles.set(trimmedTitle, null);
    }
  });
  const jobTitles = [...uniqueJobTitles.keys()]

  const industriesWithCount = await prisma.companyProfile.groupBy({
    by: "industry",
    _count: true,
  });
  const industries = industriesWithCount
    .filter((rec) => rec.industry)
    .map((rec) => rec.industry as string);

  const categoriesWithCount = await prisma.category.groupBy({
    by: "name",
    _count: true,
  });
  const categories = categoriesWithCount
    .filter((rec) => rec.name)
    .map((rec) => rec.name as string);

  const usersWithCount = await prisma.user.groupBy({
    by: "email",
    where: {
      email: {
        not: user.email,
      },
    },
    _count: true,
  });
  const userEmails = usersWithCount
    .filter((rec) => rec.email)
    .map((rec) => rec.email as string);

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

  const { recordsToSkip, currentPage, itemsPerPage } =
    getPaginationValues(searchParams);

  const {
    selectedCities,
    selectedStates,
    selectedJobTitles,
    selectedEmail,
    selectedWebsite,
    selectedIndustries,
    selectedCategories,
    selectedUserEmails,
  } = getSelectedFilterValues(searchParams);

  const cityFilterSql = selectedCities
    ? Prisma.sql`and PP.city in (${Prisma.join(selectedCities)})`
    : Prisma.sql``;

  const stateFilterSql = selectedStates
    ? Prisma.sql`and PP.state in (${Prisma.join(selectedStates)})`
    : Prisma.sql``;

  const jobTitleFilterSql = selectedJobTitles
    ? Prisma.sql`and PE."jobTitle" ~* ${"\\y(" + selectedJobTitles.join("|") + ")\\y"}`
    : Prisma.sql``;

  const industryFilterSql = selectedIndustries
    ? Prisma.sql`and CP."industry" in (${Prisma.join(selectedIndustries)})`
    : Prisma.sql``;

  const categoriesFilterSql = selectedCategories
    ? Prisma.sql`and CAT."name" in (${Prisma.join(selectedCategories)})`
    : Prisma.sql``;

  const userEmailsFilterSql = selectedUserEmails
    ? Prisma.sql`and U."email" in (${Prisma.join(selectedUserEmails)})`
    : Prisma.sql``;

  const emailFilterSql = selectedEmail
    ? Prisma.sql`and C.email ilike ${"%" + selectedEmail + "%"}`
    : Prisma.sql``;

  const websiteFilterSql = selectedWebsite
    ? Prisma.sql`and C.email ilike ${"%" + selectedWebsite + "%"}`
    : Prisma.sql``;

  const sql = Prisma.sql`
      select distinct on (C.email) C.*
      from "Contact" C
               inner join public."User" U on U.id = C."userId"
               inner join public."PersonProfile" PP on C.email = PP.email and PP."linkedInUrl" is not null
               inner join public."PersonExperience" PE on PP.id = PE."personProfileId"
               inner join public."CompanyProfile" CP on CP."linkedInUrl" = PE."companyLinkedInUrl"
               left join public."CompanyProfileCategory" CPC on CP.id = CPC."companyProfileId"
               left join public."Category" CAT on CPC."categoryId" = CAT.id
      where 1 = 1 ${cityFilterSql} ${stateFilterSql} ${jobTitleFilterSql} ${emailFilterSql} \
            ${websiteFilterSql} ${industryFilterSql} ${categoriesFilterSql} ${userEmailsFilterSql}
        and C."userId" != ${user.id}
      order by email ASC, "receivedCount" DESC
      offset ${recordsToSkip} limit ${itemsPerPage};
  `;

  console.log(sql.text, sql.values);

  const prospects = await prisma.$queryRaw<Contact[]>(sql);

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
        <h1 className={"text-2xl my-4"}>Prospects</h1>
      </div>

      <div className={"flex flex-col md:flex-row gap-4 items-start"}>
        <div className={"w-full md:basis-1/4 mt-2 border p-4"}>
          <Collapsible defaultOpen={true}>
            <div className={"flex flex-row justify-between items-center"}>
              <h1>Filters</h1>
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
            prospects={prospectsWithUser}
            emailToProfile={emailToProfile}
            companyUrlToProfile={companyUrlToProfile}
          />
        </div>
      </div>
    </>
  );
}
