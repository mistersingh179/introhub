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

export default async function approveOrRejectIntroAction(
  introductionId: string,
  prevState: undefined | string,
  formData: FormData,
) {
  console.log("in approveOrRejectIntroAction with: ", introductionId);
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  try {
    const newStatus = String(formData.get("status")) as IntroStates;
    const allowsStatusValue = [IntroStates.rejected, IntroStates.approved];
    if (!allowsStatusValue.includes(newStatus)) {
      return "invalid status value";
    }

    await prisma.introduction.update({
      data: {
        status: newStatus,
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
      return "unable to approve or reject introduction!";
    }
  }

  revalidatePath("/dashboard/introductions/list");
  redirect("/dashboard/introductions/list");
}
