"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z, ZodError } from "zod";
import { superUsers } from "@/app/utils/constants";
import generateAnIntroduction from "@/services/generateAnIntroduction";

const generateIntroToAnyoneActionSchema = z.object({
  requesterEmail: z.string(),
  prospectEmail: z.string().min(1),
  facilitatorEmail: z.string().min(1),
});

type generateIntroToAnyoneActionFlattenErrorType = z.inferFlattenedErrors<
  typeof generateIntroToAnyoneActionSchema
>;

const generateIntroToAnyoneAction = async (
  prevState: generateIntroToAnyoneActionFlattenErrorType | undefined | string,
  formData: FormData,
) => {
  console.log("in generateIntroToAnyoneAction with: ", formData);

  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  if (!superUsers.includes(user.email!)) {
    return "sorry you are not allowed here!";
  }

  try {
    const { requesterEmail, prospectEmail, facilitatorEmail } =
      generateIntroToAnyoneActionSchema.parse({
        requesterEmail: formData.get("requesterEmail"),
        prospectEmail: formData.get("prospectEmail"),
        facilitatorEmail: formData.get("facilitatorEmail"),
      });

    console.log({ requesterEmail, prospectEmail, facilitatorEmail });
    const requestingUser = await prisma.user.findFirstOrThrow({
      where: {
        email: requesterEmail,
      },
    });
    console.log(requestingUser);

    const facilitatingUser = await prisma.user.findFirstOrThrow({
      where: {
        email: facilitatorEmail,
      },
    });
    console.log(facilitatorEmail);

    const prospect = await prisma.contact.findFirstOrThrow({
      where: {
        email: prospectEmail,
        userId: facilitatingUser.id,
      },
    });
    console.log(prospect);

    const intro = await generateAnIntroduction(requestingUser, prospect);

    console.log("intro has been generated: ", intro);
  } catch (e) {
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "Unable to generate introduction";
    }
  }

  revalidatePath("/dashboard/super");
  redirect("/dashboard/super");
};

export default generateIntroToAnyoneAction;
