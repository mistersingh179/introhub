import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import getMyContacts from "@/services/queries/getMyContacts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Home() {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  const contacts = await getMyContacts(user);
  return (
    <>
      <pre className={"bg-yellow-50 my-4"}>
        {JSON.stringify(session, null, 2)}
      </pre>
      <h1 className={"text-4xl my-4"}>My Contacts</h1>
      <Table>
        <TableCaption>Your Contacts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={`${contact.address}-${contact.name}`}>
              <TableCell>{contact.name}</TableCell>
              <TableCell className={"font-semibold"}>
                {contact.address}
              </TableCell>
              <TableCell>{contact.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
