"use server";

import getContactStats from "@/services/getContactStats";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sleep from "@/lib/sleep";
import refreshScopes from "@/services/refreshScopes";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import {ZodError} from "zod";

export default async function refreshScopesAction(prevState: string|undefined, formData: FormData) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  try{
    await refreshScopes(user.id);
  }catch (e) {
    if (e instanceof Error) {
      return e.message;
    } else {
      return "Unable to Refresh Scopes!";
    }
  }

  revalidatePath("/dashboard/home");
  redirect("/dashboard/home");
}
