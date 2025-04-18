"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserExperienceFormData, updateUserExperienceAction } from "@/app/actions/profile/updateUserExperienceAction";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const userExperienceSchema = z.object({
  experienceId: z.string().optional(),
  companyName: z.string().optional(),
  companyLinkedInUrl: z.string().url("Must be a valid URL").optional(),
  jobTitle: z.string().optional(),
  jobDescription: z.string().optional(),
});

type ExperienceWithEdits = {
  id?: string;
  companyName?: string | null;
  companyLinkedInUrl?: string | null; 
  jobTitle?: string | null;
  jobDescription?: string | null;
  isUserEdited?: boolean;
  lastUserEditAt?: Date | null;
};

interface EditableExperienceFormProps {
  experience?: ExperienceWithEdits;
  isNewExperience?: boolean;
  onSuccess?: (() => void) | string;
  onCancel?: () => void;
  hideDefaultButton?: boolean;
  customButtonLabel?: string;
}

export default function EditableExperienceForm({ 
  experience = {}, 
  isNewExperience = false,
  onSuccess,
  onCancel,
  hideDefaultButton = false,
  customButtonLabel
}: EditableExperienceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const defaultButtonLabel = isNewExperience ? "Add Experience" : "Save Changes";
  const buttonLabel = customButtonLabel || defaultButtonLabel;

  const form = useForm<z.infer<typeof userExperienceSchema>>({
    resolver: zodResolver(userExperienceSchema),
    defaultValues: {
      experienceId: experience?.id,
      companyName: experience?.companyName || undefined,
      companyLinkedInUrl: experience?.companyLinkedInUrl || undefined,
      jobTitle: experience?.jobTitle || undefined,
      jobDescription: experience?.jobDescription || undefined,
    },
  });

  async function onSubmit(data: UserExperienceFormData) {
    setIsSubmitting(true);
    try {
      const result = await updateUserExperienceAction(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Experience ${isNewExperience ? 'added' : 'updated'} successfully`);
        
        // Handle onSuccess callback or redirect
        if (onSuccess) {
          if (typeof onSuccess === 'string') {
            router.push(onSuccess);
          } else {
            onSuccess();
          }
        }
      }
    } catch (error) {
      toast.error(`Failed to ${isNewExperience ? 'add' : 'update'} experience`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {isNewExperience ? "Add New Experience" : "Edit Experience"}
        </h2>
        {experience?.isUserEdited && (
          <Badge variant="outline" className="ml-2">
            User Edited
          </Badge>
        )}
      </div>
      
      <Form {...form}>
        <form id="experience-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Company name" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyLinkedInUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company LinkedIn URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://www.linkedin.com/company/name" 
                    {...field} 
                    value={field.value || ""} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your job title at this company" 
                    {...field} 
                    value={field.value || ""} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your role and responsibilities" 
                    {...field} 
                    value={field.value || ""} 
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!hideDefaultButton && (
            <div className="flex gap-2 justify-end">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : buttonLabel}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
} 