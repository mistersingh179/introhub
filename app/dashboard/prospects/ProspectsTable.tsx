import { ContactWithUserInfo } from "@/app/dashboard/prospects/page";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildS3ImageUrl } from "@/lib/url";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { getInitials } from "@/app/dashboard/UserProfileImageNav";

const ProspectsTable = ({
  prospects,
}: {
  prospects: ContactWithUserInfo[];
}) => {
  return (
    <Table>
      <TableCaption>Prospects</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Send Count</TableHead>
          <TableHead>Received Count</TableHead>
          <TableHead>Sent-Received Ratio</TableHead>
          <TableHead>Introducer</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prospects.map((prospect) => {
          return <ProspectRow key={prospect.id} prospect={prospect} />;
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
};

type ProspectRowProps = {
  prospect: ContactWithUserInfo;
};
const ProspectRow = (props: ProspectRowProps) => {
  const { prospect } = props;
  return (
    <>
      <TableRow key={prospect.email}>
        <TableCell className={"p-2"}>
          <Avatar className={"h-8 w-8"}>
            <AvatarImage
              src={buildS3ImageUrl("logo", prospect.website)}
              title={prospect.website}
            />
            <AvatarFallback>{"W"}</AvatarFallback>
          </Avatar>
        </TableCell>
        <TableCell className={"p-2"}>
          <Avatar className={"h-8 w-8"}>
            <AvatarImage
              src={buildS3ImageUrl("avatar", prospect.email)}
              title={prospect.email}
            />
            <AvatarFallback>{"E"}</AvatarFallback>
          </Avatar>
        </TableCell>
        <TableCell className={"p-2"}>
          <Link
            href={`/dashboard/prospects/${prospect.id}/`}
            className={"hover:underline"}
          >
            {prospect.email}
          </Link>
        </TableCell>
        <TableCell className={"p-2"}>{prospect.sentCount}</TableCell>
        <TableCell className={"p-2"}>{prospect.receivedCount}</TableCell>
        <TableCell className={"p-2"}>
          {prospect.sentReceivedRatio / 100}
        </TableCell>
        <TableCell className={"p-2"}>
          <Avatar className={"h-8 w-8"}>
            <AvatarImage src={prospect.userImage} title={prospect.userEmail} />
            <AvatarFallback>{getInitials(prospect.userName)}</AvatarFallback>
          </Avatar>
        </TableCell>
        <TableCell className={"p-2"}>
          <Button asChild>
            <Link href={`/dashboard/introductions/create/${prospect.id}`}>
              Create Introduction
              <SquarePen size={18} className={"ml-2"} />
            </Link>
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ProspectsTable;
