"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { z, ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const createGroupActionSchema = z.object({
  name: z.string().max(100).min(1),
  description: z.string().max(1000).min(1),
});

type CreateGroupActionFlattenErrorType = z.inferFlattenedErrors<
  typeof createGroupActionSchema
>;

export default async function createGroupAction(
  prevState: CreateGroupActionFlattenErrorType | undefined | string,
  formData: FormData,
) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  try {
    const { name, description } = createGroupActionSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
    });
    const group = await prisma.group.create({
      data: {
        creatorId: user.id,
        name,
        description,
      },
    });
    await prisma.membership.create({
      data: {
        groupId: group.id,
        userId: user.id,
        approved: true
      },
    });
    console.log("group created: ", group);
  } catch (e) {
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "Unable to Create Group!";
    }
  }

  revalidatePath("/dashboard/groups");
  redirect("/dashboard/groups");
}
