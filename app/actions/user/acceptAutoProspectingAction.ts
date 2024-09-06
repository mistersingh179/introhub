"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {z, ZodError} from "zod";

const acceptAutoProspectingActionSchema = z.object({
  agreed: z
    .string()
    .nullable()
    .optional()
    .transform((s) => (s ? s.toLowerCase() === "true" : false)),
  callbackUrl: z.string(),
});

export type AcceptAutoProspectingActionFlattenErrorType =
  z.inferFlattenedErrors<typeof acceptAutoProspectingActionSchema>;

const acceptAutoProspectingAction = async (
  prevState: AcceptAutoProspectingActionFlattenErrorType | string | undefined,
  formData: FormData,
) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  let redirectUrl = "/dashboard/home";

  try {
    const { agreed, callbackUrl } = acceptAutoProspectingActionSchema.parse({
      agreed: formData.get("agreed"),
      callbackUrl: formData.get("callbackUrl"),
    });
    redirectUrl = callbackUrl;

    await prisma.user.update({
      data: {
        agreedToAutoProspecting: agreed,
      },
      where: {
        id: user.id,
      },
    });
  } catch (e) {
    console.log("an error occurred!: ", e);
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "unable to set agreedToAutoProspecting on user!";
    }
  }

  revalidatePath(redirectUrl);
  redirect(redirectUrl);
};

export default acceptAutoProspectingAction;
