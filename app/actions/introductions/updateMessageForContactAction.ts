"use server";

import { z, ZodError } from "zod";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { goingToChangeIntroStatus } from "@/services/canStateChange";
import { IntroStates } from "@/lib/introStates";

const updateMessageForContactSchema = z.object({
  messageForContact: z.string().max(5000).min(10),
  messageForFacilitator: z.string().max(5000).min(10),
});

type UpdateMessageForContactFlattenErrorType = z.inferFlattenedErrors<
  typeof updateMessageForContactSchema
>;

export default async function updateMessageForContactAction(
  introductionId: string,
  prevState: UpdateMessageForContactFlattenErrorType | undefined | string,
  formData: FormData,
) {
  console.log("*** in updateMessageForContactAction with: ", introductionId);
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  try {
    const { messageForContact, messageForFacilitator } =
      updateMessageForContactSchema.parse({
        messageForContact: formData.get("messageForContact"),
        messageForFacilitator: formData.get("messageForFacilitator"),
      });
    console.log("*** going to update to: ", messageForContact);
    await prisma.introduction.update({
      data: {
        messageForContact,
        messageForFacilitator,
      },
      where: {
        id: introductionId,
        requesterId: user.id,
        status: {
          in: [IntroStates.draft, IntroStates["pending approval"]],
        },
      },
    });
  } catch (e) {
    console.log("an error occurred!: ", e);
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "unable to update introduction!";
    }
  }

  revalidatePath("/dashboard/introductions/list");
  redirect("/dashboard/introductions/list");
}
