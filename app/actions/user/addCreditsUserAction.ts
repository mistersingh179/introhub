"use server";

import { auth, signIn } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { superUsers } from "@/app/utils/constants";
import { z, ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import addCreditsToUser from "@/services/addCreditsToUser";

const addCreditsUserActionSchema = z.object({
  userId: z.string(),
  numberOfCreditsToAdd: z.number().min(1),
});

export type AddCreditsUserActionFlattenErrorType = z.inferFlattenedErrors<
  typeof addCreditsUserActionSchema
>;

const addCreditsUserAction = async (
  prevState: AddCreditsUserActionFlattenErrorType | string | undefined,
  formData: FormData,
) => {
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
    const { numberOfCreditsToAdd, userId } = addCreditsUserActionSchema.parse({
      numberOfCreditsToAdd: Number(formData.get("numberOfCreditsToAdd")),
      userId: formData.get("userId"),
    });

    const userWhichGetsCredit = await prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
    });

    await addCreditsToUser(userWhichGetsCredit, numberOfCreditsToAdd);
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

  revalidatePath("/dashboard/super");
  redirect("/dashboard/super");
};

export default addCreditsUserAction;
