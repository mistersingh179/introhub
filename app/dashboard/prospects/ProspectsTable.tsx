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
import getProfiles from "@/services/getProfiles";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { User } from "@prisma/client";
import { ContactWithUserAndIsWanted } from "@/app/dashboard/prospects/page";
import WantToMeetStar from "@/app/dashboard/prospects/WantToMeetStar";

const ProspectsTable = async ({
  prospectsWithUser,
  emailToProfile,
  companyUrlToProfile,
  filteredRecordsCount,
}: {
  prospectsWithUser: ContactWithUserAndIsWanted[];
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
      <Table>
        <TableCaption>Prospects</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className={"w-2/3"}>Prospect</TableHead>
            <TableHead className={"w-1/3"}></TableHead>
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
  prospect: ContactWithUserAndIsWanted;
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
            {process.env.NODE_ENV === "development" ? prospect.email : ""}
          </div>
        </TableCell>
        <TableCell className={""}>
          <div className={"flex flex-col gap-4"}>
            <WantToMeetStar contact={prospect} />
            {/*{prospect.isWanted ? (*/}
            {/*  <WantToNotMeetForm contactId={prospect.id} />*/}
            {/*) : (*/}
            {/*  <WantToMeetForm contactId={prospect.id} />*/}
            {/*)}*/}
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ProspectsTable;
