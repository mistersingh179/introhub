import * as React from "react";

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
import MyPagination from "@/components/MyPagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import {
  CompanyBox,
  getProfiles,
  ProspectBox,
} from "@/app/dashboard/introductions/list/IntroTable";
import {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import { ContactWithUser } from "@/app/dashboard/introductions/create/[contactId]/page";
import FacilitatorBox from "@/components/FacilitatorBox";

const ProspectsTable = ({
  prospectsWithUser,
  emailToProfile,
  companyUrlToProfile,
  filteredRecordsCount,
}: {
  prospectsWithUser: ContactWithUser[];
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
  filteredRecordsCount: number;
}) => {
  return (
    <Table>
      <TableCaption>Prospects</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className={"w-1/2"}>Prospect</TableHead>
          <TableHead className={"w-1/2"}>Introducer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prospectsWithUser.map((prospect) => {
          return (
            <ProspectRow
              key={prospect.id}
              prospect={prospect}
              emailToProfile={emailToProfile}
              companyUrlToProfile={companyUrlToProfile}
            />
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>
            <MyPagination totalCount={filteredRecordsCount} />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

type ProspectRowProps = {
  prospect: ContactWithUser;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
};
export const ProspectRow = (props: ProspectRowProps) => {
  const { prospect, emailToProfile, companyUrlToProfile } = props;
  const contactProfiles = getProfiles(
    prospect.email,
    emailToProfile,
    companyUrlToProfile,
  );
  const facilitatorProfiles = getProfiles(
    prospect.user.email!,
    emailToProfile,
    companyUrlToProfile,
  );

  return (
    <>
      <TableRow key={prospect.email}>
        <TableCell className={""}>
          <div className={"flex flex-col gap-4 overflow-hidden"}>
            <ProspectBox
              contact={prospect}
              personProfile={contactProfiles.personProfile}
              personExp={contactProfiles.personExp}
            />
            <CompanyBox
              companyProfile={contactProfiles.companyProfile}
              personExp={contactProfiles.personExp}
            />
          </div>
        </TableCell>
        <TableCell className={""}>
          <div className={"flex flex-col gap-4"}>
            <FacilitatorBox
              user={prospect.user}
              personExp={facilitatorProfiles.personExp}
            />
            <div className={"flex flex-col whitespace-nowrap"}>
              <div>Sent: {prospect.sentCount}</div>
              <div>Received: {prospect.receivedCount}</div>
              <div>Ratio: {prospect.sentReceivedRatio / 100}</div>
            </div>
            <Button asChild className={"w-fit"}>
              <Link href={`/dashboard/introductions/create/${prospect.id}`}>
                Create Intro
                <SquarePen size={18} className={"ml-2"} />
              </Link>
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ProspectsTable;
