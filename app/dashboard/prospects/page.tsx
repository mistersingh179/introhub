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
import { Contact, User } from "@prisma/client";

type ContactWithUser = Contact & {
  user: User;
};

export default async function Prospects() {
  const session = (await auth()) as Session;
  const contacts: ContactWithUser[] = await prisma.contact.findMany({
    where: {
      user: {
        email: session.user?.email || "",
      },
    },
    include: {
      user: true,
    },
    take: 10
  });
  return (
    <>
      <h1 className={"text-2xl my-4"}>Prospects</h1>
      <Table>
        <TableCaption>Your Contacts</TableCaption>
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
          {contacts.map((contact) => {
            return <ProspectRow contact={contact} />;
          })}
        </TableBody>
      </Table>
    </>
  );
}

type ProspectRowProps = {
  contact: ContactWithUser;
};
const ProspectRow = (props: ProspectRowProps) => {
  const { contact } = props;
  return (
    <>
      <TableRow key={contact.email}>
        <TableCell>{contact.email}</TableCell>
        <TableCell>{contact.sentCount}</TableCell>
        <TableCell>{contact.receivedCount}</TableCell>
        <TableCell>{contact.sentReceivedRatio.toFixed(2)}</TableCell>
        <TableCell>{contact.user.email}</TableCell>
      </TableRow>
    </>
  );
};
