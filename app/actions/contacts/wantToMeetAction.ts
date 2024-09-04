"use server";

import { z, ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";

const wantToMeetActionSchema = z.object({
  desire: z.string().transform((s) => s.toLowerCase() === "true"),
  contactId: z.string(),
  callbackUrl: z.string(),
});

type WantToMeetActionFlattenErrorType = z.inferFlattenedErrors<
  typeof wantToMeetActionSchema
>;

export default async function wantToMeetAction(
  prevState: WantToMeetActionFlattenErrorType | undefined | string,
  formData: FormData,
) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  let redirectUrl = "/dashboard/prospects";

  console.log("wantToMeetAction", [...formData.entries()]);
  try {
    const { desire, contactId, callbackUrl } = wantToMeetActionSchema.parse({
      desire: formData.get("desire"),
      contactId: formData.get("contactId"),
      callbackUrl: formData.get("callbackUrl"),
    });
    redirectUrl = callbackUrl;

    console.log("wantToMeetAction: ", desire, contactId);

    if (desire) {
      await prisma.wantedContact.create({
        data: {
          userId: user.id,
          contactId,
        },
      });
    } else {
      await prisma.wantedContact.delete({
        where: {
          userId_contactId: {
            userId: user.id,
            contactId,
          },
        },
      });
    }
  } catch (e) {
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "Unable to setup WantToMeet Desire!";
    }
  }

  revalidatePath(redirectUrl);
  redirect(redirectUrl);
}
