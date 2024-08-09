"use server";

import { z, ZodError } from "zod";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const updateForwardableBlurbActionSchema = z.object({
  forwardableBlurb: z.string().max(1000),
});

type updateForwardableBlurbActionFlattenErrorType = z.inferFlattenedErrors<
  typeof updateForwardableBlurbActionSchema
>;

const updateForwardableBlurbAction = async (
  prevState: updateForwardableBlurbActionFlattenErrorType | string | undefined,
  formData: FormData,
) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  try {
    const { forwardableBlurb } = updateForwardableBlurbActionSchema.parse({
      forwardableBlurb: formData.get("forwardableBlurb"),
    });

    console.log("got forwardableBlurb: ", JSON.stringify(forwardableBlurb));

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        forwardableBlurb,
      },
    });

    console.log("forwardableBlurb updated: ", updatedUser.forwardableBlurb);
  } catch (e) {
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "Unable to update Forwardable Blurb";
    }
  }

  revalidatePath("/dashboard/user/forwardableBlurb");
  redirect("/dashboard/user/forwardableBlurb");
};

export default updateForwardableBlurbAction;
