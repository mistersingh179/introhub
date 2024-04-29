import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";

// @ts-ignore
import roleBasedEmailAddressesListTemp from "role-based-email-addresses";
import * as React from "react";
import getContactStats from "@/services/getContactStats";
import RefreshStatsForm from "@/app/dashboard/home/RefreshStatsForm";

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
  // const contactStats = await getContactStats();

  return (
    <>
      <div className={"flex flex-row items-center gap-2"}>
        <h1 className={"text-2xl"}>Home</h1>
        {/*<RefreshStatsForm />*/}
      </div>
      <div className={"flex flex-row gap-12"}>
        <div>Scope :</div>
        <ul className={'list-disc'}>
          {user.accounts[0].scope?.split(" ").map((x) => <li key={x}>{x}</li>)}
        </ul>
      </div>
      {/*<pre*/}
      {/*  className={*/}
      {/*    "bg-yellow-50 text-black dark:bg-yellow-950 dark:text-white my-4 break-all whitespace-pre-wrap"*/}
      {/*  }*/}
      {/*>*/}
      {/*  {JSON.stringify(user.accounts[0].scope, null, 2)}*/}
      {/*</pre>*/}
    </>
  );
}
