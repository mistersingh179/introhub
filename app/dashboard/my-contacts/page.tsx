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
import { Contact } from "@prisma/client";
import MyPagination from "@/components/MyPagination";
import Search from "@/components/Search";

export default async function MyContacts({
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

  const session = (await auth()) as Session;
  const contacts: Contact[] = await prisma.contact.findMany({
    where: {
      user: {
        email: session.user?.email || "",
      },
      email: {
        contains: query,
        mode: "insensitive"
      },
    },
    take: itemsPerPage,
    skip: recordsToSkip,
  });
  return (
    <>
      <h1 className={"text-2xl my-4"}>My Contacts</h1>
      <Search placeholder={"filter by email here"} />
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
            return <ContactRow key={contact.id} contact={contact} />;
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>
              <MyPagination />
            </TableCell>
          </TableRow>
        </TableFooter>
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
        <TableCell className={"p-2"}>{contact.email}</TableCell>
        <TableCell className={"p-2"}>{contact.sentCount}</TableCell>
        <TableCell className={"p-2"}>{contact.receivedCount}</TableCell>
        <TableCell className={"p-2"}>
          {contact.sentReceivedRatio / 100}
        </TableCell>
      </TableRow>
    </>
  );
};
