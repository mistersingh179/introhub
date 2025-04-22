import * as React from "react";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import Image from "next/image";
import Link from "next/link";
import healthyNetworkingImage from "@/app/onboarding/finishOnboarding/48.svg";
import AcceptAutoProspectingForm from "@/app/onboarding/finishOnboarding/AcceptAutoProspectingForm";
import OnboardingLayout from "@/app/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";

const finishOnboarding = async () => {
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
      currentStep={5}
      totalSteps={5}
      title="You're Almost Done!"
      description="Review and activate your IntroHub account to start networking on autopilot."
    >
      <div className="flex h-full">
        <div className="hidden sm:flex flex-col gap-4 justify-center items-center bg-gray-50 dark:bg-slate-900 p-4 w-1/2">
          <div className="flex flex-col gap-4 justify-center items-center p-4 2xl:px-10">
            <Image className={'w-2/3'} src={healthyNetworkingImage} alt={"healthy networking"}></Image>
            <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl">
              Healthy Networking
            </h1>
            <h4 className="scroll-m-20 text-xl font-normal tracking-tight w-4/5 text-center">
              Intro requests to the same contacts are limited to once every 90
              days. This ensures {"you're"} not asking the same person over and
              over again.
            </h4>
          </div>
        </div>
        <div className="flex flex-col gap-4 justify-center items-center p-4 w-full sm:w-1/2">
          <div className="flex flex-col gap-4 justify-center items-start p-4 2xl:px-10">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
              {"We're"} Mapping Your Network to Unlock Value
            </h1>
            <p className="text-xl text-muted-foreground">
              {"We're"} identifying people in your network who may benefit from
              an introduction.
            </p>
            <p className="text-xl text-muted-foreground mt-4">
              {"Don't"} worry – {"you're"} in control. Before any introduction
              request is sent from your email, {"you'll"} have 7 days to review
              and cancel it.
            </p>
            <p className="text-xl text-muted-foreground mt-4 mb-8">
              IntroHub helps you stay proactive. If an intro {"isn't"} canceled,
              the system will request your {"contact's"} consent for the
              introduction.
            </p>

            <div className={"w-full"}>
              <AcceptAutoProspectingForm />
            </div>
            
            <div className="flex justify-start mt-6 w-full">
              <Button variant="outline" asChild>
                <Link href="/onboarding/experienceSetup">Back</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default finishOnboarding;
