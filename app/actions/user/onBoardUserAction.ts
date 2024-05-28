"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import HighQueue from "@/bull/queues/highQueue";

export type OnBoardUserActionResult = {
  message: string;
};

export default async function onBoardUserAction(
  prevResponse: OnBoardUserActionResult | undefined,
  formData: FormData,
): Promise<OnBoardUserActionResult> {
  console.log("in onboardUserAction");
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  try {
    const { id } = await HighQueue.add("onBoardUser", {
      userId: user.id,
    });
    return { message: `Successfully scheduled onBoardUser Job ${id}!` };
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message };
    } else {
      return { message: "Unable to run onBoardUser Job!" };
    }
  }
}
