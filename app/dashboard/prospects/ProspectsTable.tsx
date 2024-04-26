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
  prospects,
  emailToProfile,
  companyUrlToProfile,
}: {
  prospects: ContactWithUser[];
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
}) => {
  return (
    <Table>
      <TableCaption>Prospects</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Prospect</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Introducer</TableHead>
          <TableHead>Stats</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prospects.map((prospect) => {
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
          <TableCell colSpan={8}>
            <MyPagination />
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
const ProspectRow = (props: ProspectRowProps) => {
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
          <ProspectBox
            contact={prospect}
            personProfile={contactProfiles.personProfile}
            personExp={contactProfiles.personExp}
          />
        </TableCell>
        <TableCell className={""}>
          <CompanyBox
            companyProfile={contactProfiles.companyProfile}
            personExp={contactProfiles.personExp}
          />
        </TableCell>
        <TableCell className={""}>
          <FacilitatorBox
            user={prospect.user}
            personExp={facilitatorProfiles.personExp}
          />
        </TableCell>
        <TableCell className={""}>
          <div className={"flex flex-col whitespace-nowrap"}>
            <div>Sent: {prospect.sentCount}</div>
            <div>Received: {prospect.receivedCount}</div>
            <div>Ratio: {prospect.sentReceivedRatio / 100}</div>
          </div>
        </TableCell>
        <TableCell className={""}>
          <Button asChild>
            <Link href={`/dashboard/introductions/create/${prospect.id}`}>
              Create Intro
              <SquarePen size={18} className={"ml-2"} />
            </Link>
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ProspectsTable;
