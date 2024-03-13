import prisma from "@/prismaClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Contact, Message} from "@prisma/client";

export default async function Emails() {
  const session = (await auth()) as Session;
  const emails = await prisma

  const messages: Message[] = await prisma.message.findMany({
    where: {
      user: {
        email: session.user?.email || "",
      },
    },
    take: 10
  });
  return (
    <>
      <h1 className={"text-2xl my-4"}>My Emails</h1>
      <Table>
        <TableCaption>My Emails</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>Delivered To</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Reply-To</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Received At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => {
            return (
              <MessageRow key={message.id} message={message} />
            );
          })}
        </TableBody>
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
        <TableCell>{message.fromAddress}</TableCell>
        <TableCell>{message.deliveredTo}</TableCell>
        <TableCell>{message.toAddress}</TableCell>
        <TableCell>{message.replyToAddress}</TableCell>
        <TableCell>{message.subject}</TableCell>
        <TableCell>{message.receivedAt?.toString()}</TableCell>
      </TableRow>
    </>
  );
};
