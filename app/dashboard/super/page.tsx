import prisma from "@/prismaClient";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { SignInWithCredentials } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
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
                <TableCell>{user.id} / {user.email}</TableCell>
                <TableCell>{user.credits}</TableCell>
                <TableCell>{user._count.contacts}</TableCell>
                <TableCell>{user._count.introductionsFacilitated}</TableCell>
                <TableCell>{user._count.introductionsRequested}</TableCell>
                <TableCell>
                  <form action={SignInWithCredentials}>
                    <Input
                      type={"hidden"}
                      name={"userToImpersonate"}
                      value={user.id}
                    ></Input>
                    <SubmitButton variant={"secondary"} label={"impersonate"}/>
                  </form>
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
