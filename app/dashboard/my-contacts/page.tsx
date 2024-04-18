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
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import {
  CompanyBox,
  getProfiles,
  Profiles,
  ProspectBox,
} from "@/app/dashboard/introductions/list/IntroTable";

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
        mode: "insensitive",
      },
    },
    take: itemsPerPage,
    skip: recordsToSkip,
  });
  let emails = contacts.reduce<string[]>((acc, contact) => {
    acc.push(contact.email);
    return acc;
  }, []);
  emails = [...new Set(emails)];
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);
  return (
    <>
      <h1 className={"text-2xl my-4"}>My Contacts</h1>
      <Search placeholder={"filter by email here"} />
      <Table>
        <TableCaption>Your Contacts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Stats</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => {
            const contactProfiles = getProfiles(
              contact.email,
              emailToProfile,
              companyUrlToProfile,
            );
            if (
              !contactProfiles.personProfile.linkedInUrl ||
              !contactProfiles.companyProfile.linkedInUrl
            ) {
              return <></>;
            }
            return (
              <ContactRow
                key={contact.id}
                contact={contact}
                contactProfiles={contactProfiles}
              />
            );
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
  contactProfiles: Profiles;
};
const ContactRow = (props: ContactProps) => {
  const { contact, contactProfiles } = props;
  const { personExp, personProfile, companyProfile } = contactProfiles;
  return (
    <>
      <TableRow key={contact.email}>
        <TableCell className={"p-2"}>
          <ProspectBox
            contact={contact}
            personProfile={personProfile}
            personExp={personExp}
          />
        </TableCell>
        <TableCell className={"p-2"}>
          <CompanyBox companyProfile={companyProfile} personExp={personExp} />
        </TableCell>
        <TableCell className={"p-2"}>
          <div className={"flex flex-col whitespace-nowrap"}>
            <div>Sent: {contact.sentCount}</div>
            <div>Received: {contact.receivedCount}</div>
            <div>Ratio: {contact.sentReceivedRatio / 100}</div>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};
