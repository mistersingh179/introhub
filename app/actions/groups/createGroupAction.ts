"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { z, ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import updateGroupImage from "@/services/updateGroupImage";

const createGroupActionSchema = z.object({
  name: z.string().max(100).min(1),
  description: z.string().max(1000).min(1),
  image: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      message: "Only image files are allowed",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image size must be 5MB or less",
    }),
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
    const { name, description, image } = createGroupActionSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
      image: formData.get("image"),
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
        approved: true,
      },
    });

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await updateGroupImage(group, buffer, image.type);

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
