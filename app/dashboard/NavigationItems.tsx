import NavLink from "@/components/NavLink";
import { ModeToggle } from "@/components/MyToggleButton";
import UserProfileImageNav from "@/app/dashboard/UserProfileImageNav";
import React from "react";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import LogoutButton from "@/components/LogoutButton";
import CreditsBadge from "@/components/CreditsBadge";
import ShowChildren from "@/components/ShowChildren";
import { superUsers } from "@/app/utils/constants";

export default async function NavigationItems({
  inSheet,
}: {
  inSheet?: boolean;
}) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  return (
    <>
      <div className={"mr-4 font-bold text-purple-600"}>IntroHub</div>
      <NavLink inSheet={inSheet} name={"Home"} url={"/dashboard/home"} />
      {/*<NavLink*/}
      {/*  inSheet={inSheet}*/}
      {/*  name={"My Emails"}*/}
      {/*  url={"/dashboard/my-emails"}*/}
      {/*/>*/}
      <NavLink
        inSheet={inSheet}
        name={"Queue"}
        url={"/dashboard/introductions/pendingQueue"}
      />
      <NavLink
        inSheet={inSheet}
        name={"Groups"}
        url={"/dashboard/groups"}
      />

      <ShowChildren showIt={superUsers.includes(user.email!)}>
        <NavLink inSheet={inSheet} name={"Super"} url={"/dashboard/super"} />
      </ShowChildren>

      <div className={"grow"}></div>
      <ModeToggle />
      <UserProfileImageNav />
      <LogoutButton />
    </>
  );
}
