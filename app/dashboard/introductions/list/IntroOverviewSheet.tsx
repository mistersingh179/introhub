"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { User } from "@prisma/client";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import IntroOverview from "@/app/dashboard/introductions/list/IntroOverview";
import { useState } from "react";

type IntroOverviewSheetProps = {
  user: User;
  intro: IntroWithContactFacilitatorAndRequester;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
};

const IntroOverviewSheet = (props: IntroOverviewSheetProps) => {
  const { user, intro, emailToProfile, companyUrlToProfile } = props;
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className={"w-fit"}>See More</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[60%] md:max-w-[50%] lg:max-w-[40%]">
        {/*<SheetHeader>*/}
        {/*  <SheetTitle>Intro Overview</SheetTitle>*/}
        {/*  <SheetDescription>*/}
        {/*    Make changes to the message which your will be sending to the*/}
        {/*    prospect.*/}
        {/*  </SheetDescription>*/}
        {/*</SheetHeader>*/}
        <IntroOverview
          user={user}
          intro={intro}
          emailToProfile={emailToProfile}
          companyUrlToProfile={companyUrlToProfile}
          setOpen={setOpen}
        />
        {/*<SheetFooter>*/}
        {/*  <SheetClose asChild>*/}
        {/*    <Button type="submit">Save changes</Button>*/}
        {/*  </SheetClose>*/}
        {/*</SheetFooter>*/}
      </SheetContent>
    </Sheet>
  );
};

export default IntroOverviewSheet;
