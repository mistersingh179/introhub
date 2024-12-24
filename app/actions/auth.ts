"use server";

import { auth, signIn, signOut } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { superUsers } from "@/app/utils/constants";

const addSearchParam = ({
  host,
  url,
  param,
  value,
}: {
  host: string;
  url: string;
  param: string;
  value: string;
}) => {
  console.log("in addSearchParam with: ", host, url, param, value);
  const base = new URL(url, host);
  base.searchParams.set(param, value);
  const result = base.pathname + base.search + base.hash;
  console.log("result: ", result);
  return result;
};

export async function signOutAction() {
  await signOut({
    redirectTo: "/auth/signIn",
  });
}

export async function signInWithGoogleAction(formData: FormData) {
  console.log("in signInWithGoogle with: ", [...formData.entries()]);
  const callbackUrl = formData.get("callbackUrl") as string;
  const metaKey = formData.get("metaKey") as string;
  const groupName = formData.get("groupName") as string;
  const authorizationParams: { prompt?: string } = {
    prompt: "consent",
  };
  if (metaKey === "true") {
    console.log("meta key was pressed. will remove consent prompt property");
    delete authorizationParams["prompt"];
  }
  console.log("authorizationParams: ", authorizationParams);
  const redirectTo = addSearchParam({
    host: process.env.BASE_API_URL!,
    url: callbackUrl || "/",
    param: "groupName",
    value: groupName,
  });
  console.log("auth has set signIn url to be: ", redirectTo);

  await signIn(
    "google",
    {
      redirectTo,
    },
    authorizationParams,
  );
}

export async function signInWithLinkedInAction(formData: FormData) {
  console.log("in signInWithLinkedIAction");
  const callbackUrl = formData.get("callbackUrl") as string;
  await signIn("linkedin", {
    redirectTo: callbackUrl ? callbackUrl : "/",
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
