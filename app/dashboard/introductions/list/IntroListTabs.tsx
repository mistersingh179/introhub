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
import Typography from "@/components/Typography";

type IntroListTabsProps = {
  introsReceivedAndPendingMyApproval: IntroWithContactFacilitatorAndRequester[];
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
    introsReceivedAndPendingMyApproval,
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
    <Tabs onValueChange={tabChangeHandler} defaultValue={selectedTab}>
      <TabsList>
        <TabsTrigger value="sent-pending-approval">
          Action Required{" "}
          {pendingApprovalCount ? `(${pendingApprovalCount})` : ""}
        </TabsTrigger>
        <TabsTrigger value="sent">
          Requested {pendingCreditsCount ? `(${pendingCreditsCount})` : ""}
        </TabsTrigger>
        <TabsTrigger value="received">
          Facilitating{" "}
          {pendingApprovalCount ? `(${pendingApprovalCount})` : ""}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="sent-pending-approval">

        <div>
          <Typography
            affects={"lead"}
            variant={"p"}
            className={"mt-4 mx-2 text-center"}
          >
            These introductions are {" "}
            <span className={"font-semibold"}>pending your approval</span>.
            Please review and decide.
          </Typography>
          <IntroTable
            introductions={introsReceivedAndPendingMyApproval}
            user={user}
            emailToProfile={emailToProfile}
            companyUrlToProfile={companyUrlToProfile}
            showFacilitator={false}
          />
        </div>
      </TabsContent>
      <TabsContent value="sent">
        <div>
          <Typography
            affects={"lead"}
            variant={"p"}
            className={"mt-4 mx-2 text-center"}
          >
            You are the <span className={"font-semibold"}>requester</span> of
            all these introductions. Approved ones are emailed out with you{" "}
            {`cc'ed`}.
          </Typography>
          <IntroTable
            introductions={introsSent}
            user={user}
            emailToProfile={emailToProfile}
            companyUrlToProfile={companyUrlToProfile}
            showRequester={false}
          />
        </div>
      </TabsContent>
      <TabsContent value="received">
        <div>
          <Typography
            affects={"lead"}
            variant={"p"}
            className={"mt-4 mx-2 text-center"}
          >
            You are the <span className={"font-semibold"}>facilitator</span> of
            all these introductions. Approving them earns you credits.
          </Typography>
          <IntroTable
            introductions={introsReceived}
            user={user}
            emailToProfile={emailToProfile}
            companyUrlToProfile={companyUrlToProfile}
            showFacilitator={false}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default IntroListTabs;
