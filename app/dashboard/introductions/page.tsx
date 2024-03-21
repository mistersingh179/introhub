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
import MyPagination from "@/components/MyPagination";
import { Contact, Introduction, User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TicketCheck, TicketX, X } from "lucide-react";
import { format } from "date-fns";
import { IntroStatesKey, IntroStatesWithMeaning } from "@/lib/introStates";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type IntroWithContactFacilitatorAndRequester = Introduction & {
  contact: Contact;
  facilitator: User;
  requester: User;
};

export default async function IntroductionsRequested({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  const query = searchParams?.query || undefined;
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 10;
  const recordsToSkip = (currentPage - 1) * itemsPerPage;

  const introductionsRequested: IntroWithContactFacilitatorAndRequester[] =
    await prisma.introduction.findMany({
      where: {
        OR: [
          {
            requesterId: {
              equals: user.id,
            },
          },
          {
            facilitatorId: {
              equals: user.id,
            },
          },
        ],
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: recordsToSkip,
      take: itemsPerPage,
    });
  console.log("introductionsRequested: ", introductionsRequested);
  return (
    <>
      <Table>
        <TableCaption>Introductions Requested</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className={"p-2"}>Contact</TableHead>
            <TableHead className={"p-2"}>Facilitator</TableHead>
            <TableHead className={"p-2"}>Requester</TableHead>
            <TableHead className={"p-2"}>Message for Facilitator</TableHead>
            <TableHead className={"p-2"}>Message for Prospect</TableHead>
            <TableHead className={"p-2"}>Created At</TableHead>
            <TableHead className={"p-2"}>Status</TableHead>
            <TableHead className={"p-2"}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {introductionsRequested.map((introduction) => {
            return (
              <IntroductionRow
                key={introduction.id}
                introduction={introduction}
                user={user}
              />
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>
              <MyPagination />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

type IntroductionRowProps = {
  introduction: IntroWithContactFacilitatorAndRequester;
  user: User;
};
const IntroductionRow = (props: IntroductionRowProps) => {
  const { introduction, user } = props;
  return (
    <>
      <TableRow key={introduction.id}>
        <TableCell className={"p-2"}>{introduction.contact.email}</TableCell>
        <TableCell className={"p-2"}>
          {introduction.facilitator.email}
        </TableCell>
        <TableCell className={"p-2"}>{introduction.requester.email}</TableCell>
        <TableCell className={"p-2"}>
          {introduction.messageForFacilitator}
        </TableCell>
        <TableCell className={"p-2"}>
          {introduction.messageForContact}
        </TableCell>
        <TableCell className={"p-2"}>
          {format(introduction.createdAt, "MM/dd/yyyy")}
        </TableCell>
        <TableCell className={"p-2"}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>{introduction.status}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p className={"w-40"}>
                  {
                    IntroStatesWithMeaning[
                      introduction.status as IntroStatesKey
                    ]
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        <TableCell className={"p-2"}>
          <ActionButtons introduction={introduction} user={user} />
        </TableCell>
      </TableRow>
    </>
  );
};

type ActionButtonProps = {
  introduction: IntroWithContactFacilitatorAndRequester;
  user: User;
};
const ActionButtons = (props: ActionButtonProps) => {
  const { introduction, user } = props;
  return (
    <>
      <div className={"flex flex-col gap-4"}>
        {introduction.facilitatorId === user.id && (
          <>
            <Button asChild>
              <Link href={`#`}>
                Approve
                <TicketCheck size={18} className={"ml-2"} />
              </Link>
            </Button>
            <Button asChild>
              <Link href={`#`}>
                Reject
                <TicketX size={18} className={"ml-2"} />
              </Link>
            </Button>
          </>
        )}
        {introduction.requesterId === user.id && (
          <Button asChild>
            <Link href={`#`}>
              Cancel
              <X size={18} className={"ml-2"} />
            </Link>
          </Button>
        )}{" "}
      </div>
    </>
  );
};
