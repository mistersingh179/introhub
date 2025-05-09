import prisma from "@/prismaClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
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
import { Message } from "@prisma/client";
import MyPagination from "@/components/MyPagination";
import Search from "@/components/Search";

export default async function Emails({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || undefined;
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 10;
  const recordsToSkip = (currentPage - 1) * itemsPerPage;

  const session = (await auth()) as Session;
  const messages: Message[] = await prisma.message.findMany({
    where: {
      user: {
        email: session.user?.email || "",
      },
      OR: query
        ? [
            {
              fromAddress: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              toAddress: {
                contains: query,
                mode: "insensitive",
              },
            },
          ]
        : undefined,
    },
    take: itemsPerPage,
    skip: recordsToSkip,
  });
  return (
    <>
      <h1 className={"text-2xl my-4"}>My Emails</h1>
      <Search placeholder={"filter by email here"} />
      <Table className={"table-fixed"}>
        <TableCaption>My Emails</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => {
            return <MessageRow key={message.id} message={message} />;
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>
              <MyPagination />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

type MessageProps = {
  message: Message;
};
const MessageRow = (props: MessageProps) => {
  const { message } = props;
  return (
    <>
      <TableRow key={message.gmailMessageId}>
        <TableCell
          className={"p-2 overflow-ellipsis whitespace-nowrap overflow-hidden"}
        >
          {message.fromAddress}
        </TableCell>
        <TableCell
          className={"p-2 overflow-ellipsis whitespace-nowrap overflow-hidden"}
        >
          {message.toAddress}
        </TableCell>
      </TableRow>
    </>
  );
};
