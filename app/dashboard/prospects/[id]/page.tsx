import prisma from "@/prismaClient";
import Link from "next/link";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import {
  CompanyBox,
  getCategoryNames,
  ProspectBox,
} from "@/app/dashboard/introductions/list/IntroTable";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { Session } from "next-auth";
import LinkWithExternalIcon from "@/components/LinkWithExternalIcon";
import ShowChildren from "@/components/ShowChildren";
import getProfiles from "@/services/getProfiles";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as React from "react";
import { isDate, lightFormat } from "date-fns";

export default async function ShowContact({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  const { id } = params;
  const contact = await prisma.contact.findFirstOrThrow({
    where: { id },
  });
  const email = contact.email;
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles([email]);
  const {
    personExp,
    companyProfile,
    personProfile
  } =
    getProfiles(
      email,
      emailToProfile,
      companyUrlToProfile,
  );
  const categoryNames = getCategoryNames(companyProfile);
  const departmentNames = personProfile.departments.map(
    (d) => d.department.name,
  );
  const workFunctionNames = personProfile.workFunctions.map(
    (wf) => wf.workFunction.name,
  );

  const messages = await prisma.message.findMany({
    where: {
      user: user,
      OR: [
        {
          fromAddress: {
            contains: email,
            mode: "insensitive",
          },
        },
        {
          replyToAddress: {
            contains: email,
            mode: "insensitive",
          },
        },
        {
          toAddress: {
            contains: email,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  return (
    <>
      <div className={"flex flex-col gap-4 mt-6"}>
        <div className={"flex flex-row gap-8 items-center"}>
          <h1 className={"text-2xl my-2"}>Prospect Profile</h1>
        </div>
        <ProspectBox
          contact={contact}
          personProfile={personProfile}
          personExp={personExp}
          showLinkedInUrls={true}
        />
        <CompanyBox
          companyProfile={companyProfile}
          personExp={personExp}
          showLinkedInUrls={true}
        />

        <div className={"flex flex-row gap-4 items-center"}>
          <div>Description:</div>
          <div>{personProfile.llmDescription}</div>
        </div>


        <div className={"flex flex-row gap-4"}>
          <div>Seniority:</div>
          <div>{personProfile.seniority}</div>
        </div>

        <div className={"flex flex-row gap-4"}>
          <div>Headline:</div>
          <div>{personProfile.headline}</div>
        </div>

        <div className={"flex flex-row gap-4"}>
          <div>Is likely to engage:</div>
          <div>{personProfile.isLikelyToEngage ? "yes" : "no"}</div>
        </div>

        <div className={"flex flex-row gap-4"}>
          <div>Job Description:</div>
          <div>{personExp.jobDescription}</div>
        </div>

        <ShowChildren showIt={!!companyProfile.website}>
          <div className={"flex flex-row gap-4 items-center"}>
            <div>Website:</div>
            <div>
              <LinkWithExternalIcon href={companyProfile.website!}/>
            </div>
          </div>
        </ShowChildren>

        <ShowChildren showIt={!!companyProfile.sizeFrom}>
          <div className={"flex flex-row gap-4"}>
            <div>Size Range:</div>
            <div>
              {companyProfile.sizeFrom} - {companyProfile.sizeTo}
            </div>
          </div>
        </ShowChildren>

        <ShowChildren showIt={!!companyProfile.size}>
          <div className={"flex flex-row gap-4"}>
            <div>Size:</div>
            <div>{companyProfile.size}</div>
          </div>
        </ShowChildren>

        <div className={"flex flex-row gap-4"}>
          <div>Location:</div>
          <div>
            {personProfile.city} {personProfile.state} {personProfile.country}
          </div>
        </div>

        <div className={"flex flex-row gap-4"}>
          <div>Departments:</div>
          <div className={"space-x-2"}>
            {departmentNames.map((d) => (
              <Badge key={"d"}>{d}</Badge>
            ))}
          </div>
        </div>

        <ShowChildren showIt={workFunctionNames.length > 0}>
          <div className={"flex flex-row gap-4"}>
            <div>Work Functions:</div>
            <div className={"space-x-2"}>
              {workFunctionNames.map((wf) => (
                <Badge key={"wf"}>{wf}</Badge>
              ))}
            </div>
          </div>
        </ShowChildren>

        <ShowChildren showIt={!!companyProfile.industry}>
          <div className={"flex flex-row gap-4"}>
            <div>Industry:</div>
            <div>{companyProfile.industry}</div>
          </div>
        </ShowChildren>

        <ShowChildren showIt={!!companyProfile.publiclyTradedExchange}>
          <div className={"flex flex-row gap-4"}>
            <div>Publicly Traded Exchange:</div>
            <div>{companyProfile.publiclyTradedExchange}</div>
          </div>
        </ShowChildren>

        <ShowChildren showIt={!!companyProfile.foundedYear}>
          <div className={"flex flex-row gap-4"}>
            <div>Founded Year:</div>
            <div>{companyProfile.foundedYear}</div>
          </div>
        </ShowChildren>

        <ShowChildren showIt={!!companyProfile.latestFundingStage}>
          <div className={"flex flex-row gap-4"}>
            <div>Latest Funding Stage:</div>
            <div>{companyProfile.latestFundingStage}</div>
          </div>
        </ShowChildren>

        {isDate(companyProfile.latestFundingRoundDate) && (
          <div className={"flex flex-row gap-4"}>
            <div>Latest Funding Round Date:</div>
            <div>
              {lightFormat(companyProfile.latestFundingRoundDate, "MM-dd-yyyy")}
            </div>
          </div>
        )}

        <ShowChildren showIt={categoryNames.length > 0}>
          <div className={"flex flex-row gap-4"}>
            <div>Company Categories:</div>
            <div className={"space-x-2"}>
              {categoryNames.map((x) => (
                <Badge key={"x"}>{x}</Badge>
              ))}
            </div>
          </div>
        </ShowChildren>

        <ShowChildren showIt={messages.length > 0}>
          <Table className={"caption-top w-fit"}>
            <TableCaption>Your previous Email Correspondence</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Subject</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((m) => {
                return (
                  <TableRow key={m.id} className={""}>
                    <TableCell className={"p-2"}>
                      {lightFormat(m.createdAt, "MM-dd-yyyy")}
                    </TableCell>
                    <TableCell className={"p-2"}>{m.subject}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ShowChildren>
      </div>
    </>
  );
}
