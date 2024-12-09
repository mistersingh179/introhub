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
import { Group, Prisma } from "@prisma/client";
import { CompanyBox } from "@/app/dashboard/introductions/list/IntroTable";
import * as React from "react";
import getProfiles from "@/services/getProfiles";
import getEmailAndCompanyUrlProfiles, {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import FacilitatorBox from "@/components/FacilitatorBox";
import { Badge } from "@/components/ui/badge";
import DeleteGroupDialog from "@/app/dashboard/groups/DeleteGroupDialog";
import { PlatformGroupName } from "@/app/utils/constants";
import UpdateMembershipForm from "@/app/dashboard/groups/[id]/manage/UpdateMembershipForm";

type MembershipWithUser = Prisma.MembershipGetPayload<{
  include: {
    user: true;
  };
}>;

const ManageGroup = async ({
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

  const group = await prisma.group.findFirstOrThrow({ where: { id } });

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
        <h1 className={"text-2xl"}>Manage Group – {group.name}</h1>
        {group.name !== PlatformGroupName && group.creatorId === user.id && (
          <DeleteGroupDialog group={group} />
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow className={"flex flex-col sm:table-row"}>
            <TableHead>User</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberships.map((m) => (
            <MemberRow
              group={group}
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
  group: Group;
  membership: MembershipWithUser;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
};

const MemberRow = (props: GroupRowProps) => {
  const { group, membership, emailToProfile, companyUrlToProfile } = props;
  const contactProfiles = getProfiles(
    membership.user.email!,
    emailToProfile,
    companyUrlToProfile,
  );
  const { personExp, personProfile, companyProfile } = contactProfiles;

  return (
    <>
      <TableRow className={"flex flex-col sm:table-row"}>
        <TableCell>
          <FacilitatorBox user={membership.user} personExp={personExp} />
        </TableCell>
        <TableCell>
          <CompanyBox
            showLinkedInUrls={true}
            companyProfile={companyProfile}
            personExp={personExp}
          />
        </TableCell>
        <TableCell>
          <Badge>
            {membership.approved
              ? "Approved Member"
              : "Pending Organizer Approval"}
          </Badge>
        </TableCell>
        <TableCell>
          <div className={"flex flex-row gap-4"}>
            <UpdateMembershipForm
              shouldApprove={!membership.approved}
              group={group}
              membership={membership}
            />
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ManageGroup;
