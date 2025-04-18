"use server";

import { auth } from "@/auth";
import prisma from "@/prismaClient";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const userProfileSchema = z.object({
  fullName: z.string().optional(),
  linkedInUrl: z.string().url("Must be a valid URL").optional(),
  headline: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  seniority: z.string().optional(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

export async function updateUserProfileAction(formData: UserProfileFormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const validatedData = userProfileSchema.parse(formData);

    // Find the person profile for the current user
    const personProfile = await prisma.personProfile.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!personProfile) {
      // Create a new profile if one doesn't exist
      await prisma.personProfile.create({
        data: {
          email: session.user.email,
          userEditedFullName: validatedData.fullName,
          userEditedLinkedInUrl: validatedData.linkedInUrl,
          userEditedHeadline: validatedData.headline,
          userEditedCity: validatedData.city,
          userEditedCountry: validatedData.country,
          userEditedState: validatedData.state,
          userEditedSeniority: validatedData.seniority,
          isUserEdited: true,
          lastUserEditAt: new Date(),
        },
      });
    } else {
      // Update the existing profile
      await prisma.personProfile.update({
        where: {
          id: personProfile.id,
        },
        data: {
          userEditedFullName: validatedData.fullName,
          userEditedLinkedInUrl: validatedData.linkedInUrl,
          userEditedHeadline: validatedData.headline,
          userEditedCity: validatedData.city,
          userEditedCountry: validatedData.country,
          userEditedState: validatedData.state,
          userEditedSeniority: validatedData.seniority,
          isUserEdited: true,
          lastUserEditAt: new Date(),
        },
      });
    }

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to update profile" };
  }
} 