import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
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
  CompanyProfile,
  Contact,
  Introduction,
  PersonExperience,
  PersonProfile,
  User,
} from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IntroStatesKey, IntroStatesWithMeaning } from "@/lib/introStates";
import { Separator } from "@/components/ui/separator";
import {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildS3ImageUrl } from "@/lib/url";
import { getInitials } from "@/app/dashboard/UserProfileImageNav";
import { Badge } from "@/components/ui/badge";
import IntroOverviewSheet from "@/app/dashboard/introductions/list/IntroOverviewSheet";
import Link from "next/link";

const IntroTable = ({
  introductions,
  user,
  emailToProfile,
  companyUrlToProfile,
}: {
  introductions: IntroWithContactFacilitatorAndRequester[];
  user: User;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
}) => {
  return (
    <>
      <Table>
        <TableCaption>Introductions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className={"p-2"}>Requester</TableHead>
            <TableHead className={"p-2"}>Prospect</TableHead>
            <TableHead className={"p-2"}>Organization</TableHead>
            <TableHead className={"p-2"}>Facilitating Person</TableHead>
            <TableHead className={"p-2"}>Status</TableHead>
            <TableHead className={"p-2"}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {introductions.map((introduction) => {
            return (
              <IntroSentRow
                key={introduction.id}
                introduction={introduction}
                user={user}
                emailToProfile={emailToProfile}
                companyUrlToProfile={companyUrlToProfile}
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
};

export default IntroTable;

export const UserAvatar = ({ user }: { user: User }) => {
  return (
    <Avatar className={"h-8 w-8"}>
      <AvatarImage src={user.image ?? ""} title={user.name ?? ""} />
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
};

export const ProspsectAvatar = ({
  prospect,
  personProfile,
}: {
  prospect: Contact;
  personProfile: PersonProfile;
}) => {
  if (!personProfile.fullName) {
    return <></>;
  }
  return (
    <>
      <Avatar className={"h-8 w-8"}>
        <AvatarImage
          src={buildS3ImageUrl("avatar", prospect.email ?? "")}
          title={prospect.email ?? ""}
        />
        <AvatarFallback>{getInitials(personProfile.fullName)}</AvatarFallback>
      </Avatar>
    </>
  );
};

export const CompanyLogo = ({
  companyProfile,
  personExp,
}: {
  companyProfile: CompanyProfile;
  personExp: PersonExperience;
}) => {
  if (!personExp.companyName) {
    return <></>;
  }
  return (
    <>
      <Avatar className={"h-8 w-8"}>
        <AvatarImage
          src={buildS3ImageUrl("logo", companyProfile.website ?? "")}
          title={companyProfile.website ?? ""}
        />
        <AvatarFallback>{getInitials(personExp.companyName)}</AvatarFallback>
      </Avatar>
    </>
  );
};

export const IntroStatusBadge = ({
  introduction,
}: {
  introduction: Introduction;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Badge variant={"default"}>
              <div>{introduction.status}</div>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className={"w-40"}>
            {IntroStatesWithMeaning[introduction.status as IntroStatesKey]}
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
  );
};

export const RequesterBox = ({
  intro,
  personExp,
}: {
  intro: IntroWithContactFacilitatorAndRequester;
  personExp: PersonExperience;
}) => {
  return (
    <div className={"flex flex-row gap-4 items-center"}>
      <UserAvatar user={intro.requester} />
      <div className={"flex flex-col gap-2"}>
        <div>{intro.requester.name} </div>
        <p className={"text-muted-foreground"}>
          {personExp?.jobTitle ?? "unknown"}{" "}
        </p>
      </div>
    </div>
  );
};

export const FacilitatorBox = ({
  user,
  personExp,
}: {
  user: User;
  personExp: PersonExperience;
}) => {
  return (
    <div className={"flex flex-row gap-2 items-center"}>
      <UserAvatar user={user} />
      <div className={"flex flex-col gap-2"}>
        <div>{user.name}</div>
        {personExp.jobTitle && (
          <p className={"text-muted-foreground"}>{personExp.jobTitle} </p>
        )}
      </div>
    </div>
  );
};

export const ProspectBox = ({
  contact,
  personProfile,
  personExp,
}: {
  contact: Contact;
  personProfile: PersonProfile;
  personExp: PersonExperience;
}) => {
  return (
    <div className={"flex flex-row gap-4 items-center"}>
      <ProspsectAvatar prospect={contact} personProfile={personProfile} />
      <div className={"flex flex-col gap-2"}>
        <div>
          <Link href={`/dashboard/prospects/${contact.id}`}>
            {personProfile.fullName}
          </Link>{" "}
        </div>
        <p className={"text-muted-foreground"}>{personExp.jobTitle} </p>
      </div>
    </div>
  );
};

export const CompanyBox = ({
  companyProfile,
  personExp,
}: {
  companyProfile: CompanyProfile;
  personExp: PersonExperience;
}) => {
  return (
    <div className={"flex flex-row gap-4 items-center"}>
      <CompanyLogo companyProfile={companyProfile} personExp={personExp} />
      <div className={"flex flex-col gap-2"}>
        <div>{personExp.companyName} </div>
        <p className={"text-muted-foreground"}>{companyProfile.industry}</p>
      </div>
    </div>
  );
};

export type Profiles = {
  personProfile: PersonProfile;
  personExp: PersonExperience;
  companyProfile: CompanyProfile;
};

export const getProfiles = (
  email: string,
  emailToProfile: EmailToProfile,
  companyUrlToProfile: CompanyUrlToProfile,
): Profiles => {
  const personProfile = emailToProfile[email];
  const personExp = personProfile?.personExperiences?.[0] ?? {};
  const companyProfile =
    companyUrlToProfile[personExp.companyLinkedInUrl] || {};
  return { personProfile, personExp, companyProfile };
};

export const getAllProfiles = (
  introduction: IntroWithContactFacilitatorAndRequester,
  emailToProfile: EmailToProfile,
  companyUrlToProfile: CompanyUrlToProfile,
) => {
  const contactProfiles = getProfiles(
    introduction.contact.email,
    emailToProfile,
    companyUrlToProfile,
  );
  const requestProfiles = getProfiles(
    introduction.requester.email!,
    emailToProfile,
    companyUrlToProfile,
  );
  const facilitatorProfiles = getProfiles(
    introduction.facilitator.email!,
    emailToProfile,
    companyUrlToProfile,
  );
  return { contactProfiles, requestProfiles, facilitatorProfiles };
};

const IntroSentRow = ({
  introduction,
  user,
  emailToProfile,
  companyUrlToProfile,
}: {
  introduction: IntroWithContactFacilitatorAndRequester;
  user: User;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
}) => {
  const { contactProfiles, requestProfiles, facilitatorProfiles } =
    getAllProfiles(introduction, emailToProfile, companyUrlToProfile);

  return (
    <>
      <TableRow key={introduction.id}>
        <TableCell className={"p-2"}>
          <RequesterBox
            intro={introduction}
            personExp={requestProfiles.personExp}
          />
        </TableCell>

        <TableCell className={"p-2"}>
          <ProspectBox
            contact={introduction.contact}
            personProfile={contactProfiles.personProfile}
            personExp={contactProfiles.personExp}
          />
        </TableCell>

        <TableCell className={"p-2"}>
          <CompanyBox
            companyProfile={contactProfiles.companyProfile}
            personExp={contactProfiles.personExp}
          />
        </TableCell>

        <TableCell className={"p-2"}>
          <FacilitatorBox
            user={introduction.facilitator}
            personExp={facilitatorProfiles.personExp}
          />
        </TableCell>

        <TableCell className={"p-2"}>
          <IntroStatusBadge introduction={introduction} />
        </TableCell>

        <TableCell className={"p-2"}>
          {user.id === introduction.facilitator.id && (
            <IntroOverviewSheet
              intro={introduction}
              user={user}
              emailToProfile={emailToProfile}
              companyUrlToProfile={companyUrlToProfile}
            />
          )}
        </TableCell>
      </TableRow>
    </>
  );
};
