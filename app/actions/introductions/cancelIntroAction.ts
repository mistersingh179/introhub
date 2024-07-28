"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Introduction, Prisma } from "@prisma/client";
import IntroductionUncheckedUpdateInput = Prisma.IntroductionUncheckedUpdateInput;
import { goingToChangeIntroStatus } from "@/services/canStateChange";

export default async function cancelIntroAction(
  introductionId: string,
  prevState: undefined | string,
  formData: FormData,
) {
  console.log("in cancelIntroAction with: ", introductionId);
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  try {
    await goingToChangeIntroStatus(introductionId, IntroStates.cancelled);

    await prisma.introduction.update({
      data: {
        status: IntroStates.cancelled,
      },
      where: {
        id: introductionId,
        OR: [
          {
            requesterId: user.id,
          },
          {
            facilitatorId: user.id,
          },
        ],
      },
    });
  } catch (e) {
    console.log("an error occurred!: ", e);
    if (e instanceof Error) {
      return e.message;
    } else {
      return "unable to cancel introduction!";
    }
  }

  revalidatePath("/dashboard/introductions/list");
  redirect("/dashboard/introductions/list");
}
