import prisma from "@/prismaClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Contact, Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MyPagination from "@/components/MyPagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SquarePen } from "lucide-react";
import { buildS3ImageUrl } from "@/lib/url";
import FiltersForm from "@/app/dashboard/prospects/FiltersForm";

type ProspectsSearchParams = {
  query?: string;
  selectedCities?: string | string[];
  selectedStates?: string | string[];
  selectedJobTitles?: string | string[];
  selectedIndustries?: string | string[];
  selectedEmail?: string;
  page?: string | string[];
};

type ContactWithUserInfo = Contact & {
  userEmail: string;
  userImage: string;
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
  selectedEmail: string | undefined;
};

const getSelectedFilterValues: GetSelectedFilterValues = (searchParams) => {
  const selectedCities = getValueAsArray(searchParams?.selectedCities);
  const selectedStates = getValueAsArray(searchParams?.selectedStates);
  const selectedJobTitles = getValueAsArray(searchParams?.selectedJobTitles);
  const selectedIndustries = getValueAsArray(searchParams?.selectedIndustries);
  const selectedEmail = searchParams?.selectedEmail;

  const result = {
    selectedCities,
    selectedStates,
    selectedJobTitles,
    selectedIndustries,
    selectedEmail,
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
  return { currentPage, itemsPerPage, recordsToSkip };
};

// todo - we need indexes on things being filtered on

type GetAllFilterValues = () => Promise<{
  cities: string[];
  states: string[];
  jobTitles: string[];
  industries: string[];
}>;

const getAllFilterValues: GetAllFilterValues = async () => {
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
    _count: true,
  });
  const jobTitles = jobTitlesWithCount
    .filter((rec) => rec.jobTitle)
    .map((rec) => rec.jobTitle as string);

  const industriesWithCount = await prisma.companyProfile.groupBy({
    by: "industry",
    _count: true,
  });
  const industries = industriesWithCount
    .filter((rec) => rec.industry)
    .map((rec) => rec.industry as string);

  console.log("all filter values: ", cities, states, jobTitles, industries);

  return { cities, states, jobTitles, industries };
};

export default async function Prospects({
  searchParams,
}: {
  searchParams?: ProspectsSearchParams;
}) {
  const session = (await auth()) as Session;
  console.log("*** searchParams ***: ", searchParams);

  const { cities, states, jobTitles, industries } = await getAllFilterValues();

  const { recordsToSkip, currentPage, itemsPerPage } =
    getPaginationValues(searchParams);

  const {
    selectedCities,
    selectedStates,
    selectedJobTitles,
    selectedEmail,
    selectedIndustries,
  } = getSelectedFilterValues(searchParams);

  const cityFilterSql = selectedCities
    ? Prisma.sql`and PP.city in (${Prisma.join(selectedCities)})`
    : Prisma.sql``;

  const stateFilterSql = selectedStates
    ? Prisma.sql`and PP.state in (${Prisma.join(selectedStates)})`
    : Prisma.sql``;

  const jobTitleFilterSql = selectedJobTitles
    ? Prisma.sql`and PE."jobTitle" in (${Prisma.join(selectedJobTitles)})`
    : Prisma.sql``;

  const industryFilterSql = selectedIndustries
    ? Prisma.sql`and CP."industry" in (${Prisma.join(selectedIndustries)})`
    : Prisma.sql``;

  const selectedCategories = ["analytics", "foo", "bar"];
  const categoriesFilterSql = selectedCategories
    ? Prisma.sql`and CAT."name" in (${Prisma.join(selectedCategories)})`
    : Prisma.sql``;

  const emailFilterSql = selectedEmail
    ? Prisma.sql`and C.email like ${"%" + selectedEmail + "%"}`
    : Prisma.sql``;

  const sql = Prisma.sql`
      select distinct on (C.email) C.*, U.email as "userEmail", U.image as "userImage", CP.website as website
      from "Contact" C
               inner join public."User" U on U.id = C."userId"
               left join public."PersonProfile" PP on C.email = PP.email
               left join public."PersonExperience" PE on PP.id = PE."personProfileId"
               left join public."CompanyProfile" CP on CP."linkedInUrl" = PE."companyLinkedInUrl"
               left join public."CompanyProfileCategory" CPC on CP.id = CPC."companyProfileId"
               left join public."Category" CAT on CPC."categoryId" = CAT.id
      where 1 = 1 ${cityFilterSql} ${stateFilterSql} ${jobTitleFilterSql} ${emailFilterSql} ${industryFilterSql} ${categoriesFilterSql}
      order by email ASC, "receivedCount" DESC
      offset ${recordsToSkip} limit ${itemsPerPage};
  `;

  console.log(sql.text, sql.values);

  const prospects = await prisma.$queryRaw<ContactWithUserInfo[]>(sql);

  return (
    <>
      <h1 className={"text-2xl my-4"}>Prospects</h1>
      <FiltersForm
        cities={cities}
        states={states}
        jobTitles={jobTitles}
        industries={industries}
      />
      <Table>
        <TableCaption>Prospects</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Send Count</TableHead>
            <TableHead>Received Count</TableHead>
            <TableHead>Sent-Received Ratio</TableHead>
            <TableHead>Introducer</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prospects.map((prospect) => {
            return <ProspectRow key={prospect.id} prospect={prospect} />;
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>
              <MyPagination />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

type ProspectRowProps = {
  prospect: ContactWithUserInfo;
};
const ProspectRow = (props: ProspectRowProps) => {
  const { prospect } = props;
  return (
    <>
      <TableRow key={prospect.email}>
        <TableCell className={"p-2"}>
          <Avatar className={"h-8 w-8"}>
            <AvatarImage
              src={buildS3ImageUrl(prospect.website)}
              title={prospect.website}
            />
            <AvatarFallback>{"W"}</AvatarFallback>
          </Avatar>
        </TableCell>
        <TableCell className={"p-2"}>
          <Avatar className={"h-8 w-8"}>
            <AvatarImage
              src={buildS3ImageUrl(prospect.email)}
              title={prospect.email}
            />
            <AvatarFallback>{"E"}</AvatarFallback>
          </Avatar>
        </TableCell>
        <TableCell className={"p-2"}>
          <Link
            href={`/dashboard/prospects/${prospect.id}/`}
            className={"hover:underline"}
          >
            {prospect.email}
          </Link>
        </TableCell>
        <TableCell className={"p-2"}>{prospect.sentCount}</TableCell>
        <TableCell className={"p-2"}>{prospect.receivedCount}</TableCell>
        <TableCell className={"p-2"}>
          {prospect.sentReceivedRatio / 100}
        </TableCell>
        <TableCell className={"p-2"}>
          <Avatar className={"h-8 w-8"}>
            <AvatarImage src={prospect.userImage} title={prospect.userEmail} />
            {/*<AvatarFallback>X</AvatarFallback>*/}
          </Avatar>
        </TableCell>
        <TableCell className={"p-2"}>
          <Button asChild>
            <Link href={`/dashboard/introductions/create/${prospect.id}`}>
              Create Introduction
              <SquarePen size={18} className={"ml-2"} />
            </Link>
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};
