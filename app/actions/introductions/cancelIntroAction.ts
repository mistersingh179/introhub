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
import { z, ZodError } from "zod";

const cancelIntroActionSchema = z.object({
  introductionId: z.string(),
  cancellationReason: z.string().min(1),
});

type cancelIntroActionFlattenErrorType = z.inferFlattenedErrors<
  typeof cancelIntroActionSchema
>;

const cancelIntroAction = async (
  prevState: cancelIntroActionFlattenErrorType| undefined | string,
  formData: FormData,
) => {
  console.log("in cancelIntroAction with: ", formData);
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  try {
    const { introductionId, cancellationReason } =
      cancelIntroActionSchema.parse({
        introductionId: formData.get("introductionId"),
        cancellationReason: formData.get("cancellationReason"),
      });

    await goingToChangeIntroStatus(introductionId, IntroStates.cancelled);

    await prisma.introduction.update({
      data: {
        status: IntroStates.cancelled,
        cancellationReason: cancellationReason,
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
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "Unable to cancel introduction";
    }
  }

  revalidatePath("/dashboard/introductions/pendingQueue");
  redirect("/dashboard/introductions/pendingQueue");
};

export default cancelIntroAction;
