"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/prismaClient";
import { Prisma } from "@prisma/client";
import IntroductionUncheckedCreateInput = Prisma.IntroductionUncheckedCreateInput;
import { auth } from "@/auth";
import { Session } from "next-auth";
import { IntroStates } from "@/lib/introStates";
import { z, ZodError } from "zod";
import sleep from "@/lib/sleep";

const createIntroSchema = z.object({
  messageForFacilitator: z.string().max(5000).min(10),
  messageForContact: z.string().max(5000).min(10),
});

type CreateIntroFlattenErrorType = z.inferFlattenedErrors<typeof createIntroSchema>;

export async function createIntroductionAction(
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

    await prisma.introduction.create({
      data: input,
    });
  } catch (e) {
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "unable to create introduction!";
    }
  }

  console.log("going to revalidated & redirect now");
  revalidatePath("/dashboard/introductions");
  redirect("/dashboard/introductions");
}

export const updateIntroduction = async (formData: FormData) => {};
