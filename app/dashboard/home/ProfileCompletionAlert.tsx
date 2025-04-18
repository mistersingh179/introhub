"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { PersonProfile, PersonExperience } from "@prisma/client";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ProfileCompletionAlertProps {
  personProfile?: Partial<PersonProfile> | null;
  personExperience?: Partial<PersonExperience> | null;
}

export default function ProfileCompletionAlert({
  personProfile,
  personExperience,
}: ProfileCompletionAlertProps) {
  // Calculate completion percentage
  const requiredFields = [
    Boolean(personProfile?.fullName),
    Boolean(personProfile?.linkedInUrl),
    Boolean(personProfile?.headline),
    Boolean(personExperience?.jobTitle),
    Boolean(personExperience?.companyName),
    Boolean(personExperience?.companyLinkedInUrl),
  ];
  
  const completedCount = requiredFields.filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / requiredFields.length) * 100);
  
  // Don't show the alert if profile is complete
  if (completionPercentage === 100) {
    return null;
  }
  
  // Determine severity based on completion percentage
  const variant = completionPercentage < 50 ? "destructive" : "default";
  
  return (
    <Alert variant={variant}>
      <AlertCircle className="h-8 w-8" />
      <AlertTitle className="ml-8">Profile Incomplete</AlertTitle>
      <AlertDescription className="ml-8 space-y-2">
        <p>
          Your profile is {completionPercentage}% complete. 
          {completionPercentage < 50 
            ? " Missing profile information prevents you from fully participating in IntroHub." 
            : " A complete profile helps you make better connections."}
        </p>
        
        <div className="flex items-center gap-2 my-2">
          <Progress value={completionPercentage} className="h-2 flex-1" />
          <span className="text-sm font-medium">{completionPercentage}%</span>
        </div>
        
        <Button asChild size="sm">
          <Link href="/dashboard/profile?tab=edit">
            Complete Your Profile
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
} 