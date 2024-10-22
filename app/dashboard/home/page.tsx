import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { AlertCircle, Check } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// @ts-ignore
import roleBasedEmailAddressesListTemp from "role-based-email-addresses";
import * as React from "react";
import OnBoardingCard from "@/app/dashboard/home/OnBoardingCard";
import Link from "next/link";
import LogOutSimpleLink from "@/app/dashboard/home/LogOutSimpleLink";
import AutoProspectingDialog from "@/app/dashboard/AutoProspectingDialog";
import doWeHaveFullScope from "@/services/doWeHaveFullScope";

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
  const foundFullScope = doWeHaveFullScope(user.accounts);
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

      <AutoProspectingDialog
        agreedToAutoProspecting={user!.agreedToAutoProspecting}
      />

      <OnBoardingCard />

      {user.agreedToAutoProspecting && (
        <Alert variant="default">
          <Check className="h-8 w-8" />
          <AlertTitle className={"ml-8"}>
            Sit Back, Relax, and Await Introductions
          </AlertTitle>
          <AlertDescription className={"ml-8"}>
            We will auto prospect for you based on your ICP. Keep an eye out for
            intro emails, where you will be {"cc'd"} when a target prospect
            consents to an introduction. In the meantime, visit the{" "}
            <Link href={"/dashboard/prospects"} className={"underline"}>
              {"Prospects"}
            </Link>{" "}
            page to add filters and star more profiles.
          </AlertDescription>
        </Alert>
      )}

      {!user.agreedToAutoProspecting && (
        <Alert variant="destructive">
          <AlertCircle className="h-8 w-8" />
          <AlertTitle className={"ml-8"}>Account is OFF</AlertTitle>
          <AlertDescription className={"ml-8"}>
            Your IntroHub account is currently turned OFF. We will NOT prospect
            for you. We will NOT use your contacts to facilitate introduction
            for others.
          </AlertDescription>
        </Alert>
      )}

      {!user.unableToAutoProspect && (
        <Alert variant="default">
          <Check className="h-8 w-8" />
          <AlertTitle className={"ml-8"}>Your ICP is well defined</AlertTitle>
          <AlertDescription className={"ml-8"}>
            We are able to find prospects matching your ICP.
          </AlertDescription>
        </Alert>
      )}

      {user.unableToAutoProspect && (
        <Alert variant="destructive">
          <AlertCircle className="h-8 w-8" />
          <AlertTitle className={"ml-8"}>
            Auto Prospecting is Disabled
          </AlertTitle>
          <AlertDescription className={"ml-8"}>
            Please consider widening your ICP by starring more prospects and /
            or creating more Prospect filters.
          </AlertDescription>
        </Alert>
      )}

      {foundFullScope && (
        <Alert variant="default">
          <Check className="h-8 w-8" />
          <AlertTitle className={"ml-8"}>Your Account is Ready</AlertTitle>
          <AlertDescription className={"ml-8"}>
            Google permissions were found. {"You're"} ready to get and make
            intros.
          </AlertDescription>
        </Alert>
      )}

      {!foundFullScope && (
        <Alert variant="destructive">
          <AlertCircle className="h-8 w-8" />
          <AlertTitle className={"ml-8"}>Account Creation Error</AlertTitle>
          <AlertDescription className={"ml-8"}>
            You {"didn't"} grant us permission to access emails on your behalf.
            Please <LogOutSimpleLink />, log in, and grant the requested
            permissions.
          </AlertDescription>
        </Alert>
      )}

      {user.tokenIssue && (
        <Alert variant="destructive">
          <AlertCircle className="h-8 w-8" />
          <AlertTitle className={"ml-8"}>
            Google OAuth Token Issue Detected
          </AlertTitle>
          <AlertDescription className={"ml-8"}>
            We are unable to generate a Google Access Token for you. Please{" "}
            <LogOutSimpleLink /> and log back in.
          </AlertDescription>
        </Alert>
      )}

      {user.missingPersonalInfo && (
        <Alert variant="destructive">
          <AlertCircle className="h-8 w-8" />
          <AlertTitle className={"ml-8"}>
            Missing Profile Information
          </AlertTitle>
          <AlertDescription className={"ml-8"}>
            Please check your{" "}
            <Link href={"/dashboard/profile"} className={"underline"}>
              {"Profile"}
            </Link>
            . We are missing important information.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
