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
import AddCreditsDialog from "@/app/dashboard/super/AddCreditsDialog";
import ImpersonateForm from "@/app/dashboard/super/ImpersonateForm";

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

  return (
    <>
      <h1 className={"text-2xl my-8"}>Super</h1>
      <Table className={"table-fixed"}>
        <TableCaption>All Users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>id / email</TableHead>
            <TableHead>credits</TableHead>
            <TableHead>contacts</TableHead>
            <TableHead>facilitor</TableHead>
            <TableHead>requester</TableHead>
            <TableHead>action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allUsers.map((user) => {
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className={"flex flex-col gap-4"}>
                    <div>{user.id}</div>
                    <div>{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>{user.credits}</TableCell>
                <TableCell>{user._count.contacts}</TableCell>
                <TableCell>{user._count.introductionsFacilitated}</TableCell>
                <TableCell>{user._count.introductionsRequested}</TableCell>
                <TableCell>
                  <div className={"flex flex-col gap-4"}>
                    <ImpersonateForm userId={user.id} />
                    <AddCreditsDialog userId={user.id} />
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
