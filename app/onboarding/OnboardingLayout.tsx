import React from "react";
import { Progress } from "@/components/ui/progress";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  title,
  description,
}: OnboardingLayoutProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Floating progress bar at top */}
      <div className="bg-background/80 backdrop-blur-sm border-b z-10 py-3 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {/* <div className="text-sm font-medium">Step {currentStep}/{totalSteps}</div> */}
            {/* <div className="text-sm text-muted-foreground">{title}</div> */}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
      
      {/* Main content - fill remaining height without scrolling */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
} 