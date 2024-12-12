"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { z, ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import updateGroupImage from "@/services/updateGroupImage";

const updateGroupActionSchema = z.object({
  id: z.string(),
  name: z.string().max(100).min(1).optional(),
  description: z.string().max(1000).min(1).optional(),
  image: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      message: "Only image files are allowed",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image size must be 5MB or less",
    })
    .optional(),
});

type updateGroupActionFlattenErrorType = z.inferFlattenedErrors<
  typeof updateGroupActionSchema
>;

export default async function updateGroupAction(
  prevState: updateGroupActionFlattenErrorType | undefined | string,
  formData: FormData,
) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  console.log("*** formData: ", [...formData]);

  try {
    const { name, description, image, id } = updateGroupActionSchema.parse({
      id: formData.get("id"),
      name: formData.get("name"),
      description: formData.get("description"),
      image: formData.get("image") ?? undefined,
    });

    const group = await prisma.group.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    if(image){
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await updateGroupImage(group, buffer, image.type);
    }

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

  revalidatePath(`/dashboard/groups/${formData.get("id")}/manage`);
  redirect(`/dashboard/groups/${formData.get("id")}/manage`);
}
