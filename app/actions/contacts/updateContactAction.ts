"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { z, ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const updateContactActionSchema = z.object({
  available: z
    .string()
    .nullable()
    .optional()
    .transform((s) => (s ? s.toLowerCase() === "true" : false)),
  contactId: z.string(),
});

type updateContactActionFlattenErrorType = z.inferFlattenedErrors<
  typeof updateContactActionSchema
>;

const updateContactAction = async (
  prevState: updateContactActionFlattenErrorType | undefined | string,
  formData: FormData,
) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  try {
    const { available, contactId } = updateContactActionSchema.parse({
      available: formData.get("available"),
      contactId: formData.get("contactId"),
    });
    console.log("in updateContactAction with: ", available, contactId);
    console.log([...formData]);
    await prisma.contact.update({
      where: {
        id: contactId,
        userId: user.id,
      },
      data: {
        available,
      },
    });
  } catch (e) {
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "Unable to update Contact Availability";
    }
  }

  revalidatePath("/dashboard/my-contacts");
  redirect("/dashboard/my-contacts");
};

export default updateContactAction;
