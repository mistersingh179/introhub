"use server";

import getContactStats from "@/services/getContactStats";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sleep from "@/lib/sleep";

export default async function refreshContactStats(formData: FormData) {
  // todo - do auth
  await getContactStats(true);
  revalidatePath("/dashboard/home");
  redirect("/dashboard/home");
}
