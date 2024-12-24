import { redirect } from "next/navigation";
import { PlatformGroupName } from "@/app/utils/constants";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import setupInitialMembership from "@/services/setupInitialMembership";

type SearchParams = { groupName?: string };

export default async function RootPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let { groupName } = searchParams;
  groupName = groupName || PlatformGroupName;

  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
    include: {
      accounts: true,
    },
  });

  if (groupName) {
    await setupInitialMembership(user, groupName.trim());
  }

  const url = user.agreedToAutoProspecting
    ? "/dashboard/home"
    : "onboarding/setupIcp";

  console.log("In root page redirect: ", url);
  redirect(url);
}
