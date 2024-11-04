import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UpdateIcpForm from "@/app/dashboard/icp/UpdateIcpForm";
import {
  CompanyBox,
  ProspectBox,
} from "@/app/dashboard/introductions/list/IntroTable";
import { Contact } from "@prisma/client";
import getEmailAndCompanyUrlProfiles, {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import getProfiles from "@/services/getProfiles";
import getMatchingProspectsFromPinecone from "@/services/llm/getMatchingProspectsFromPinecone";
import getMatchingProspectsFromLlm from "@/services/llm/getMatchingProspectsFromLlm";

export default async function Home() {
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

  const batchSize = 100;
  // const llmMatchedEmails = [];
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
  });
  console.log("prospects found: ", prospects.length);

  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(llmMatchedEmails);

  return (
    <div className={"flex flex-col gap-8"}>
      <div className={"flex flex-row items-center gap-2"}>
        <h1 className={"text-2xl mt-6"}>ICP</h1>
      </div>

      <div>
        <p className="text-md">
          In natural language describe your ICP (Ideal Customer Profile), hit
          submit and view the results.
        </p>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li>
            If the results match your ICP, you are good and nothing more needs
            to be done. ✅
          </li>
          <li>
            If the results {"don't"} match your ICP, modify the the description,
            hit submit and try again. 🔁
          </li>
        </ul>
      </div>
      <UpdateIcpForm icpDescription={user.icpDescription ?? undefined} />

      <div className={"flex flex-col gap-1 text-muted-foreground text-sm"}>
        <div className={"flex flex-row gap-2"}>
          <div>Vector Database Result Size:</div>
          <div>
            {pineconeMatchedEmails.length}{" "}
            {pineconeMatchedEmails.length === k ? "+" : ""}
          </div>
        </div>
        <div className={"flex flex-row gap-2"}>
          <div>
            LLM Result Size after filtering the top {batchSize} records:
          </div>
          <div>{llmMatchedEmails.length} </div>
        </div>
      </div>

      <div>
        <Table>
          <TableCaption>Matching Prospects</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className={"w-1/2"}>Prospect</TableHead>
              <TableHead className={"w-1/2"}>Company</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
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
    </div>
  );
}

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
