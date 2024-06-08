"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { z, ZodError } from "zod";
import addCreditsToUser from "@/services/addCreditsToUser";
import removeCreditsFromUser from "@/services/removeCreditsFromUser";
import moveIntroToBeApproved from "@/services/moveIntroToBeApproved";
import moveIntroToBePendingCredits from "@/services/moveIntroToBePendingCredits";

const approveIntroActionSchema = z.object({
  messageForContact: z.string().max(5000).min(10).optional(),
});

type ApproveIntroActionFlattenErrorType = z.inferFlattenedErrors<
  typeof approveIntroActionSchema
>;

export default async function approveIntroAction(
  introductionId: string,
  prevState: ApproveIntroActionFlattenErrorType | undefined | string,
  formData: FormData,
) {
  console.log("in approveIntroAction with: ", introductionId);
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  let intro: IntroWithContactFacilitatorAndRequester =
    await prisma.introduction.findFirstOrThrow({
      where: {
        facilitatorId: user.id,
        id: introductionId,
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
    });

  try {
    const { messageForContact } = approveIntroActionSchema.parse({
      messageForContact: formData.get("messageForContact") ?? undefined,
    });

    await prisma.introduction.update({
      data: {
        messageForContact,
      },
      where: {
        id: intro.id,
      },
    });

    if (intro.requester.credits > 0) {
      await moveIntroToBeApproved(intro);
    } else {
      await moveIntroToBePendingCredits(intro);
    }

    await removeCreditsFromUser(intro.requester, 1);
    await addCreditsToUser(intro.facilitator, 1);
  } catch (e) {
    console.log("an error occurred!: ", e);
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "unable to reject introduction!";
    }
  }

  revalidatePath("/dashboard/introductions/list");
  redirect("/dashboard/introductions/list");
}
