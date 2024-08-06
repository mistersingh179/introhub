import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { AlertCircle, Check } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// @ts-ignore
import roleBasedEmailAddressesListTemp from "role-based-email-addresses";
import * as React from "react";
import Link from "next/link";

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

      <div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight my-2">
          On-boarding Check list
        </h4>
        <ul className={"list-disc ml-4"}>
          <li>
            <div className={"flex flex-row gap-2"}>
              <div className={"line-through"}>
                Log in with Google and provide Send & Metadata Permission
              </div>
              <div>✅</div>
            </div>
          </li>
          <li>
            Go to{" "}
            <Link href={"/dashboard/prospects"} className={"underline"}>
              {" "}
              {"Prospect's"}
            </Link>{" "}
            page and create a few filters which represent your ICP
          </li>
          <li>
            {" "}
            On the{" "}
            <Link href={"/dashboard/prospects"} className={"underline"}>
              {" "}
              {"Prospect's"}
            </Link>{" "}
            page star at least a few prospects whom you want to meet and
            represent your ICP
          </li>
          <li>Sit back & relax while we auto prospect for you.</li>
        </ul>
      </div>

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

      {/*<TestSheet />*/}

      {/*<div className={"flex flex-row gap-4 items-center"}>*/}
      {/*  <div className={"min-w-36"}>Access Token :</div>*/}
      {/*  <div className={'break-all'}>{user.accounts[0].access_token}</div>*/}
      {/*</div>*/}

      {/*<pre*/}
      {/*  className={*/}
      {/*    "bg-yellow-50 text-black dark:bg-yellow-950 dark:text-white my-4 break-all whitespace-pre-wrap"*/}
      {/*  }*/}
      {/*>*/}
      {/*  {JSON.stringify(user.accounts[0].scope, null, 2)}*/}
      {/*</pre>*/}
    </div>
  );
}
