import prisma from "@/prismaClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Contact, Prisma, User } from "@prisma/client";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default async function Prospects() {
  const session = (await auth()) as Session;
  const sql = Prisma.sql`
      select distinct on (email) "Contact".*, U.email as "userEmail", U.image as "userImage"
      from "Contact"
               inner join public."User" U on U.id = "Contact"."userId"
      order by email ASC, "receivedCount" DESC;
  `;
  const prospects = await prisma.$queryRaw<(ContactWithUserInfo)[]>(sql);
  return (
    <>
      <h1 className={"text-2xl my-4"}>Prospects</h1>
      <Table>
        <TableCaption>Prospects</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Send Count</TableHead>
            <TableHead>Received Count</TableHead>
            <TableHead>Sent-Received Ratio</TableHead>
            <TableHead>Introducer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prospects.map((prospect) => {
            return <ProspectRow key={prospect.id} prospect={prospect} />;
          })}
        </TableBody>
      </Table>
    </>
  );
}

type ContactWithUserInfo = Contact & { userEmail: string, userImage: string}

type ProspectRowProps = {
  prospect: ContactWithUserInfo
};
const ProspectRow = (props: ProspectRowProps) => {
  const { prospect } = props;
  return (
    <>
      <TableRow key={prospect.email}>
        <TableCell>{prospect.email}</TableCell>
        <TableCell>{prospect.sentCount}</TableCell>
        <TableCell>{prospect.receivedCount}</TableCell>
        <TableCell>{prospect.sentReceivedRatio.toFixed(2)}</TableCell>
        <TableCell><Avatar>
          <AvatarImage src={prospect.userImage} title={prospect.userEmail} />
          {/*<AvatarFallback>X</AvatarFallback>*/}
        </Avatar></TableCell>
      </TableRow>
    </>
  );
};
