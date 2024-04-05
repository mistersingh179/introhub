import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import reservedEmailAddressesList from "reserved-email-addresses-list";

// @ts-ignore
import roleBasedEmailAddressesListTemp from "role-based-email-addresses";
import md5 from "md5";
import * as React from "react";
import HookExp from "@/app/dashboard/home/HookExp";
import getContactStats from "@/services/getContactStats";

export default async function Home() {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  const contactStats = await getContactStats();

  return (
    <>
      <h1 className={"text-2xl"}>Home</h1>
      <pre
        className={
          "bg-yellow-50 text-black dark:bg-yellow-950 dark:text-white my-4"
        }
      >
        {JSON.stringify(contactStats, null, 2)}
      </pre>
    </>
  );
}
