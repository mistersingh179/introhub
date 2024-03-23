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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Search from "@/components/Search";
import MyPagination from "@/components/MyPagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {SquarePen} from "lucide-react";

export default async function Prospects({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || undefined;
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 10;
  const recordsToSkip = (currentPage - 1) * itemsPerPage;

  console.log("search params query: ", query, "currentPage: ", currentPage);

  const session = (await auth()) as Session;

  const emailTermWithWild = query ? "%" + query + "%" : null;
  const filterSql = emailTermWithWild
    ? Prisma.sql`and "Contact".email like ${emailTermWithWild}`
    : Prisma.sql``;

  const sql = Prisma.sql`
      select distinct on (email) "Contact".*, U.email as "userEmail", U.image as "userImage"
      from "Contact"
               inner join public."User" U on U.id = "Contact"."userId"
      where 1=1 ${filterSql}
      order by email ASC, "receivedCount" DESC
      offset ${recordsToSkip} limit ${itemsPerPage};
  `;
  // console.log(sql.text, sql.values);
  const prospects = await prisma.$queryRaw<ContactWithUserInfo[]>(sql);
  return (
    <>
      <h1 className={"text-2xl my-4"}>Prospects</h1>
      <Search placeholder={"filter by email here"} />
      <Table>
        <TableCaption>Prospects</TableCaption>
        <TableHeader>
          <TableRow>
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
            <TableCell colSpan={6}>
              <MyPagination />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

type ContactWithUserInfo = Contact & { userEmail: string; userImage: string };

type ProspectRowProps = {
  prospect: ContactWithUserInfo;
};
const ProspectRow = (props: ProspectRowProps) => {
  const { prospect } = props;
  return (
    <>
      <TableRow key={prospect.email}>
        <TableCell className={"p-2"}>{prospect.email}</TableCell>
        <TableCell className={"p-2"}>{prospect.sentCount}</TableCell>
        <TableCell className={"p-2"}>{prospect.receivedCount}</TableCell>
        <TableCell className={"p-2"}>
          {prospect.sentReceivedRatio/100}
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
