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
import reservedEmailAddressesList from "reserved-email-addresses-list";

// @ts-ignore
import roleBasedEmailAddressesListTemp from "role-based-email-addresses";
const roleBasedEmailAddressesList = roleBasedEmailAddressesListTemp as string[];

const reservedEmails = new Map(
  reservedEmailAddressesList.map((key) => [key, key]),
);

const roleEmails = new Map(
  roleBasedEmailAddressesList.map((key) => [key, key]),
);

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
          {contacts.map((contact) => {
            const emailSuffix = contact.address.split("@")[0];
            let emailIsNoGood = reservedEmails.has(emailSuffix);
            if (emailIsNoGood == false) {
              emailIsNoGood = roleEmails.has(emailSuffix);
            }
            if (emailIsNoGood == false) {
              emailIsNoGood = new Map([
                ["weekly", "weekly"],
                ["customeradvocate", "customeradvocate"],
                ["maccount", "maccount"],
              ]).has(emailSuffix);
            }
            if (emailIsNoGood == false) {
              emailIsNoGood = ["+", "noreply", "no-reply", "support"].some((x) =>
                emailSuffix.includes(x),
              );
            }
            return (
              <TableRow
                key={`${contact.address}-${contact.name}`}
                className={`${emailIsNoGood ? "bg-gray-500" : "bg-green-200"}`}
              >
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.address}</TableCell>
                <TableCell>{contact.count}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
