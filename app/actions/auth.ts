"use server";

import { signIn, signOut } from "@/auth";

export async function signOutAction() {
  await signOut({
    redirectTo: "/auth/signIn",
  });
}

export async function signInWithGoogleAction(formData: FormData) {
  console.log("in signInWithGoogle");
  await signIn("google", {
    redirectTo: "/dashboard/home",
  });
}