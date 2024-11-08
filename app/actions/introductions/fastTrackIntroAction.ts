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
import sendAskingPermissionToMakeIntroEmail from "@/services/emails/sendAskingPermissionToMakeIntroEmail";

const fastTrackIntroActionSchema = z.object({
  introductionId: z.string(),
});

type fastTrackIntroActionFlattenErrorType = z.inferFlattenedErrors<
  typeof fastTrackIntroActionSchema
>;

const fastTrackIntroAction = async (
  prevState: fastTrackIntroActionFlattenErrorType| undefined | string,
  formData: FormData,
) => {
  console.log("in fastTrackIntroAction with: ", formData);
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  try {
    const { introductionId } =
      fastTrackIntroActionSchema.parse({
        introductionId: formData.get("introductionId"),
      });

    await goingToChangeIntroStatus(introductionId, IntroStates["permission email sent"]);

    const intro = await prisma.introduction.findFirstOrThrow({
      where: {
        facilitatorId: user.id,
        id: introductionId,
        status: IntroStates["pending approval"],
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
    });

    await sendAskingPermissionToMakeIntroEmail(intro);
  } catch (e) {
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "Unable to fast track introduction";
    }
  }

  revalidatePath("/dashboard/introductions/pendingQueue");
  redirect("/dashboard/introductions/pendingQueue");
};

export default fastTrackIntroAction;
