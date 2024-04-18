"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { User } from "@prisma/client";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import IntroOverviewWithApproving from "@/app/dashboard/introductions/list/IntroOverviewWithApproving";
import { useState } from "react";
import IntroOverviewWithSaving from "@/app/dashboard/introductions/list/IntroOverviewWithSaving";

type IntroApproveWithApprovingSheetProps = {
  user: User;
  intro: IntroWithContactFacilitatorAndRequester;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
};

const IntroOverviewWithApprovingSheet = (
  props: IntroApproveWithApprovingSheetProps,
) => {
  const { user, intro, emailToProfile, companyUrlToProfile } = props;
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className={"w-fit"}>See More</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[60%] md:max-w-[50%] lg:max-w-[40%]">
        <IntroOverviewWithApproving
          user={user}
          intro={intro}
          emailToProfile={emailToProfile}
          companyUrlToProfile={companyUrlToProfile}
          setOpen={setOpen}
        />
      </SheetContent>
    </Sheet>
  );
};

export default IntroOverviewWithApprovingSheet;
