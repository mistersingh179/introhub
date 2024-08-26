"use server";

import { auth, signIn } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { superUsers } from "@/app/utils/constants";
import { z, ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import addCreditsToUser from "@/services/addCreditsToUser";
import manuallyConnectEmailAndPeopleEnrichment from "@/services/manuallyConnectEmailAndPeopleEnrichment";

const connectToProfileByLinkedInUrlSchema = z.object({
  userEmail: z.string().min(1),
  linkedInUrl: z.string().min(1),
});

export type AddCreditsUserActionFlattenErrorType = z.inferFlattenedErrors<
  typeof connectToProfileByLinkedInUrlSchema
>;

const connectToProfileByLinkedInUrl = async (
  prevState: AddCreditsUserActionFlattenErrorType | string | undefined,
  formData: FormData,
) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  if (!superUsers.includes(user.email!)) {
    return "sorry you are not allowed here!";
  }

  try {
    const { linkedInUrl, userEmail } =
      connectToProfileByLinkedInUrlSchema.parse({
        linkedInUrl: formData.get("linkedInUrl"),
        userEmail: formData.get("userEmail"),
      });

    await manuallyConnectEmailAndPeopleEnrichment(userEmail, linkedInUrl);
  } catch (e) {
    console.log("an error occurred!: ", e);
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "unable to connect to profile using linkedInUrl!";
    }
  }

  revalidatePath("/dashboard/super");
  redirect("/dashboard/super");
};

export default connectToProfileByLinkedInUrl;
