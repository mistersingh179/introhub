import ProfileImageForm from "@/app/dashboard/profile/ProfileImageForm";
import React from "react";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";

export default async function Profile() {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  return (
    <>
      <div className={"flex flex-row justify-start items-center gap-4"}>
        <h1 className={"text-2xl my-4"}>Profile</h1>
      </div>
      <div className={"flex flex-col gap-4"}>
        <ProfileImageForm user={user} />
      </div>
    </>
  );
}
