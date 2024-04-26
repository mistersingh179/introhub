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
  CompanyProfileWithCategories,
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildS3ImageUrl } from "@/lib/url";
import { getInitials } from "@/app/dashboard/UserProfileImageNav";
import { Badge } from "@/components/ui/badge";
import IntroOverviewWithApprovingSheet from "@/app/dashboard/introductions/list/IntroOverviewWithApprovingSheet";
import Link from "next/link";
import getClosestPersonExp from "@/services/helpers/getClosestPersonExp";
import IntroOverviewWithSavingSheet from "./IntroOverviewWithSavingSheet";
import LinkWithExternalIcon from "@/components/LinkWithExternalIcon";
import ShowChildren from "@/components/ShowChildren";
import FacilitatorBox from "@/components/FacilitatorBox";

const IntroTable = ({
  introductions,
  user,
  emailToProfile,
  companyUrlToProfile,
  showRequester = true,
  showFacilitator = true,
}: {
  introductions: IntroWithContactFacilitatorAndRequester[];
  user: User;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
  showRequester?: boolean;
  showFacilitator?: boolean;
}) => {
  return (
    <>
      <Table>
        <TableCaption>Introductions</TableCaption>
        <TableHeader>
          <TableRow>
            {showRequester && (
              <TableHead className={"p-2"}>Requester</TableHead>
            )}
            <TableHead className={"p-2"}>Prospect</TableHead>
            <TableHead className={"p-2"}>Organization</TableHead>
            {showFacilitator && (
              <TableHead className={"p-2"}>Facilitating Person</TableHead>
            )}
            <TableHead className={"p-2"}>Status</TableHead>
            <TableHead className={"p-2"}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {introductions.map((introduction) => {
            return (
              <IntroRow
                key={introduction.id}
                introduction={introduction}
                user={user}
                emailToProfile={emailToProfile}
                companyUrlToProfile={companyUrlToProfile}
                showRequester={showRequester}
                showFacilitator={showFacilitator}
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
            <Badge variant={"default"} className={"text-center"}>
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
        {personExp?.jobTitle && (
          <p className={"text-muted-foreground"}>{personExp?.jobTitle}</p>
        )}
      </div>
    </div>
  );
};


export const ProspectBox = ({
  contact,
  personProfile,
  personExp,
  showLinkedInUrls = false,
}: {
  contact: Contact;
  personProfile: PersonProfile;
  personExp: PersonExperience;
  showLinkedInUrls?: boolean;
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
        <ShowChildren showIt={showLinkedInUrls}>
          <LinkWithExternalIcon href={personProfile.linkedInUrl!} />
        </ShowChildren>
      </div>
    </div>
  );
};

export const CompanyBox = ({
  companyProfile,
  personExp,
  showLinkedInUrls = false,
}: {
  companyProfile: CompanyProfile;
  personExp: PersonExperience;
  showLinkedInUrls?: boolean;
}) => {
  return (
    <div className={"flex flex-row gap-4 items-center"}>
      <CompanyLogo companyProfile={companyProfile} personExp={personExp} />
      <div className={"flex flex-col gap-2"}>
        <div>{personExp.companyName} </div>
        <p className={"text-muted-foreground"}>{companyProfile.industry}</p>
        <ShowChildren showIt={showLinkedInUrls}>
          <LinkWithExternalIcon href={personExp.companyLinkedInUrl} />
        </ShowChildren>
      </div>
    </div>
  );
};

export type Profiles = {
  personProfile: PersonProfile;
  personExp: PersonExperience;
  companyProfile: CompanyProfileWithCategories;
};

export const getProfiles = (
  email: string,
  emailToProfile: EmailToProfile,
  companyUrlToProfile: CompanyUrlToProfile,
): Profiles => {
  const personProfile = emailToProfile[email];
  const personExp = (getClosestPersonExp(
    email,
    emailToProfile,
    companyUrlToProfile,
  ) ?? {}) as PersonExperience;

  // personProfile?.personExperiences?.[0] ?? {};

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

export const getCategoryNames = (
  companyProfile: CompanyProfileWithCategories,
) => {
  return companyProfile.categories.map((x) => x.category.name);
};

const IntroRow = ({
  introduction,
  user,
  emailToProfile,
  companyUrlToProfile,
  showRequester,
  showFacilitator,
}: {
  introduction: IntroWithContactFacilitatorAndRequester;
  user: User;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
  showRequester: boolean;
  showFacilitator: boolean;
}) => {
  const { contactProfiles, requestProfiles, facilitatorProfiles } =
    getAllProfiles(introduction, emailToProfile, companyUrlToProfile);

  return (
    <>
      <TableRow key={introduction.id}>
        {showRequester && (
          <TableCell className={"p-2"}>
            <RequesterBox
              intro={introduction}
              personExp={requestProfiles.personExp}
            />
          </TableCell>
        )}

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

        {showFacilitator && (
          <TableCell className={"p-2"}>
            <FacilitatorBox
              user={introduction.facilitator}
              personExp={facilitatorProfiles.personExp}
            />
          </TableCell>
        )}

        <TableCell className={"p-2"}>
          <IntroStatusBadge introduction={introduction} />
        </TableCell>

        <TableCell className={"p-2"}>
          {user.id === introduction.facilitator.id && (
            <IntroOverviewWithApprovingSheet
              intro={introduction}
              user={user}
              emailToProfile={emailToProfile}
              companyUrlToProfile={companyUrlToProfile}
            />
          )}

          {user.id === introduction.requester.id && (
            <IntroOverviewWithSavingSheet
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
