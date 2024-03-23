"use server";

import { z, ZodError } from "zod";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import IntroductionUncheckedUpdateInput = Prisma.IntroductionUncheckedUpdateInput;
import sleep from "@/lib/sleep";

const updateIntroSchema = z.object({
  messageForFacilitator: z.string().max(5000).min(10).nullish(),
  messageForContact: z.string().max(5000).min(10).nullish(),
  status: z.nativeEnum(IntroStates).nullish(),
});

type UpdateIntroFlattenErrorType = z.inferFlattenedErrors<
  typeof updateIntroSchema
>;

export default async function updateIntroductionAction(
  introductionId: string,
  prevState: undefined | string | UpdateIntroFlattenErrorType,
  formData: FormData,
) {
  // todo - check auth
  console.log("in updateIntroductionAction with: ", introductionId);
  // await sleep(2000);

  try {
    const { messageForFacilitator, messageForContact, status } =
      updateIntroSchema.parse({
        messageForFacilitator: formData.get("messageForFacilitator"),
        messageForContact: formData.get("messageForContact"),
        status: formData.get("status"),
      });
    console.log(messageForContact, messageForFacilitator, status);
    const input: IntroductionUncheckedUpdateInput = {
      status: status ?? undefined,
      messageForContact: messageForContact ?? undefined,
      messageForFacilitator: messageForFacilitator ?? undefined,
    };
    await prisma.introduction.update({
      data: input,
      where: {
        id: introductionId,
      },
    });
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

  revalidatePath("/dashboard/introductions/list");
  redirect("/dashboard/introductions/list");
}
