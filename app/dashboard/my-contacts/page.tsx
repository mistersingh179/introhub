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
import MyPagination from "@/components/MyPagination";
import Search from "@/components/Search";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import {
  CompanyBox,
  Profiles,
  ProspectBox,
} from "@/app/dashboard/introductions/list/IntroTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import getProfiles from "@/services/getProfiles";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import ContactAvailableForm from "@/app/dashboard/my-contacts/ContactAvailableForm";
import {Badge} from "@/components/ui/badge";

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

  const emailFilterSql = query
    ? Prisma.sql`and C.email ilike ${"%" + query + "%"}`
    : Prisma.sql``;

  const sql = Prisma.sql`
  select distinct on (C.email) C.* from "Contact" C
                    inner join public."User" U on U.id = C."userId"
                    inner join public."PersonProfile" PP on C.email = PP.email and PP."linkedInUrl" is not null
                    inner join public."PersonExperience" PE on PP.id = PE."personProfileId"
                    inner join public."CompanyProfile" CP on CP."linkedInUrl" = PE."companyLinkedInUrl"
  where U.email=${session.user?.email ?? ""} ${emailFilterSql}
  order by email ASC, "receivedCount" DESC
  offset ${recordsToSkip} limit ${itemsPerPage};`;

  console.log(sql.text, sql.values);
  const contacts = await prisma.$queryRaw<Contact[]>(sql);

  console.log("contacts: ", contacts);

  let emails = contacts.reduce<string[]>((acc, contact) => {
    acc.push(contact.email);
    return acc;
  }, []);
  emails = [...new Set(emails)];
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);
  return (
    <>
      <div className={"flex flex-row gap-8 items-center"}>
        <h1 className={"text-2xl my-4"}>My Contacts</h1>
        <Button asChild className={"max-w-96"}>
          <Link href={`/dashboard/my-contacts/create`}>
            Manually Add Contact
            <UserPlus size={18} className={"ml-2"} />
          </Link>
        </Button>
      </div>
      <Search placeholder={"filter by email here"} />
      <Table>
        <TableCaption>Your Contacts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className={'w-2/3'}>Contact</TableHead>
            <TableHead className={'w-1/3'}>Make Available</TableHead>
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
              !contactProfiles.personProfile?.linkedInUrl ||
              !contactProfiles.companyProfile?.linkedInUrl
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
            <TableCell colSpan={2}>
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
          <div className={'flex flex-col gap-4'}>
          <ProspectBox
            contact={contact}
            personProfile={personProfile}
            personExp={personExp}
          />
          <CompanyBox companyProfile={companyProfile} personExp={personExp} />
          </div>
        </TableCell>
        <TableCell className={"p-2"}>
          <ContactAvailableForm contact={contact} />
        </TableCell>
      </TableRow>
    </>
  );
};
