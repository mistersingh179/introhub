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
  FacilitatorBox,
  getAllProfiles,
  IntroStatusBadge,
  ProspectBox,
  RequesterBox,
} from "@/app/dashboard/introductions/list/IntroTable";
import IntroApproveWithMessageForm from "@/app/dashboard/introductions/list/IntroApproveWithMessageForm";
import React, { Dispatch, SetStateAction } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import IntroUpdateWithMessagesForm from "@/app/dashboard/introductions/list/IntroUpdateWithMessagesForm";
import IntroCancelForm from "@/app/dashboard/introductions/list/IntroCancelForm";
import { Button } from "@/components/ui/button";

type IntroOverviewWithSavingProps = {
  user: User;
  intro: IntroWithContactFacilitatorAndRequester;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

const IntroOverviewWithSaving = (props: IntroOverviewWithSavingProps) => {
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
          <h2 className={"text-xl mb-2"}> About Facilitator </h2>
          <div className={"flex flex-row justify-around"}>
            <FacilitatorBox
              user={intro.facilitator}
              personExp={facilitatorProfiles.personExp}
            />
            <CompanyBox
              companyProfile={facilitatorProfiles.companyProfile}
              personExp={facilitatorProfiles.personExp}
            />
          </div>
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
          <IntroUpdateWithMessagesForm intro={intro} setOpen={setOpen} />
          <div className={"flex flex-row justify-end"}>
            <IntroCancelForm intro={intro} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default IntroOverviewWithSaving;
