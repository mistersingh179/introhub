import prisma from "@/prismaClient";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ImpersonateForm from "@/app/dashboard/super/ImpersonateForm";
import FacilitatorBox from "@/components/FacilitatorBox";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import getProfiles from "@/services/getProfiles";
import { CompanyBox } from "@/app/dashboard/introductions/list/IntroTable";
import * as React from "react";
import ShowChildren from "@/components/ShowChildren";
import { Badge } from "@/components/ui/badge";
import AddLinkedInUrlDialog from "@/app/dashboard/super/AddLinkedInUrlDialog";

const Super = async () => {
  const allUsers = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          contacts: true,
          introductionsFacilitated: true,
          introductionsRequested: true,
        },
      },
    },
  });

  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(allUsers.map((u) => u.email!));

  return (
    <>
      <h1 className={"text-2xl my-8"}>Super</h1>
      <Table className={"table-auto"}>
        <TableCaption>All Users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>id / email</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead>credits</TableHead>
            <TableHead>contacts</TableHead>
            <TableHead>facilitor</TableHead>
            <TableHead>requester</TableHead>
            <TableHead>action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allUsers.map(async (user) => {
            const { personExp, companyProfile, personProfile } = getProfiles(
              user.email!,
              emailToProfile,
              companyUrlToProfile,
            );

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className={"flex flex-col gap-4"}>
                    <div>{user.email}</div>
                    <div>{user.id}</div>
                    <ShowChildren showIt={user.unableToAutoProspect}>
                      <div>
                        <Badge variant="destructive">
                          Unable to Auto Prospect
                        </Badge>
                      </div>
                    </ShowChildren>
                    <ShowChildren showIt={user.missingPersonalInfo}>
                      <div>
                        <Badge variant="destructive">
                          Missing Personal Info
                        </Badge>
                      </div>
                    </ShowChildren>
                    <ShowChildren showIt={user.tokenIssue}>
                      <div>
                        <Badge variant="destructive">
                          Token Issue Encountered
                        </Badge>
                      </div>
                    </ShowChildren>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={"flex flex-col gap-4"}>
                    <ShowChildren showIt={!!personExp}>
                      <div>
                        <FacilitatorBox user={user} personExp={personExp} />
                      </div>
                    </ShowChildren>
                    <ShowChildren showIt={!!companyProfile && !!personExp}>
                      <div>
                        <CompanyBox
                          companyProfile={companyProfile}
                          personExp={personExp}
                        />
                      </div>
                    </ShowChildren>
                  </div>
                </TableCell>
                <TableCell>{user.credits}</TableCell>
                <TableCell>{user._count.contacts}</TableCell>
                <TableCell>{user._count.introductionsFacilitated}</TableCell>
                <TableCell>{user._count.introductionsRequested}</TableCell>
                <TableCell>
                  <div className={"flex flex-col gap-4"}>
                    <ImpersonateForm userId={user.id} />
                    <ShowChildren showIt={user.missingPersonalInfo || !personProfile.linkedInUrl}>
                      <AddLinkedInUrlDialog userEmail={user.email!} />
                    </ShowChildren>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        {/*<TableFooter>*/}
        {/*  <TableRow>*/}
        {/*    <TableCell colSpan={2}>*/}
        {/*      <MyPagination />*/}
        {/*    </TableCell>*/}
        {/*  </TableRow>*/}
        {/*</TableFooter>*/}
      </Table>
    </>
  );
};

export default Super;
