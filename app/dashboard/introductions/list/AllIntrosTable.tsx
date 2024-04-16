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
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { User } from "@prisma/client";
import UpdateMessageForContactDialog from "@/app/dashboard/introductions/list/UpdateMessaageForContactDialog";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IntroStatesKey, IntroStatesWithMeaning } from "@/lib/introStates";
import { Separator } from "@/components/ui/separator";
import ActionButtons from "@/app/dashboard/introductions/list/ActionButtons";

type AllIntrosTableProps = {
  myIntroductions: IntroWithContactFacilitatorAndRequester[];
  user: User;
};
export default function AllIntrosTable(props: AllIntrosTableProps) {
  const { myIntroductions, user } = props;

  return (
    <Table>
      <TableCaption>My Introductions</TableCaption>
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
        {myIntroductions.map((introduction) => {
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
          <UpdateMessageForContactDialog introduction={introduction} />
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
                {introduction.rejectionReason && (
                  <>
                    <Separator className={"my-2"} />
                    <p>{introduction.rejectionReason}</p>
                  </>
                )}
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
