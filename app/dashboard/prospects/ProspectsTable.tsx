import * as React from "react";

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
import {
  CompanyBox,
  ProspectBox,
} from "@/app/dashboard/introductions/list/IntroTable";
import {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import { ContactWithUser } from "@/app/dashboard/introductions/create/[contactId]/page";
import FacilitatorBox from "@/components/FacilitatorBox";
import getProfiles from "@/services/getProfiles";
import CreateIntroButton from "@/components/CreateIntroButton";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { User } from "@prisma/client";
import NegativeBalanceAlert from "@/components/NegativeBalanceAlert";
import ShowChildren from "@/components/ShowChildren";

const ProspectsTable = async ({
  prospectsWithUser,
  emailToProfile,
  companyUrlToProfile,
  filteredRecordsCount,
}: {
  prospectsWithUser: ContactWithUser[];
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
  filteredRecordsCount: number;
}) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  return (
    <>
      <ShowChildren showIt={user.credits < 0}>
        <NegativeBalanceAlert />
      </ShowChildren>
      <Table>
        <TableCaption>Prospects</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className={"w-1/2"}>Prospect</TableHead>
            <TableHead className={"w-1/2"}>Introducer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prospectsWithUser.map((prospect) => {
            return (
              <ProspectRow
                key={prospect.id}
                prospect={prospect}
                emailToProfile={emailToProfile}
                companyUrlToProfile={companyUrlToProfile}
                user={user}
              />
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>
              <MyPagination totalCount={filteredRecordsCount} />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

type ProspectRowProps = {
  prospect: ContactWithUser;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
  user: User;
};
export const ProspectRow = (props: ProspectRowProps) => {
  const { prospect, emailToProfile, companyUrlToProfile, user } = props;
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
          <div className={"flex flex-col gap-4 overflow-hidden"}>
            <ProspectBox
              contact={prospect}
              personProfile={contactProfiles.personProfile}
              personExp={contactProfiles.personExp}
            />
            <CompanyBox
              companyProfile={contactProfiles.companyProfile}
              personExp={contactProfiles.personExp}
            />
          </div>
        </TableCell>
        <TableCell className={""}>
          <div className={"flex flex-col gap-4"}>
            <FacilitatorBox
              user={prospect.user}
              personExp={facilitatorProfiles.personExp}
            />
            <CreateIntroButton prospect={prospect} user={user} />
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ProspectsTable;
