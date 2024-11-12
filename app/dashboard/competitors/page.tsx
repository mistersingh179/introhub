import prisma from "@/prismaClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { Prisma, User } from "@prisma/client";
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
import getProfiles from "@/services/getProfiles";
import { CompanyBox } from "@/app/dashboard/introductions/list/IntroTable";
import FacilitatorBox from "@/components/FacilitatorBox";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type UserWithCompetitorsInitiated = Prisma.UserGetPayload<{
  include: { competitorsInitiated: true };
}>;

export default async function Competitors() {
  const session = (await auth()) as Session;
  const user: UserWithCompetitorsInitiated = await prisma.user.findFirstOrThrow(
    {
      where: {
        email: session.user?.email ?? "",
      },
      include: {
        competitorsInitiated: true,
      },
    },
  );

  const { competitorsInitiated } = user;
  console.log("** competitorsInitiated: ", competitorsInitiated);

  const competitorsIdHash = competitorsInitiated.reduce<
    Record<string, string>
  >((pv, cv) => {
    pv[cv.receiverId] = cv.reason;
    return pv;
  }, {});
  console.log("** competitorsIdHash: ", competitorsIdHash);

  const otherUsers = await prisma.user.findMany({
    where: {
      id: {
        not: user.id,
      },
    },
  });
  const emails = otherUsers.map((u) => u.email!);
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  return (
    <>
      <h1 className={"text-2xl my-8"}>Competitors</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {otherUsers.map((otherUser) => (
            <Row
              competitorsIdHash={competitorsIdHash}
              otherUser={otherUser}
              emailToProfile={emailToProfile}
              companyUrlToProfile={companyUrlToProfile}
              key={otherUser.id}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
}

type RowProps = {
  competitorsIdHash: Record<string, string>;
  otherUser: User;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
};
const Row = (props: RowProps) => {
  const { competitorsIdHash, emailToProfile, otherUser, companyUrlToProfile } =
    props;
  const contactProfiles = getProfiles(
    otherUser.email!,
    emailToProfile,
    companyUrlToProfile,
  );
  const { personExp, personProfile, companyProfile } = contactProfiles;

  if (!personProfile || !personExp || !companyProfile) {
    return <></>;
  }

  return (
    <TableRow>
      <TableCell>
        <FacilitatorBox user={otherUser} personExp={personExp} />
      </TableCell>
      <TableCell>
        <CompanyBox companyProfile={companyProfile} personExp={personExp} />
      </TableCell>
      <TableCell>
        {competitorsIdHash[otherUser.id] ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={"destructive"}>Competitive & thus Blocked</Badge>
              </TooltipTrigger>
              <TooltipContent className={"w-64"}>
                {competitorsIdHash[otherUser.id]}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Badge variant={"default"}>Non-Competitive & thus may request Intros</Badge>
        )}
      </TableCell>
    </TableRow>
  );
};
