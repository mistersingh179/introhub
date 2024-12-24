"use server";

import { z, ZodError } from "zod";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sleep from "@/lib/sleep";

const updateIcpDescriptionActionSchema = z.object({
  icpDescription: z.string(),
});

export type updateIcpDescriptionActionFlattenErrorType = z.inferFlattenedErrors<
  typeof updateIcpDescriptionActionSchema
>;

const updateIcpDescriptionAction = async (
  prevState: updateIcpDescriptionActionFlattenErrorType | undefined | string,
  formData: FormData,
) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  try {
    const { icpDescription } = updateIcpDescriptionActionSchema.parse({
      icpDescription: formData.get("icpDescription"),
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        icpDescription,
      },
    });
  } catch (e) {
    console.log("an error occurred!: ", e);
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "unable to update user's icp description";
    }
  }

  revalidatePath("/onboarding/matchingSampleProspects");
  redirect("/onboarding/matchingSampleProspects");
};

export default updateIcpDescriptionAction;
