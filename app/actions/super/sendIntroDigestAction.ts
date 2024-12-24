"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z, ZodError } from "zod";
import { superUsers } from "@/app/utils/constants";
import sendIntroDigestEmail from "@/services/emails/sendIntroDigestEmail";

const sendIntroDigestAction = z.object({
  userId: z.string(),
});

type generateIntroToAnyoneActionFlattenErrorType = z.inferFlattenedErrors<
  typeof sendIntroDigestAction
>;

const generateIntroToAnyoneAction = async (
  prevState: generateIntroToAnyoneActionFlattenErrorType | undefined | string,
  formData: FormData,
) => {
  console.log("in generateIntroToAnyoneAction with: ", formData);

  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  if (!superUsers.includes(user.email!)) {
    return "sorry you are not allowed here!";
  }

  try {
    const { userId } = sendIntroDigestAction.parse({
      userId: formData.get("userId"),
    });

    console.log({ userId });
    const userToWorkOn = await prisma.user.findFirstOrThrow({
      where: { id: userId },
    });
    await sendIntroDigestEmail(userToWorkOn);

    console.log("intro digest has been sent!");
  } catch (e) {
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "Unable to send intro digest";
    }
  }

  revalidatePath("/dashboard/super");
  redirect("/dashboard/super");
};

export default generateIntroToAnyoneAction;
