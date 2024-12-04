"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { z, ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const setupMembershipActionSchema = z.object({
  wantsToJoin: z.string().transform((s) => s.toLowerCase() === "true"),
  groupId: z.string(),
});

type CreateGroupActionFlattenErrorType = z.inferFlattenedErrors<
  typeof setupMembershipActionSchema
>;

export default async function setupMembershipAction(
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
    const { wantsToJoin, groupId } = setupMembershipActionSchema.parse({
      wantsToJoin: formData.get("wantsToJoin"),
      groupId: formData.get("groupId"),
    });

    if (wantsToJoin) {
      await prisma.membership.create({
        data: {
          groupId,
          userId: user.id,
        },
      });
      console.log("membership has been created for", groupId);
    } else if (!wantsToJoin) {
      await prisma.membership.delete({
        where: {
          userId_groupId: {
            groupId,
            userId: user.id,
          },
        },
      });
      console.log("membership has been deleted to", groupId);
    }
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
