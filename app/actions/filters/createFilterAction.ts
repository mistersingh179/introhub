"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z, ZodError } from "zod";
import sleep from "@/lib/sleep";

const createFilterActionSchema = z.object({
  name: z.string().min(1).max(50),
  dailyEmail: z.coerce.boolean(),
  searchParams: z.string().min(1).max(10_000),
});

type CreateFilterActionFlattenErrorType = z.inferFlattenedErrors<
  typeof createFilterActionSchema
>;

const createFilterAction = async (
  prevState: CreateFilterActionFlattenErrorType | undefined | string,
  formData: FormData,
) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  try {
    const { name, searchParams, dailyEmail } = createFilterActionSchema.parse({
      name: formData.get("name"),
      searchParams: formData.get("searchParams"),
      dailyEmail: formData.get("dailyEmail")
    });

    await prisma.filters.create({
      data: {
        userId: user.id,
        name: name,
        dailyEmail: dailyEmail,
        searchParams,
      },
    });
  } catch (e) {
    console.log("an error occurred!: ", e);
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "unable to create action!";
    }
  }

  revalidatePath("/dashboard/prospects");
};

export default createFilterAction;
