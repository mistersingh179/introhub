import React from "react";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import getProfiles from "@/services/getProfiles";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import OnboardingLayout from "@/app/onboarding/OnboardingLayout";
import EditableExperienceForm from "@/app/dashboard/profile/EditableExperienceForm";
import experienceSetupImage from "@/app/onboarding/experienceSetup/27.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ExperienceSetup() {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  const email = user.email!;
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles([email]);
  const profiles = getProfiles(email, emailToProfile, companyUrlToProfile);

  // Calculate if the experience information is complete enough to proceed
  const hasExperienceInfo = 
    profiles.personExp.jobTitle && 
    profiles.personExp.companyLinkedInUrl;

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={5}
      title="Tell Us About Your Work"
      description="Tell us about your current role to help us find relevant connections."
    >
      <div className="flex h-full">
        <div className="hidden sm:flex flex-col gap-4 justify-center items-center bg-gray-50 dark:bg-slate-900 p-4 w-1/2">
          <div className="flex flex-col gap-4 justify-center items-center p-4 2xl:px-10">
          <Image
              src={experienceSetupImage}
              alt="sample prospects"
              className={"w-1/2"}
            />
            <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl text-center">
              Your Professional Experience
            </h1>
            <h4 className="scroll-m-20 text-xl font-normal tracking-tight text-center w-4/5">
              We&apos;ll use this info to match you with relevant connections.
            </h4>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 justify-center items-stretch p-4 w-full sm:w-1/2">
          <div className="flex flex-col gap-4 p-4 w-full 2xl:px-10">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
              Tell Us About Your Work
            </h1>
            <div className="w-full">
              {profiles.personExp.id ? (
                <EditableExperienceForm 
                  experience={profiles.personExp}
                  hideDefaultButton={true}
                  onSuccess="/onboarding/finishOnboarding"
                  customButtonLabel="Continue"
                />
              ) : (
                <EditableExperienceForm 
                  isNewExperience={true} 
                  hideDefaultButton={true}
                  onSuccess="/onboarding/finishOnboarding"
                  customButtonLabel="Continue"
                />
              )}
            </div>

            <div className="flex justify-between mt-6 w-full">
              <Button variant="outline" className="py-6" asChild>
                <Link href="/onboarding/profileSetup">Back</Link>
              </Button>
              
              <Button 
                className="py-6"
                variant="branded"
                form="experience-form"
                type="submit"
                disabled={!hasExperienceInfo}
                title={hasExperienceInfo ? "" : "Please complete your work experience information"}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
} 