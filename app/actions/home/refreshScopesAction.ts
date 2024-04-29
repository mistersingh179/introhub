"use server";

import getContactStats from "@/services/getContactStats";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sleep from "@/lib/sleep";
import refreshScopes from "@/services/refreshScopes";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";

export default async function refreshScopesAction(formData: FormData) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  await refreshScopes(user.id);
  revalidatePath("/dashboard/home");
  redirect("/dashboard/home");
}
