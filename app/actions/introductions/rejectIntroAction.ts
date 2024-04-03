"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
        status: IntroStates.rejected,
        rejectionReason: formData.get("rejectionReason")?.toString(),
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
