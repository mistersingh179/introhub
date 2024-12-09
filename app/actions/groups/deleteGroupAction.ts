"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { z, ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const deleteGroupActionSchema = z.object({
  groupId: z.string().max(100).min(1),
});

type CreateGroupActionFlattenErrorType = z.inferFlattenedErrors<
  typeof deleteGroupActionSchema
>;

export default async function deleteGroupAction(
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
    const { groupId } = deleteGroupActionSchema.parse({
      groupId: formData.get("groupId"),
    });

    const group = await prisma.group.delete({
      where: {
        creatorId: user.id,
        id: groupId,
      },
    });

    console.log("group deleted: ", group);
  } catch (e) {
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "Unable to Delete Group!";
    }
  }

  revalidatePath("/dashboard/groups");
  redirect("/dashboard/groups");
}
