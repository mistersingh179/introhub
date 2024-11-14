import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as React from "react";
import getEmailAndCompanyUrlProfiles, {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import { Contact } from "@prisma/client";
import getProfiles from "@/services/getProfiles";
import {
  CompanyBox,
  ProspectBox,
} from "@/app/dashboard/introductions/list/IntroTable";

type SampleProspectsMatchingIcpProps = {
  prospects: Contact[];
};

const SampleProspectsMatchingIcp = async (
  props: SampleProspectsMatchingIcpProps,
) => {
  const { prospects } = props;

  const emails = prospects.map((p) => p.email);

  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  return (
    <div>
      <div className={"text-2xl my-6"}>Sample Prospects</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={"w-1/2"}>Prospect</TableHead>
            <TableHead className={"w-1/2"}>Company</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prospects.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className={"text-center"}>
                No Sample Prospects Found :-(
              </TableCell>
            </TableRow>
          )}
          {prospects.map((p) => (
            <Row
              key={p.email}
              prospect={p}
              emailToProfile={emailToProfile}
              companyUrlToProfile={companyUrlToProfile}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

type RowProps = {
  prospect: Contact;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
};

const Row = (props: RowProps) => {
  const { prospect, emailToProfile, companyUrlToProfile } = props;
  const contactProfiles = getProfiles(
    prospect.email,
    emailToProfile,
    companyUrlToProfile,
  );
  const { personExp, personProfile, companyProfile } = contactProfiles;
  const { fullName, linkedInUrl } = personProfile;
  if (!fullName || !linkedInUrl) {
    return <></>;
  }
  if (personProfile)
    return (
      <TableRow>
        <TableCell>
          <ProspectBox
            contact={prospect}
            personProfile={personProfile}
            personExp={personExp}
            showLinkedInUrls={true}
          ></ProspectBox>
        </TableCell>
        <TableCell>
          <CompanyBox companyProfile={companyProfile} personExp={personExp} />
        </TableCell>
      </TableRow>
    );
};

export default SampleProspectsMatchingIcp; /**/
