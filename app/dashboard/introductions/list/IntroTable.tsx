import * as React from "react";
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
  PersonProfileWithExp,
} from "@/services/getEmailAndCompanyUrlProfiles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildS3ImageUrl, getS3Url } from "@/lib/url";
import { getInitials } from "@/app/dashboard/UserProfileImageNav";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import LinkWithExternalIcon from "@/components/LinkWithExternalIcon";
import ShowChildren from "@/components/ShowChildren";
import FacilitatorBox from "@/components/FacilitatorBox";
import getAllProfiles from "@/services/getAllProfiles";
import { userProfileS3DirName } from "@/app/utils/constants";
import { format, formatDistance, subDays } from "date-fns";
import CancelIntroDialog from "@/app/dashboard/introductions/pendingQueue/CancelIntroDialog";

const IntroTable = ({
  introductions,
  user,
  emailToProfile,
  companyUrlToProfile,
  showRequester = true,
  showFacilitator = true,
  showPagination = true,
  showCaption = true,
  showHeader = true,
  showCancel = false,
}: {
  introductions: IntroWithContactFacilitatorAndRequester[];
  user: User;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
  showRequester?: boolean;
  showFacilitator?: boolean;
  showPagination?: boolean;
  showCaption?: boolean;
  showHeader?: boolean;
  showCancel?: boolean;
}) => {
  return (
    <>
      <Table>
        {showCaption && <TableCaption>Introductions</TableCaption>}
        {showHeader && (
          <TableHeader>
            <TableRow>
              <TableHead className={"p-2"}>Prospect</TableHead>
              <TableHead className={"p-2"}>
                {showRequester && <>Requester</>}
                {showFacilitator && <>Facilitator</>}
              </TableHead>
              {showCancel && <TableHead className={"p-2"}></TableHead>}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {introductions.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className={"text-center"}>
                No pending Intros
              </TableCell>
            </TableRow>
          )}
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
                showCancel={showCancel}
              />
            );
          })}
        </TableBody>
        {showPagination && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>
                <MyPagination />
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </>
  );
};

export default IntroTable;

export const UserAvatar = ({ user }: { user: User }) => {
  return (
    <Avatar className={"h-8 w-8"}>
      <AvatarImage
        src={
          (getS3Url(userProfileS3DirName, user.profileImageName ?? "") ||
            user.image) ??
          ""
        }
        title={user.name ?? ""}
      />
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
  if (!personProfile?.fullName) {
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
            <Badge variant={"secondary"} className={"text-center"}>
              <div>{introduction.status}</div>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side={"right"}
          sideOffset={10}
          className={"sm:max-w-sm md:max-w-xl"}
        >
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
  if (!personProfile?.linkedInUrl || !personProfile?.fullName) {
    return <></>;
  }

  return (
    <div className={"flex flex-row gap-4 items-center"}>
      <ProspsectAvatar prospect={contact} personProfile={personProfile} />
      <div className={"flex flex-col gap-2"}>
        <div>
          <Link href={`/dashboard/prospects/${contact.id}`}>
            {personProfile?.fullName ?? "-"}
          </Link>{" "}
        </div>
        <p className={"text-muted-foreground"}>{personExp.jobTitle} </p>
        <ShowChildren showIt={showLinkedInUrls}>
          <LinkWithExternalIcon href={personProfile?.linkedInUrl! ?? "-"} />
        </ShowChildren>
        {process.env.NODE_ENV === "development" ? contact.email : ""}
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
  personProfile: PersonProfileWithExp;
  personExp: PersonExperience;
  companyProfile: CompanyProfileWithCategories;
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
  showCancel,
}: {
  introduction: IntroWithContactFacilitatorAndRequester;
  user: User;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
  showRequester: boolean;
  showFacilitator: boolean;
  showCancel: boolean;
}) => {
  const { contactProfiles, requestProfiles, facilitatorProfiles } =
    getAllProfiles(introduction, emailToProfile, companyUrlToProfile);

  return (
    <>
      <TableRow className={""} key={introduction.id}>
        <TableCell className={"p-2 w-1/3"}>
          <div className={"flex flex-col gap-4 overflow-hidden text-ellipsis"}>
            <ProspectBox
              contact={introduction.contact}
              personProfile={contactProfiles.personProfile}
              personExp={contactProfiles.personExp}
            />
            <CompanyBox
              companyProfile={contactProfiles.companyProfile}
              personExp={contactProfiles.personExp}
            />
          </div>
        </TableCell>

        <TableCell className={"p-2 w-1/3"}>
          <div className={"flex flex-col gap-4"}>
            {showRequester && (
              <RequesterBox
                intro={introduction}
                personExp={requestProfiles.personExp}
              />
            )}

            {showFacilitator && (
              <FacilitatorBox
                user={introduction.facilitator}
                personExp={facilitatorProfiles.personExp}
              />
            )}

            <div className={"w-fit"}>
              <IntroStatusBadge introduction={introduction} />
            </div>
          </div>
        </TableCell>

        {showCancel && (
          <TableCell>
            <div className={"flex flex-col gap-4"}>
              <div>Generated At: {format(introduction.createdAt, "PPP")}</div>
              <div>
                Hold Ends:{" "}
                {formatDistance(introduction.createdAt, subDays(new Date(), 7), {
                  addSuffix: true
                })}
              </div>
              <CancelIntroDialog intro={introduction} />
            </div>
          </TableCell>
        )}
      </TableRow>
    </>
  );
};
