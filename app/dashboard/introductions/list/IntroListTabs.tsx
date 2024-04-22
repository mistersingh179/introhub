"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntroTable from "@/app/dashboard/introductions/list/IntroTable";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { User } from "@prisma/client";
import {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import { usePathname, useSearchParams } from "next/navigation";

type IntroListTabsProps = {
  introsSent: IntroWithContactFacilitatorAndRequester[];
  pendingCreditsCount: number;
  introsReceived: IntroWithContactFacilitatorAndRequester[];
  pendingApprovalCount: number;
  user: User;
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
};
const IntroListTabs = (props: IntroListTabsProps) => {
  const {
    introsSent,
    introsReceived,
    user,
    emailToProfile,
    companyUrlToProfile,
    pendingApprovalCount,
    pendingCreditsCount,
  } = props;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const selectedTab = searchParams.get("selectedTab") ?? "received";

  const tabChangeHandler = (newValue: string) => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set("selectedTab", newValue);
    const updatedUrl = `${pathname}?${updatedSearchParams.toString()}`;
    history.replaceState({}, "", updatedUrl);
  };

  return (
    <Tabs
      onValueChange={tabChangeHandler}
      defaultValue={selectedTab}
      className={"mt-4"}
    >
      <TabsList>
        <TabsTrigger value="sent">
          Intros Sent {pendingCreditsCount ? `(${pendingCreditsCount})` : ""}
        </TabsTrigger>
        <TabsTrigger value="received">
          Intros Received{" "}
          {pendingApprovalCount ? `(${pendingApprovalCount})` : ""}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="sent">
        <IntroTable
          introductions={introsSent}
          user={user}
          emailToProfile={emailToProfile}
          companyUrlToProfile={companyUrlToProfile}
          showRequester={false}
        />
      </TabsContent>
      <TabsContent value="received">
        <IntroTable
          introductions={introsReceived}
          user={user}
          emailToProfile={emailToProfile}
          companyUrlToProfile={companyUrlToProfile}
          showFacilitator={false}
        />
      </TabsContent>
    </Tabs>
  );
};

export default IntroListTabs;
