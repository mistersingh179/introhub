"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const acceptAutoProspectingAction = async (formData: FormData) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  try {
    await prisma.user.update({
      data: {
        agreedToAutoProspecting: true,
      },
      where: {
        id: user.id,
      },
    });
  } catch (e) {
    console.log("an error occurred!: ", e);
    if (e instanceof Error) {
      return e.message;
    } else {
      return "unable to set agreedToAutoProspecting on user!";
    }
  }

  revalidatePath("/dashboard/home");
  redirect("/dashboard/home");
};

export default acceptAutoProspectingAction;
