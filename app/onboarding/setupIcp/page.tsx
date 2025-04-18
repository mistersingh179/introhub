import * as React from "react";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import Image from "next/image";
import Link from "next/link";
import variousProspectsImage from "@/app/onboarding/setupIcp/various-prospects.png";
import UpdateIcpForm from "@/app/dashboard/icp/UpdateIcpForm";
import { Button } from "@/components/ui/button";
import OnboardingLayout from "@/app/onboarding/OnboardingLayout";

type SearchParams = {
  groupName: string;
};

const setupIcp = async ({ searchParams }: { searchParams: SearchParams }) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
    include: {
      accounts: true,
    },
  });

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={5}
      title="Who are you looking to connect with?"
      description="Define your Ideal Customer Profile to help us find the right connections"
    >
      <div className="flex h-full">
        <div className="hidden sm:flex flex-col gap-4 justify-center items-center bg-gray-50 dark:bg-slate-900 p-4 w-1/2">
          <div className="flex flex-col gap-4 justify-center items-center p-4 2xl:px-10">
            <Image
              className={"w-1/2"}
              src={variousProspectsImage}
              alt={"sample prospects"}
            ></Image>
            <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl">
              Networking on autopilot
            </h1>
            <h4 className="scroll-m-20 text-xl font-normal tracking-tight">
              IntroHub automatically finds your ideal customers or partners and
              introduces you to them.
            </h4>
          </div>
        </div>
        <div className="flex flex-col gap-4 justify-center items-center p-4 w-full sm:w-1/2">
          <div className="flex flex-col gap-4 justify-center items-center p-4 2xl:px-10">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
              Who are you looking to connect with?
            </h1>
            <UpdateIcpForm icpDescription={user.icpDescription ?? undefined} />
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default setupIcp;
