"use client";

import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import LinkWithExternalIcon from "@/components/LinkWithExternalIcon";
import { User } from "@prisma/client";
import { Profiles } from "@/app/dashboard/introductions/list/IntroTable";
import ProfileImageForm from "./ProfileImageForm";
import ProfileStatusUpdateForm from "./ProfileStatusUpdateForm";
import EditableProfileForm from "./EditableProfileForm";
import EditableExperienceForm from "./EditableExperienceForm";
import ShowChildren from "@/components/ShowChildren";
import RefreshScopesForm from "@/app/dashboard/home/RefreshScopesForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ProfileTabsProps {
  defaultTab: string;
  user: User & { accounts: any[] };
  profiles: Profiles;
  emailsCount: number;
  contactsCount: number;
  scopes: string[];
}

export default function ProfileTabs({
  defaultTab,
  user,
  profiles,
  emailsCount,
  contactsCount,
  scopes,
}: ProfileTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle URL parameter updates
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["view", "edit", "experience"].includes(tabParam) && tabParam !== defaultTab) {
      // This is needed if user navigates with browser back/forward buttons
      const tabElements = document.querySelectorAll(`[data-state][value="${tabParam}"]`);
      if (tabElements.length > 0) {
        const tabElement = tabElements[0] as HTMLElement;
        tabElement.click();
      }
    }
  }, [searchParams, defaultTab]);

  return (
    <Tabs defaultValue={defaultTab} className="w-full mt-4" onValueChange={onTabChange}>
      <TabsList className="mb-4">
        <TabsTrigger value="view">View Profile</TabsTrigger>
        <TabsTrigger value="edit">Edit Profile</TabsTrigger>
        <TabsTrigger value="experience">Edit Experience</TabsTrigger>
      </TabsList>

      <TabsContent value="view">
        <div className={"flex flex-col gap-4"}>
          <ProfileImageForm user={user} />
          <div className={"flex flex-row"}>
            <div className={"min-w-48 self-center"}>Status :</div>
            <div className={"flex flex-row gap-4 items-center"}>
              {user.agreedToAutoProspecting && (
                <>
                  <div>IntroHub is currently ON</div>
                  <ProfileStatusUpdateForm setAgreedTo={false} />
                </>
              )}
              {!user.agreedToAutoProspecting && (
                <>
                  <div>IntroHub is currently OFF</div>
                  <ProfileStatusUpdateForm setAgreedTo={true} />
                </>
              )}
            </div>
          </div>

          <div className={"flex flex-row"}>
            <div className={"min-w-48"}>Name :</div>
            <div>
              {profiles.personProfile?.fullName || user.name || (
                <Badge variant={"destructive"}>Missing</Badge>
              )}
              {profiles.personProfile?.isUserEdited && (
                <Badge variant="outline" className="ml-2">User Edited</Badge>
              )}
            </div>
          </div>

          <div className={"flex flex-row"}>
            <div className={"min-w-48"}>Job Title :</div>
            <div className="flex items-center">
              {profiles.personExp.jobTitle || (
                <Badge variant={"destructive"}>Missing</Badge>
              )}
              {profiles.personExp.isUserEdited && (
                <Badge variant="outline" className="ml-2">User Edited</Badge>
              )}
            </div>
          </div>

          <div className={"flex flex-row items-center"}>
            <div className={"min-w-48"}>Personal LinkedIn URL :</div>
            <div className="flex items-center">
              {profiles.personProfile?.linkedInUrl ? (
                <LinkWithExternalIcon href={profiles.personProfile.linkedInUrl} />
              ) : (
                <Badge variant={"destructive"}>Missing</Badge>
              )}
              {profiles.personProfile?.isUserEdited && (
                <Badge variant="outline" className="ml-2">User Edited</Badge>
              )}
            </div>
          </div>

          <div className={"flex flex-row items-center"}>
            <div className={"min-w-48"}>Company LinkedIn URL :</div>
            <div className="flex items-center">
              {profiles.companyProfile.linkedInUrl ? (
                <LinkWithExternalIcon href={profiles.companyProfile.linkedInUrl} />
              ) : (
                <Badge variant={"destructive"}>Missing</Badge>
              )}
              {profiles.personExp.isUserEdited && (
                <Badge variant="outline" className="ml-2">User Edited</Badge>
              )}
            </div>
          </div>

          <div className={"flex flex-row items-center"}>
            <div className={"min-w-48"}>Headline :</div>
            <div className="flex items-center">
              {profiles.personProfile?.headline || (
                <Badge variant={"destructive"}>Missing</Badge>
              )}
            </div>
          </div>

          <div className={"flex flex-row items-center"}>
            <div className={"min-w-48"}>Location :</div>
            <div className="flex items-center">
              {profiles.personProfile?.city ? (
                <span>
                  {profiles.personProfile.city}
                  {profiles.personProfile.state ? `, ${profiles.personProfile.state}` : ""}
                  {profiles.personProfile.country ? `, ${profiles.personProfile.country}` : ""}
                </span>
              ) : (
                <Badge variant={"destructive"}>Missing</Badge>
              )}
            </div>
          </div>

          <div className={"flex flex-row items-center"}>
            <div className={"min-w-48"}>Contacts :</div>
            <div>{contactsCount}</div>
          </div>

          <div className={"flex flex-row items-center"}>
            <div className={"min-w-48 "}>Emails :</div>
            <div>{emailsCount}</div>
          </div>

          <div className={"flex flex-row items-center"}>
            <div className={"min-w-48"}>User Id :</div>
            <div>{user.id}</div>
          </div>

          <div className={"flex flex-row items-start"}>
            <div className={"min-w-48 flex flex-row items-center"}>
              Google Scope : <RefreshScopesForm />{" "}
            </div>
            <div>
              <ShowChildren showIt={scopes.length > 0}>
                <ul className={"list-disc ml-4"}>
                  {scopes.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </ShowChildren>
              <ShowChildren showIt={scopes.length == 0}>None</ShowChildren>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="edit">
        <EditableProfileForm personProfile={profiles.personProfile || {}} />
      </TabsContent>

      <TabsContent value="experience">
        <div className="space-y-8">
          {/* Display existing experience with edit option */}
          {profiles.personExp.id && (
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Current Experience</h3>
                  <p className="text-sm text-muted-foreground">
                    {profiles.personExp.companyName || "Unknown Company"}
                  </p>
                </div>
                {profiles.personExp.isUserEdited && (
                  <Badge variant="outline">User Edited</Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Job Title:</span> {profiles.personExp.jobTitle || "Not specified"}
                </div>
                {profiles.personExp.jobDescription && (
                  <div>
                    <span className="font-medium">Description:</span> {profiles.personExp.jobDescription}
                  </div>
                )}
                {profiles.personExp.companyLinkedInUrl && (
                  <div>
                    <span className="font-medium">Company LinkedIn:</span>{" "}
                    <LinkWithExternalIcon href={profiles.personExp.companyLinkedInUrl} />
                  </div>
                )}
              </div>
              
              <EditableExperienceForm experience={profiles.personExp} />
            </div>
          )}
          
          {/* Add new experience option if none exists */}
          {!profiles.personExp.id && (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <h3 className="font-semibold mb-2">No Experience Information Found</h3>
              <p className="text-muted-foreground mb-4">
                Add your current job details to improve your profile
              </p>
              <EditableExperienceForm isNewExperience={true} />
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
} 