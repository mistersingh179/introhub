import ProfileImageForm from "@/app/dashboard/profile/ProfileImageForm";
import React from "react";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import getProfiles from "@/services/getProfiles";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import LinkWithExternalIcon from "@/components/LinkWithExternalIcon";
import RefreshScopesForm from "@/app/dashboard/home/RefreshScopesForm";
import ShowChildren from "@/components/ShowChildren";
import { Badge } from "@/components/ui/badge";
import ProfileStatusUpdateForm from "@/app/dashboard/profile/ProfileStatusUpdateForm";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import EditableProfileForm from "./EditableProfileForm";
import EditableExperienceForm from "./EditableExperienceForm";
import { Edit, Plus } from "lucide-react";
import ProfileCompletionIndicator from "@/app/components/ProfileCompletionIndicator";
import ProfileTabs from "./ProfileTabs";

export default async function Profile({ 
  searchParams 
}: { 
  searchParams: { tab?: string } 
}) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
    include: {
      accounts: true,
    },
  });

  const email = user.email!;
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles([email]);
  const profiles = getProfiles(email, emailToProfile, companyUrlToProfile);

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

  const googleAccount = user.accounts?.find((a) => a.provider === "google");
  const scopes = googleAccount?.scope?.split(" ") ?? [];

  // Check if any profile data is missing for better user guidance
  const hasCompleteProfile = 
    profiles.personProfile?.linkedInUrl && 
    profiles.personExp.jobTitle && 
    profiles.personExp.companyLinkedInUrl;

  // Determine the default tab from URL parameter
  const defaultTab = (['view', 'edit', 'experience'].includes(searchParams.tab || '')) 
    ? searchParams.tab 
    : 'view';

  return (
    <>
      <div className={"flex flex-row justify-between items-center gap-4"}>
        <h1 className={"text-2xl my-4"}>Profile</h1>
        {!hasCompleteProfile && (
          <Badge variant="destructive" className="px-3 py-1">
            Profile Incomplete - Please update your profile information
          </Badge>
        )}
      </div>

      {/* Profile Completion Indicator */}
      <div className="mb-6">
        <ProfileCompletionIndicator 
          personProfile={profiles.personProfile}
          personExperience={profiles.personExp}
          showEditButton={false}
        />
      </div>

      <ProfileTabs 
        defaultTab={defaultTab}
        user={user}
        profiles={profiles}
        emailsCount={emailsCount}
        contactsCount={contactsCount}
        scopes={scopes}
      />
    </>
  );
}
