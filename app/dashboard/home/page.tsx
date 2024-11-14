import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// @ts-ignore
import roleBasedEmailAddressesListTemp from "role-based-email-addresses";
import * as React from "react";
import Link from "next/link";
import LogOutSimpleLink from "@/app/dashboard/home/LogOutSimpleLink";
import AutoProspectingDialog from "@/app/dashboard/AutoProspectingDialog";
import doWeHaveFullScope from "@/services/doWeHaveFullScope";
import UserGaDataPush from "@/app/utils/UserGaDataPush";
import ExplanationToGetIcp from "@/app/dashboard/icp/ExplanationToGetIcp";
import UpdateIcpForm from "@/app/dashboard/icp/UpdateIcpForm";
import SampleProspectsMatchingIcp from "@/app/dashboard/icp/SampleProspectsMatchingIcp";
import getMatchingProspectsFromPinecone from "@/services/llm/getMatchingProspectsFromPinecone";
import getMatchingProspectsFromLlm from "@/services/llm/getMatchingProspectsFromLlm";
import FoundResultsAlert from "@/app/dashboard/icp/FoundResultsAlert";

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

  const k = 1000;
  const pineconeMatchedEmails = user.icpDescription
    ? await getMatchingProspectsFromPinecone(user.icpDescription, k)
    : [];

  const batchSize =
    pineconeMatchedEmails.length > 100 ? 100 : pineconeMatchedEmails.length;
  // const llmMatchedEmails = [];
  const llmMatchedEmails = await getMatchingProspectsFromLlm(
    user.icpDescription!,
    pineconeMatchedEmails.slice(0, batchSize),
  );

  const prospects = await prisma.contact.findMany({
    where: {
      email: {
        in: llmMatchedEmails,
      },
    },
  });
  console.log("prospects found: ", prospects.length);

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

      {/*<OnBoardingCard />*/}

      {/*{user.agreedToAutoProspecting && (*/}
      {/*  <Alert variant="default">*/}
      {/*    <Check className="h-8 w-8" />*/}
      {/*    <AlertTitle className="ml-8">*/}
      {/*      Relax and Await Introductions*/}
      {/*    </AlertTitle>*/}
      {/*    <AlertDescription className="ml-8">*/}
      {/*      We’ll auto-prospect based on your ICP. Look out for intro emails, as*/}
      {/*      {"you'll"} be {"cc'd"} when a target consents. Update your{" "}*/}
      {/*      <Link href="/dashboard/icp" className="underline">*/}
      {/*        ICP here*/}
      {/*      </Link>*/}
      {/*      .*/}
      {/*    </AlertDescription>*/}
      {/*  </Alert>*/}
      {/*)}*/}

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

      {/*{!user.unableToAutoProspect && (*/}
      {/*  <Alert variant="default">*/}
      {/*    <Check className="h-8 w-8" />*/}
      {/*    <AlertTitle className={"ml-8"}>Your ICP is well defined</AlertTitle>*/}
      {/*    <AlertDescription className={"ml-8"}>*/}
      {/*      We are able to find prospects matching your ICP.*/}
      {/*    </AlertDescription>*/}
      {/*  </Alert>*/}
      {/*)}*/}

      {user.unableToAutoProspect && (
        <Alert variant="destructive">
          <AlertCircle className="h-8 w-8" />
          <AlertTitle className="ml-8">Auto-Prospecting Unavailable</AlertTitle>
          <AlertDescription className="ml-8">
            We’ll continue attempting auto-prospecting for you daily. Meanwhile,
            consider broadening your{" "}
            <Link href={"/dashboard/icp"} className="underline">
              ICP
            </Link>{" "}
            description or{" "}
            <Link href={"/dashboard/prospects"} className="underline">
              starring
            </Link>{" "}
            more prospects.
          </AlertDescription>
        </Alert>
      )}

      {/*{foundFullScope && (*/}
      {/*  <Alert variant="default">*/}
      {/*    <Check className="h-8 w-8" />*/}
      {/*    <AlertTitle className={"ml-8"}>Your Account is Ready</AlertTitle>*/}
      {/*    <AlertDescription className={"ml-8"}>*/}
      {/*      Google permissions were found. {"You're"} ready to get and make*/}
      {/*      intros.*/}
      {/*    </AlertDescription>*/}
      {/*  </Alert>*/}
      {/*)}*/}

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

      {process.env.NODE_ENV === "production" && (
        <UserGaDataPush user={user} pageTitle={"Home"} />
      )}

      {prospects.length > 0 && (
        <FoundResultsAlert
          foundCount={`${pineconeMatchedEmails.length}${pineconeMatchedEmails.length === k ? "+" : ""}`}
        />
      )}

      <ExplanationToGetIcp />

      <UpdateIcpForm icpDescription={user.icpDescription ?? undefined} />

      <SampleProspectsMatchingIcp prospects={prospects} />
    </div>
  );
}
