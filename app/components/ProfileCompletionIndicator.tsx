"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { PersonProfile, PersonExperience } from "@prisma/client";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProfileItem {
  label: string;
  isComplete: boolean;
  tooltip: string;
}

interface ProfileCompletionIndicatorProps {
  personProfile?: Partial<PersonProfile> | null;
  personExperience?: Partial<PersonExperience> | null;
  showEditButton?: boolean;
  showTitle?: boolean;
}

export default function ProfileCompletionIndicator({
  personProfile,
  personExperience,
  showEditButton = true,
  showTitle = true,
}: ProfileCompletionIndicatorProps) {
  const router = useRouter();
  
  const profileItems: ProfileItem[] = [
    {
      label: "Full Name",
      isComplete: Boolean(personProfile?.fullName),
      tooltip: "Your complete name as shown on LinkedIn"
    },
    {
      label: "Personal LinkedIn URL",
      isComplete: Boolean(personProfile?.linkedInUrl),
      tooltip: "URL to your LinkedIn profile (e.g., https://www.linkedin.com/in/yourname)"
    },
    {
      label: "Professional Headline",
      isComplete: Boolean(personProfile?.headline),
      tooltip: "A short professional description, typically your job title and company"
    },
    {
      label: "Location",
      isComplete: Boolean(personProfile?.city),
      tooltip: "Your current city/location"
    },
    {
      label: "Job Title",
      isComplete: Boolean(personExperience?.jobTitle),
      tooltip: "Your current professional role"
    },
    {
      label: "Company Name",
      isComplete: Boolean(personExperience?.companyName),
      tooltip: "The name of your current company"
    },
    {
      label: "Company LinkedIn URL",
      isComplete: Boolean(personExperience?.companyLinkedInUrl),
      tooltip: "URL to your company's LinkedIn page (e.g., https://www.linkedin.com/company/name)"
    }
  ];
  
  const completedItems = profileItems.filter(item => item.isComplete).length;
  const completionPercentage = Math.round((completedItems / profileItems.length) * 100);
  
  return (
    <div className="w-full p-4 border rounded-lg">
      {showTitle && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Profile Completion</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-sm text-muted-foreground cursor-help">
                  <HelpCircle className="h-4 w-4" />
                  <span>Hover for tips</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-64">Hover over each field to see tips on how to complete your profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-4">
        <Progress value={completionPercentage} className="h-2" />
        <span className="text-sm font-medium">{completionPercentage}%</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        <TooltipProvider>
          {profileItems.map((item, index) => (
            <Tooltip key={index} delayDuration={300}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help py-1 px-2 rounded hover:bg-muted">
                  {item.isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={item.isComplete ? "" : "text-muted-foreground"}>
                    {item.label}
                  </span>
                  <HelpCircle className="h-3 w-3 text-muted-foreground ml-auto" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-64">{item.tooltip}</p>
                {!item.isComplete && (
                  <p className="mt-1 text-sm text-muted-foreground">Click &quot;Edit Profile&quot; to complete this field.</p>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      
      {showEditButton && (
        <Button 
          variant={completionPercentage < 100 ? "default" : "outline"}
          size="sm"
          onClick={() => router.push("/dashboard/profile?tab=edit")}
          className="w-full"
        >
          {completionPercentage < 100 ? "Complete Your Profile" : "Edit Profile"}
        </Button>
      )}
    </div>
  );
} 