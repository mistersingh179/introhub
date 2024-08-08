import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { AlertCircle, Check } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// @ts-ignore
import roleBasedEmailAddressesListTemp from "role-based-email-addresses";
import * as React from "react";
import OnBoardingCard from "@/app/dashboard/home/OnBoardingCard";
import foo from "@/services/foo";

export default async function Home() {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
    include: {
      accounts: true,
    },
  });
  const googleAccount = user.accounts?.find((a) => a.provider === "google");
  const scopes = googleAccount?.scope?.split(" ") ?? [];
  const sendScope = `https://www.googleapis.com/auth/gmail.send`;
  const foundSendScope = !!scopes.find((val) => val === sendScope);
  // const contactStats = await getContactStats();

  // const jobTitlesWithCount = await prisma.personExperience.groupBy({
  //   by: "jobTitle",
  //   _count: true,
  // });
  // const jobTitles = jobTitlesWithCount
  //   .filter((rec) => rec.jobTitle)
  //   .map((rec) => rec.jobTitle as string);
  //
  // const jobTitleOptions = jobTitles.map((jobTitle) => {
  //   return {
  //     value: jobTitle,
  //     label: jobTitle,
  //   };
  // });
  //
  // const options = [
  //   { value: "chocolate", label: "Chocolate" },
  //   { value: "strawberry", label: "Strawberry" },
  //   { value: "vanilla", label: "Vanilla" },
  // ];

  return (
    <div className={"flex flex-col gap-8"}>
      <div className={"flex flex-row items-center gap-2"}>
        <h1 className={"text-2xl mt-6"}>Home</h1>
        {/*<RefreshStatsForm />*/}
      </div>

      <OnBoardingCard />

      {foundSendScope && (
        <Alert variant="default">
          <Check className="h-8 w-8" />
          <AlertTitle className={"ml-8"}>Permissions Success</AlertTitle>
          <AlertDescription className={"ml-8"}>
            Google Send Permission was found. Good to go!
          </AlertDescription>
        </Alert>
      )}

      {!foundSendScope && (
        <Alert variant="destructive">
          <AlertCircle className="h-8 w-8" />
          <AlertTitle className={"ml-8"}>Error</AlertTitle>
          <AlertDescription className={"ml-8"}>
            Unable to find Google Send Permission. You need to Log-out, and log
            back in while granting permissions.
          </AlertDescription>
        </Alert>
      )}

      {user.unableToAutoProspect && (
        <Alert variant="destructive">
          <AlertCircle className="h-8 w-8" />
          <AlertTitle className={"ml-8"}>Unable to Auto Prospect</AlertTitle>
          <AlertDescription className={"ml-8"}>
            Please consider widening your ICP by starring more prospects and/or
            creating more prospect filters.
          </AlertDescription>
        </Alert>
      )}

      {!user.unableToAutoProspect && (
        <Alert variant="default">
          <Check className="h-8 w-8" />
          <AlertTitle className={"ml-8"}>
            Auto Prospecting is working for you !
          </AlertTitle>
          <AlertDescription className={"ml-8"}>
            We are able to automatically prospect for you based on your ICP as
            inferred from the prospects you have starred and filters you have
            created.
          </AlertDescription>
        </Alert>
      )}

      {user.missingPersonalInfo && (
        <Alert variant="destructive">
          <AlertCircle className="h-8 w-8" />
          <AlertTitle className={"ml-8"}>Missing Profile</AlertTitle>
          <AlertDescription className={"ml-8"}>
            Please check your profile. We are missing critical data.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
