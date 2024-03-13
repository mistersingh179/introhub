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
import { Contact } from "@prisma/client";

export default async function MyContacts() {
  const session = (await auth()) as Session;
  const contacts: Contact[] = await prisma.contact.findMany({
    where: {
      user: {
        email: session.user?.email || "",
      },
    },
    take: 10
  });
  return (
    <>
      <h1 className={"text-2xl my-4"}>My Contacts</h1>
      <Table>
        <TableCaption>Your Contacts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Send Count</TableHead>
            <TableHead>Received Count</TableHead>
            <TableHead>Sent-Received Ratio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => {
            return (
              <ContactRow key={contact.id} contact={contact} />
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}

type ContactProps = {
  contact: Contact;
};
const ContactRow = (props: ContactProps) => {
  const { contact } = props;
  return (
    <>
      <TableRow key={contact.email}>
        <TableCell>{contact.email}</TableCell>
        <TableCell>{contact.sentCount}</TableCell>
        <TableCell>{contact.receivedCount}</TableCell>
        <TableCell>{contact.sentReceivedRatio.toFixed(2)}</TableCell>
      </TableRow>
    </>
  );
};
