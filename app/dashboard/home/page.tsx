import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { AlertCircle, Check } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// @ts-ignore
import roleBasedEmailAddressesListTemp from "role-based-email-addresses";
import * as React from "react";
import RefreshScopesForm from "@/app/dashboard/home/RefreshScopesForm";
import OnBoardUserForm from "@/app/dashboard/home/OnBoardUserForm";
import ProspectsCountForm from "@/app/dashboard/home/ProspectsCountForm";
import ShowChildren from "@/components/ShowChildren";

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

  const emailsCount = await prisma.message.count({
    where: {
      userId: user.id,
    },
  });
  const contactsCount = await prisma.contact.count({
    where: {
      userId: user.id,
    },
  });

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

      <iframe
        src="https://drive.google.com/file/d/1NeWsPDQktcs23Qttcen46N1rumXKwKc9/preview"
        allow="autoplay"
        className="rounded-xl mx-auto w-full aspect-video"
      ></iframe>

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

      <div className={"flex flex-col gap-2 md:flex-row items-center"}>
        <div className={"min-w-36 flex flex-row gap-4 items-center"}>
          Google Scope : <RefreshScopesForm />{" "}
        </div>
        <ShowChildren showIt={scopes.length > 0}>
          <ul className={"list-disc ml-4"}>
            {scopes.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </ShowChildren>
        <ShowChildren showIt={scopes.length == 0}>
          None
        </ShowChildren>
      </div>
      <div className={"flex flex-col gap-2 md:flex-row"}>
        <div className={"min-w-36"}>User Id :</div>
        <div>{user.id}</div>
      </div>
      <div className={"flex flex-col gap-2 md:flex-row"}>
        <div className={"min-w-36"}>Credits:</div>
        <div>{user.credits}</div>
      </div>
      <div className={"flex flex-col gap-2 md:flex-row"}>
        <div className={"min-w-36"}>Name / Email :</div>
        <div>
          {user.name} / {user.email}
        </div>
      </div>
      <div className={"flex flex-col gap-2 md:flex-row"}>
        <div className={"min-w-36"}>Count:</div>
        <ul className={"list-disc space-y-2 ml-4"}>
          <li>Contacts: {contactsCount}</li>
          <li>Emails: {emailsCount}</li>
          <li>
            <OnBoardUserForm />
          </li>
          <li>
            <ProspectsCountForm />
          </li>
        </ul>
      </div>

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
