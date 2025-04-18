"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserProfileFormData, updateUserProfileAction } from "@/app/actions/profile/updateUserProfileAction";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const userProfileSchema = z.object({
  fullName: z.string().optional(),
  linkedInUrl: z.string().url("Must be a valid URL").optional(),
  headline: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  seniority: z.string().optional(),
});

type PersonProfileWithEdits = {
  id?: string;
  fullName?: string | null;
  linkedInUrl?: string | null;
  headline?: string | null;
  city?: string | null;
  country?: string | null;
  state?: string | null;
  seniority?: string | null;
  isUserEdited?: boolean;
  lastUserEditAt?: Date | null;
};

interface EditableProfileFormProps {
  personProfile: PersonProfileWithEdits;
  onSuccess?: (() => void) | string;
  hideDefaultButton?: boolean;
  customButtonLabel?: string;
}

export default function EditableProfileForm({ 
  personProfile, 
  onSuccess,
  hideDefaultButton = false,
  customButtonLabel = "Save Profile"
}: EditableProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullName: personProfile.fullName || undefined,
      linkedInUrl: personProfile.linkedInUrl || undefined,
      headline: personProfile.headline || undefined,
      city: personProfile.city || undefined,
      country: personProfile.country || undefined,
      state: personProfile.state || undefined,
      seniority: personProfile.seniority || undefined,
    },
  });

  async function onSubmit(data: UserProfileFormData) {
    setIsSubmitting(true);
    try {
      const result = await updateUserProfileAction(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated successfully");
        
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
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Edit Your Profile</h2>
        {personProfile.isUserEdited && (
          <Badge variant="outline" className="ml-2">
            User Edited
          </Badge>
        )}
      </div>
      
      <Form {...form}>
        <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedInUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://www.linkedin.com/in/yourprofile" 
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
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Headline</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Senior Software Engineer at Company" 
                    {...field} 
                    value={field.value || ""} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Your city" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input placeholder="Your state" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Your country" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="seniority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seniority Level</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Senior, Manager, Director" 
                    {...field} 
                    value={field.value || ""} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!hideDefaultButton && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : customButtonLabel}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
} 