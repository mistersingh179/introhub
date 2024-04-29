import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { AlertCircle, Check } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// @ts-ignore
import roleBasedEmailAddressesListTemp from "role-based-email-addresses";
import * as React from "react";
import RefreshScopesForm from "@/app/dashboard/home/RefreshScopesForm";

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
  const scopes = user.accounts?.[0]?.scope?.split(" ") ?? [];
  const sendScope = `https://www.googleapis.com/auth/gmail.send`;
  const foundSendScope = !!scopes.find((val) => val === sendScope);
  // const contactStats = await getContactStats();

  return (
    <div className={"flex flex-col gap-8"}>
      <div className={"flex flex-row items-center gap-2"}>
        <h1 className={"text-2xl mt-6"}>Home</h1>
        {/*<RefreshStatsForm />*/}
      </div>
      {foundSendScope && (
        <Alert variant="default">
          <Check className="h-8 w-8"/>
          <AlertTitle className={"ml-8"}>Permissions Success</AlertTitle>
          <AlertDescription className={"ml-8"}>
            Send Permission was found. Good to go!
          </AlertDescription>
        </Alert>
      )}

      {!foundSendScope && (
        <Alert variant="destructive">
          <AlertCircle className="h-8 w-8"/>
          <AlertTitle className={"ml-8"}>Error</AlertTitle>
          <AlertDescription className={"ml-8"}>
            Unable to find Send Permission. You need to Log-out, and log back in
            while granting permissions.
          </AlertDescription>
        </Alert>
      )}
      <div className={"flex flex-row gap-12"}>
        <div className={"min-w-36 flex flex-row gap-4 items-center"}>Scope : <RefreshScopesForm /> </div>
        <ul className={"list-disc"}>
          {scopes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
      <div className={"flex flex-row gap-12"}>
        <div className={"min-w-36"}>User Id :</div>
        <div>
          {user.id}
        </div>
      </div>
      <div className={"flex flex-row gap-12"}>
        <div className={"min-w-36"}>Name / Email :</div>
        <div>
          {user.name} / {user.email}
        </div>
      </div>
      <div className={"flex flex-row gap-12 items-center"}>
        <div className={"min-w-36"}>Access Token :</div>
        <div className={'break-all'}>{user.accounts[0].access_token}</div>
      </div>

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
