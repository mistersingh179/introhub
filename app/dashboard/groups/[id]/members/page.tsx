import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import { CompanyBox } from "@/app/dashboard/introductions/list/IntroTable";
import * as React from "react";
import getProfiles from "@/services/getProfiles";
import getEmailAndCompanyUrlProfiles, {
  CompanyUrlToProfile,
  EmailToProfile
} from "@/services/getEmailAndCompanyUrlProfiles";
import FacilitatorBox from "@/components/FacilitatorBox";

type MembershipWithUser = Prisma.MembershipGetPayload<{
  include: {
    user: true;
  };
}>;

const MembersList = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { id } = params;
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  const memberships: MembershipWithUser[] = await prisma.membership.findMany({
    where: {
      groupId: id,
    },
    include: {
      user: true,
    },
  });

  const emails = memberships.map((m) => m.user.email!);

  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  return (
    <>
      <div className={"flex flex-row my-8 justify-between"}>
        <h1 className={"text-2xl"}>Members</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow className={"flex flex-col sm:table-row"}>
            <TableHead>User</TableHead>
            <TableHead>Company</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberships.map((m) => (
            <MemberRow
              membership={m}
              key={m.id}
              emailToProfile={emailToProfile}
              companyUrlToProfile={companyUrlToProfile}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

type GroupRowProps = {
  membership: MembershipWithUser;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
};

const MemberRow = (props: GroupRowProps) => {
  const { membership, emailToProfile, companyUrlToProfile } = props;
  const contactProfiles = getProfiles(
    membership.user.email!,
    emailToProfile,
    companyUrlToProfile,
  );
  const { personExp, personProfile, companyProfile } = contactProfiles;
  const { fullName, linkedInUrl } = personProfile;
  return (
    <>
      <TableRow className={"flex flex-col sm:table-row"}>
        <TableCell>
          <FacilitatorBox user={membership.user} personExp={personExp} />
        </TableCell>
        <TableCell>
          <CompanyBox showLinkedInUrls={true} companyProfile={companyProfile} personExp={personExp} />
        </TableCell>
      </TableRow>
    </>
  );
};

export default MembersList;
