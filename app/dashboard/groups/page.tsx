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
import { Prisma, User } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as React from "react";
import GroupMembershipForm from "@/app/dashboard/groups/GroupMembershipForm";
import Link from "next/link";
import CreateGroupDialog from "@/app/dashboard/groups/CreateGroupDialog";
import FacilitatorBox from "@/components/FacilitatorBox";
import getProfiles from "@/services/getProfiles";
import getEmailAndCompanyUrlProfiles, {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type GroupWithMembersAndCreator = Prisma.GroupGetPayload<{
  include: {
    memberships: {
      include: {
        user: true;
      };
    };
    creator: true;
  };
}>;

const GroupsList = async () => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  const groups: GroupWithMembersAndCreator[] = await prisma.group.findMany({
    include: {
      memberships: {
        include: {
          user: true,
        },
      },
      creator: true,
    },
  });

  const emails = groups.map((g) => g.creator.email!);

  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  return (
    <>
      <div className={"flex flex-row my-8 justify-between"}>
        <h1 className={"text-2xl"}>Groups</h1>
        <CreateGroupDialog />
      </div>

      <Table>
        <TableHeader>
          <TableRow className={"flex flex-col sm:table-row"}>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <GroupRow
              group={group}
              currentUser={user}
              key={group.id}
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
  group: GroupWithMembersAndCreator;
  currentUser: User;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
};

const GroupRow = (props: GroupRowProps) => {
  const { currentUser, group, emailToProfile, companyUrlToProfile } = props;
  const usersMembership = group.memberships.find(
    (m) => m.userId === currentUser.id,
  );
  const contactProfiles = getProfiles(
    group.creator.email!,
    emailToProfile,
    companyUrlToProfile,
  );
  const { personExp } = contactProfiles;
  return (
    <>
      <TableRow className={"flex flex-col sm:table-row"}>
        <TableCell>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{group.name}</TooltipTrigger>
              <TooltipContent
                side={"right"}
                sideOffset={10}
                className={"sm:max-w-sm md:max-w-xl"}
              >
                {group.description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        <TableCell>
          <FacilitatorBox user={group.creator} personExp={personExp} />
        </TableCell>
        <TableCell>
          <Link href={`/dashboard/groups/${group.id}/members`}>
            View {group.memberships.length} Members
          </Link>
        </TableCell>
        <TableCell>
          <div className={"flex flex-col gap-4"}>
            {group.creator.id === currentUser.id && (
              <Button asChild className={"w-fit"}>
                <Link href={`/dashboard/groups/${group.id}/manage`}>
                  Manage 🛠
                </Link>
              </Button>
            )}
            {!usersMembership && (
              <GroupMembershipForm wantsToJoin={true} groupId={group.id} />
            )}
            {usersMembership && !usersMembership.approved && (
              <Badge className={"w-fit"}>Pending Organizer Approval</Badge>
            )}
            {usersMembership && usersMembership.approved && (
              <GroupMembershipForm wantsToJoin={false} groupId={group.id} />
            )}
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default GroupsList;
