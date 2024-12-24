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
import prisma from "@/prismaClient";
import getMatchingProspectsFromPinecone from "@/services/llm/getMatchingProspectsFromPinecone";
import getMatchingProspectsFromLlm from "@/services/llm/getMatchingProspectsFromLlm";
import { auth } from "@/auth";
import { Session } from "next-auth";

type SampleProspectsMatchingIcpProps = {};

const SampleProspectsMatchingIcp = async (
  props: SampleProspectsMatchingIcpProps,
) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
    include: {
      accounts: true,
    },
  });
  const k = 1000;
  const pineconeMatchedEmails = user.icpDescription
    ? await getMatchingProspectsFromPinecone(user.icpDescription, k)
    : [];

  const batchSize =
    pineconeMatchedEmails.length > 100 ? 100 : pineconeMatchedEmails.length;
  // const llmMatchedEmails = []; // for dev testing
  const llmMatchedEmails = await getMatchingProspectsFromLlm(
    user.icpDescription!,
    pineconeMatchedEmails.slice(0, batchSize),
  );
  const prospects = await prisma.contact.findMany({
    where: {
      email: {
        in: llmMatchedEmails,
      },
    },
    take: 5,
  });

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
            <TableHead className={"hidden sm:table-cell w-1/2"}>Company</TableHead>
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
        <TableCell className={'hidden sm:table-cell'}>
          <CompanyBox companyProfile={companyProfile} personExp={personExp} />
        </TableCell>
      </TableRow>
    );
};

export default SampleProspectsMatchingIcp; /**/
