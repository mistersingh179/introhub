"use server";

import { z, ZodError } from "zod";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import IntroductionUncheckedCreateInput = Prisma.IntroductionUncheckedCreateInput;
import sendPendingApprovalEmail from "@/services/sendPendingApprovalEmail";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";

const containsPlaceHolderValue = (input: string): boolean => {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  const regex = new RegExp(/\*\*\[.*]\*\*/g);
  return !regex.test(input);
};

const createIntroSchema = z.object({
  messageForFacilitator: z
    .string()
    .max(5000)
    .min(10)
    .refine(containsPlaceHolderValue, "Still contains Placeholder values"),
  messageForContact: z
    .string()
    .max(5000)
    .min(10)
    .refine(containsPlaceHolderValue, "Still contains Placeholder values"),
});

type CreateIntroFlattenErrorType = z.inferFlattenedErrors<
  typeof createIntroSchema
>;

export default async function createIntroductionAction(
  contactId: string,
  prevState: CreateIntroFlattenErrorType | string | undefined,
  formData: FormData,
) {
  console.log("in createIntroductionAction: ", contactId, prevState, formData);

  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  const contact = await prisma.contact.findFirstOrThrow({
    where: {
      id: contactId,
    },
  });

  const facilitatorId = contact.userId;
  const requesterId = user.id;
  const status = IntroStates["pending approval"];

  try {
    const { messageForFacilitator, messageForContact } =
      createIntroSchema.parse({
        messageForFacilitator: formData.get("messageForFacilitator"),
        messageForContact: formData.get("messageForContact"),
      });

    const input: IntroductionUncheckedCreateInput = {
      contactId,
      facilitatorId,
      requesterId,
      messageForFacilitator,
      messageForContact,
      status,
    };

    const intro: IntroWithContactFacilitatorAndRequester =
      await prisma.introduction.create({
        data: input,
        include: {
          contact: true,
          facilitator: true,
          requester: true,
        },
      });

    await sendPendingApprovalEmail(intro);
  } catch (e) {
    console.log("an error occurred!: ", e);
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "unable to create introduction!";
    }
  }

  console.log("going to revalidate introductions page");
  revalidatePath("/dashboard/introductions/list");
  revalidatePath("/dashboard/prospects");
  // console.log("going to redirect to prospects page");
  // redirect("/dashboard/prospects");
}
