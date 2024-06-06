"use server";

import { signIn, signOut } from "@/auth";

export async function signOutAction() {
  await signOut({
    redirectTo: "/auth/signIn",
  });
}

export async function signInWithGoogleAction(formData: FormData) {
  console.log("in signInWithGoogle");
  const callbackUrl = formData.get("callbackUrl") as string;
  await signIn("google", {
    redirectTo: callbackUrl ? callbackUrl : "/dashboard/home",
  });
}
