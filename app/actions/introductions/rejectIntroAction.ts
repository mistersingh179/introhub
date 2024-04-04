"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z, ZodError } from "zod";

const RejectIntroSchema = z.object({
  rejectionReason: z.string().max(5000).min(20),
});

type RejectIntroFlattenErrorType = z.inferFlattenedErrors<
  typeof RejectIntroSchema
>;

export default async function rejectIntroAction(
  introductionId: string,
  prevState: RejectIntroFlattenErrorType | undefined | string,
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
    const { rejectionReason } = RejectIntroSchema.parse({
      rejectionReason: formData.get("rejectionReason"),
    });

    await prisma.introduction.update({
      data: {
        status: IntroStates.rejected,
        rejectionReason,
      },
      where: {
        id: introductionId,
        facilitatorId: user.id,
      },
    });
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
