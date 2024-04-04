import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import reservedEmailAddressesList from "reserved-email-addresses-list";

// @ts-ignore
import roleBasedEmailAddressesListTemp from "role-based-email-addresses";
import * as React from "react";
import HookExp from "@/app/dashboard/home/HookExp";

const roleBasedEmailAddressesList = roleBasedEmailAddressesListTemp as string[];

const reservedEmails = new Map(
  reservedEmailAddressesList.map((key) => [key, key]),
);

const roleEmails = new Map(
  roleBasedEmailAddressesList.map((key) => [key, key]),
);

export default async function Home() {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  return (
    <>
      <h1 className={"text-2xl"}>Home</h1>
      <HookExp />
      <pre
        className={
          "bg-yellow-50 text-black dark:bg-yellow-950 dark:text-white my-4"
        }
      >
        {JSON.stringify(session, null, 2)}
      </pre>
      <pre>{md5("hello world")}</pre>
    </>
  );
}
