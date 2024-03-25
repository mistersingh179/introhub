"use server";

import { z, ZodError } from "zod";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Introduction, Prisma } from "@prisma/client";
import IntroductionUncheckedUpdateInput = Prisma.IntroductionUncheckedUpdateInput;


export default async function rejectIntroAction(
  introductionId: string,
  prevState: undefined | string,
  formData: FormData,
) {
  console.log("in rejectIntroAction with: ", introductionId);
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  try {
    await prisma.introduction.update({
      data: {
        status: IntroStates.rejected
      },
      where: {
        id: introductionId,
        facilitatorId: user.id,
      },
    });
  } catch (e) {
    console.log("an error occurred!: ", e);
    if (e instanceof Error) {
      return e.message;
    } else {
      return "unable to reject introduction!";
    }
  }

  revalidatePath("/dashboard/introductions/list");
  redirect("/dashboard/introductions/list");
}
