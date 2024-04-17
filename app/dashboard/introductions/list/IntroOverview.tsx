import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { User } from "@prisma/client";
import {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import {
  CompanyBox,
  getAllProfiles,
  IntroStatusBadge,
  ProspectBox,
  RequesterBox,
} from "@/app/dashboard/introductions/list/IntroTable";
import IntroApproveWithMessageForm from "@/app/dashboard/introductions/list/IntroApproveWithMessageForm";
import { Dispatch, SetStateAction } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

type IntroOverviewProps = {
  user: User;
  intro: IntroWithContactFacilitatorAndRequester;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

const IntroOverview = (props: IntroOverviewProps) => {
  const { intro, user, emailToProfile, companyUrlToProfile, setOpen } = props;
  const { contactProfiles, requestProfiles, facilitatorProfiles } =
    getAllProfiles(intro, emailToProfile, companyUrlToProfile);

  return (
    <div className={"flex flex-col gap-4 h-full"}>
      <div className={"flex flex-row gap-4 items-center"}>
        <Mail />
        <h1 className={"text-2xl"}> Review Intro Request</h1>
        <IntroStatusBadge introduction={intro} />
      </div>
      <Separator />

      <ScrollArea className={"flex-grow"}>
        <div className={"flex flex-col gap-4"}>
          <h2 className={"text-xl mb-2"}> About Requester </h2>
          <div className={"flex flex-row justify-around"}>
            <RequesterBox intro={intro} personExp={requestProfiles.personExp} />
            <CompanyBox
              companyProfile={requestProfiles.companyProfile}
              personExp={requestProfiles.personExp}
            />
          </div>
          <p className={"my-2"}>{intro.messageForFacilitator}</p>
          <h2 className={"text-xl mb-2"}> About Prospect </h2>
          <div className={"flex flex-row justify-around"}>
            <ProspectBox
              contact={intro.contact}
              personExp={contactProfiles.personExp}
              personProfile={contactProfiles.personProfile}
            />
            <CompanyBox
              companyProfile={contactProfiles.companyProfile}
              personExp={contactProfiles.personExp}
            />
          </div>
          <h2 className={"text-xl mb-2"}> Message to Prospect </h2>
          <IntroApproveWithMessageForm intro={intro} setOpen={setOpen} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default IntroOverview;
