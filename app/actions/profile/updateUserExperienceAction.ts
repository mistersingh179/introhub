"use server";

import { auth } from "@/auth";
import prisma from "@/prismaClient";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const userExperienceSchema = z.object({
  experienceId: z.string().optional(),
  companyName: z.string().optional(),
  companyLinkedInUrl: z.string().url("Must be a valid URL").optional(),
  jobTitle: z.string().optional(),
  jobDescription: z.string().optional(),
});

export type UserExperienceFormData = z.infer<typeof userExperienceSchema>;

export async function updateUserExperienceAction(formData: UserExperienceFormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const validatedData = userExperienceSchema.parse(formData);

    // Find the person profile for the current user
    const personProfile = await prisma.personProfile.findFirst({
      where: {
        email: session.user.email,
      },
      include: {
        personExperiences: true,
      },
    });

    if (!personProfile) {
      return { error: "Profile not found" };
    }

    if (validatedData.experienceId) {
      // Update existing experience
      const experience = personProfile.personExperiences.find(
        (exp) => exp.id === validatedData.experienceId
      );

      if (!experience) {
        return { error: "Experience not found" };
      }

      await prisma.personExperience.update({
        where: {
          id: validatedData.experienceId,
        },
        data: {
          userEditedCompanyName: validatedData.companyName,
          userEditedCompanyLinkedInUrl: validatedData.companyLinkedInUrl,
          userEditedJobTitle: validatedData.jobTitle,
          userEditedJobDescription: validatedData.jobDescription,
          isUserEdited: true,
          lastUserEditAt: new Date(),
        },
      });
    } else if (validatedData.companyLinkedInUrl) {
      // Create new experience
      await prisma.personExperience.create({
        data: {
          personProfileId: personProfile.id,
          companyLinkedInUrl: validatedData.companyLinkedInUrl, // Required field in the schema
          userEditedCompanyName: validatedData.companyName,
          userEditedCompanyLinkedInUrl: validatedData.companyLinkedInUrl,
          userEditedJobTitle: validatedData.jobTitle,
          userEditedJobDescription: validatedData.jobDescription,
          isUserEdited: true,
          lastUserEditAt: new Date(),
        },
      });
    } else {
      return { error: "Company LinkedIn URL is required for new experiences" };
    }

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating experience:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to update experience" };
  }
} 