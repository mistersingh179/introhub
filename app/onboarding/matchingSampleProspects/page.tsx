import * as React from "react";
import { Suspense } from "react";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import Image from "next/image";
import matchingSampleProspectsImage from "@/app/onboarding/matchingSampleProspects/matching-prospects.png";
import { Button } from "@/components/ui/button";
import SampleProspectsMatchingIcp from "@/app/dashboard/icp/SampleProspectsMatchingIcp";
import Link from "next/link";
import SampleProspectsMatchingIcpFallback from "@/app/dashboard/icp/SampleProspectsMatchingIcpFallback";
import OnboardingLayout from "@/app/onboarding/OnboardingLayout";

const matchingSampleProspects = async () => {
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
      currentStep={2}
      totalSteps={5}
      title="Do these look like your ideal matches?"
      description="We've matched your description to our network. If these look like the right people, you're ready to proceed."
    >
      <div className="flex h-full">
        {/* Left Section */}
        <div className="hidden sm:flex flex-col gap-4 justify-center items-center bg-gray-50 dark:bg-slate-900 p-4 w-1/2">
          <div className="flex flex-col gap-4 justify-center items-center p-4 2xl:px-10">
            <Image
              src={matchingSampleProspectsImage}
              alt="sample prospects"
              className={"w-1/3"}
            />
            <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl">
              Content-Based
            </h1>
            <h4 className="scroll-m-20 text-xl font-normal tracking-tight">
              We only connect you with people {"who've"} agreed to meet you,
              ensuring stronger and more meaningful introductions.
            </h4>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-4 justify-center items-center p-4 w-full sm:w-1/2">
          <div className="flex flex-col gap-4 justify-center items-center p-4 2xl:px-10">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
              Do these look like your ideal matches?
            </h1>
            <p className="text-xl text-muted-foreground">
              {"We've"} matched your description to our network. If these look
              like the right people, {"you're"} ready to proceed. If not, you
              can update your ICP and try again.
            </p>

            <div className="w-full max-h-[50vh] overflow-y-auto">
              <Suspense fallback={<SampleProspectsMatchingIcpFallback />}>
                <SampleProspectsMatchingIcp />
              </Suspense>
            </div>

            <div className="flex flex-col sm:flex-row gap-10 w-full mt-6">
              <Button asChild variant="outline" className="flex-1 py-6">
                <Link href="/onboarding/setupIcp">Not Quite - Refine ICP</Link>
              </Button>
              <Button asChild variant="branded" className="flex-1 py-6">
                <Link href="/onboarding/profileSetup">
                  Yes, These are My Matches
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default matchingSampleProspects;
