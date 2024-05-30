"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z, ZodError } from "zod";
import sleep from "@/lib/sleep";

const deleteFilterActionSchema = z.object({
  id: z.string().min(1).max(100),
});

type DeleteFilterActionFlattenErrorType = z.inferFlattenedErrors<
  typeof deleteFilterActionSchema
>;

const deleteFilterAction = async (
  prevState: DeleteFilterActionFlattenErrorType | undefined | string,
  formData: FormData,
) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });


  try {
    const { id } = deleteFilterActionSchema.parse({
      id: formData.get("id"),
    });

    await prisma.filters.delete({
      where: {
        userId: user.id,
        id,
      },
    });
  } catch (e) {
    console.log("an error occurred!: ", e);
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "unable to delete action!";
    }
  }

  revalidatePath("/dashboard/prospects");
};

export default deleteFilterAction;
