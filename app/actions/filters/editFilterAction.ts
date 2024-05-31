"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z, ZodError } from "zod";
import sleep from "@/lib/sleep";

const editFilterActionSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(50),
  dailyEmail: z.coerce.boolean(),
  searchParams: z.string().min(1).max(10_000),
});

type EditFilterActionFlattenErrorType = z.inferFlattenedErrors<
  typeof editFilterActionSchema
>;

const editFilterAction = async (
  prevState: EditFilterActionFlattenErrorType | undefined | string,
  formData: FormData,
) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  try {
    const { id, name, searchParams, dailyEmail } = editFilterActionSchema.parse(
      {
        name: formData.get("name"),
        searchParams: formData.get("searchParams"),
        dailyEmail: formData.get("dailyEmail"),
        id: formData.get("id"),
      },
    );

    await prisma.filters.update({
      where: {
        userId: user.id,
        id,
      },
      data: {
        name,
        searchParams,
        dailyEmail,
      },
    });
  } catch (e) {
    console.log("an error occurred!: ", e);
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "unable to edit action!";
    }
  }

  revalidatePath("/dashboard/prospects");
};

export default editFilterAction;
