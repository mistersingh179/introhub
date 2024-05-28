import { Contact, Prisma, User } from "@prisma/client";
import prisma from "@/prismaClient";

export type PaginatedValues = {
  currentPage: number;
  itemsPerPage: number;
  recordsToSkip: number;
};

export type SelectedFilterValues = {
  selectedCities?: string[] | undefined;
  selectedStates?: string[] | undefined;
  selectedJobTitles?: string[] | undefined;
  selectedIndustries?: string[] | undefined;
  selectedCategories?: string[] | undefined;
  selectedUserEmails?: string[] | undefined;
  selectedEmail?: string | undefined;
  selectedWebsite?: string | undefined;
  createdAfter?: string | undefined;
};

type ProspectsBasedOnFiltersResult = {
  prospects: Contact[];
  totalRecordsCount: number;
};

const getProspectsBasedOnFilters = async (
  filters: SelectedFilterValues,
  paginatedValues: PaginatedValues,
  user: User,
): Promise<ProspectsBasedOnFiltersResult> => {
  const {
    selectedCities,
    selectedStates,
    selectedJobTitles,
    selectedEmail,
    selectedWebsite,
    selectedIndustries,
    selectedCategories,
    selectedUserEmails,
    createdAfter,
  } = filters;

  const { recordsToSkip, currentPage, itemsPerPage } = paginatedValues;

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

  const createdAfterFilterSql = createdAfter
    ? Prisma.sql`and C."createdAt" >= ${new Date(createdAfter)}`
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
            ${websiteFilterSql} ${industryFilterSql} ${categoriesFilterSql} ${userEmailsFilterSql} \
            ${createdAfterFilterSql}
        and C."userId" != ${user.id}
      order by email ASC, "receivedCount" DESC
      offset ${recordsToSkip} limit ${itemsPerPage};
  `;

  console.log(sql.text, sql.values);

  const prospects = await prisma.$queryRaw<Contact[]>(sql);
  console.log("prospects found: ", prospects.length);

  const countSql = Prisma.sql`
      select count(distinct C.email)
      from "Contact" C
               inner join public."User" U on U.id = C."userId"
               inner join public."PersonProfile" PP on C.email = PP.email and PP."linkedInUrl" is not null
               inner join public."PersonExperience" PE on PP.id = PE."personProfileId"
               inner join public."CompanyProfile" CP on CP."linkedInUrl" = PE."companyLinkedInUrl"
               left join public."CompanyProfileCategory" CPC on CP.id = CPC."companyProfileId"
               left join public."Category" CAT on CPC."categoryId" = CAT.id
      where 1 = 1 ${cityFilterSql} ${stateFilterSql} ${jobTitleFilterSql} ${emailFilterSql} \
            ${websiteFilterSql} ${industryFilterSql} ${categoriesFilterSql} ${userEmailsFilterSql} \
            ${createdAfterFilterSql}
        and C."userId" != ${user.id}
  `;
  const countSqlResult = await prisma.$queryRaw<{ count: number }[]>(countSql);
  const totalRecordsCount = Number(countSqlResult[0].count);

  return { prospects, totalRecordsCount };
};

export default getProspectsBasedOnFilters;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow();
    const paginationValues: PaginatedValues = {
      currentPage: 1,
      itemsPerPage: 10,
      recordsToSkip: 0,
    };
    const d = new Date(2024, 4, 16);
    console.log(d.toISOString());
    const filters: SelectedFilterValues = {
      selectedStates: ["New York"],
    };

    const { prospects, totalRecordsCount } = await getProspectsBasedOnFilters(
      filters,
      paginationValues,
      user,
    );
    console.log("prospects: ", prospects);
    console.log("totalRecordsCount: ", totalRecordsCount);
    process.exit(0);
  })();
}
