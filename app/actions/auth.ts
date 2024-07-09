"use server";

import { auth, signIn, signOut } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { superUsers } from "@/app/utils/constants";

export async function signOutAction() {
  await signOut({
    redirectTo: "/auth/signIn",
  });
}

export async function signInWithGoogleAction(formData: FormData) {
  console.log("in signInWithGoogle");
  const callbackUrl = formData.get("callbackUrl") as string;
  await signIn(
    "google",
    {
      redirectTo: callbackUrl ? callbackUrl : "/dashboard/home",
    },
    {
      prompt: "consent",
    },
  );
}

export async function signInWithLinkedInAction(formData: FormData) {
  console.log("in signInWithLinkedIAction");
  const callbackUrl = formData.get("callbackUrl") as string;
  await signIn("linkedin", {
    redirectTo: callbackUrl ? callbackUrl : "/dashboard/home",
  });
}

export async function SignInWithCredentials(formData: FormData) {
  console.log("in SignInWithCredentials");
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  const userToImpersonate = formData.get("userToImpersonate");

  if (superUsers.includes(user.email!)) {
    const callbackUrl = formData.get("callbackUrl") as string;
    await signIn("credentials", {
      redirectTo: callbackUrl ? callbackUrl : "/dashboard/home",
      userToImpersonate,
    });
  } else {
    console.log("sorry you are not allowed to use SignInWithCredentials");
    return "sorry you are not allowed here!";
  }
}
