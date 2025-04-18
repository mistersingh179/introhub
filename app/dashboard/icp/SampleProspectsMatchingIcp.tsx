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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  
  let pineconeMatchedEmails: string[] = [];
  let llmMatchedEmails: string[] = [];
  let prospects: Contact[] = [];
  let hasError = false;
  
  try {
    const k = 1000;
    pineconeMatchedEmails = user.icpDescription
      ? await getMatchingProspectsFromPinecone(user.icpDescription, k)
      : [];

    const batchSize =
      pineconeMatchedEmails.length > 100 ? 100 : pineconeMatchedEmails.length;
      
    llmMatchedEmails = await getMatchingProspectsFromLlm(
      user.icpDescription!,
      pineconeMatchedEmails.slice(0, batchSize),
    );
    
    prospects = await prisma.contact.findMany({
      where: {
        email: {
          in: llmMatchedEmails,
        },
      },
      take: 5,
    });
  } catch (err) {
    console.error("Error fetching prospects:", err);
    hasError = true;
  }

  // If we hit an error or have no prospects, show placeholder prospects instead
  if (hasError || prospects.length === 0) {
    // For development/demo purposes, fetch some random prospects to show
    prospects = await prisma.contact.findMany({
      take: 5,
      orderBy: {
        id: "desc",
      },
    });
  }

  const emails = prospects.map((p) => p.email);
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  return (
    <div>
      <div className={"text-2xl my-6"}>Sample Prospects</div>
      
      {hasError && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Configuration Missing</AlertTitle>
          <AlertDescription>
            We're showing sample prospects as we're unable to generate personalized matches.
            (Development environment may need API keys configured)
          </AlertDescription>
        </Alert>
      )}
      
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
  const { fullName, linkedInUrl } = personProfile || {};
  
  if (!personProfile || !fullName || !linkedInUrl) {
    return (
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              {prospect.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{prospect.email}</div>
              <div className="text-muted-foreground text-sm">Sample Contact</div>
            </div>
          </div>
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          <div className="text-muted-foreground">Company information unavailable</div>
        </TableCell>
      </TableRow>
    );
  }
  
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
