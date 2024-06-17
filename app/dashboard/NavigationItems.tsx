import NavLink from "@/components/NavLink";
import { ModeToggle } from "@/components/MyToggleButton";
import UserProfileImageNav from "@/app/dashboard/UserProfileImageNav";
import React from "react";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import LogoutButton from "@/components/LogoutButton";
import CreditsBadge from "@/components/CreditsBadge";

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
        name={"My Contacts"}
        url={"/dashboard/my-contacts"}
      />
      <NavLink
        inSheet={inSheet}
        name={"Prospects"}
        url={"/dashboard/prospects"}
      />
      <NavLink
        inSheet={inSheet}
        name={"Introductions"}
        url={"/dashboard/introductions/list"}
      />
      <NavLink
        inSheet={inSheet}
        name={"Settings"}
        url={"/dashboard/settings"}
      />
      <NavLink inSheet={inSheet} name={"Profile"} url={"/dashboard/profile"} />
      <div className={"grow"}></div>
      <ModeToggle />
      <UserProfileImageNav />
      <CreditsBadge credits={user.credits} />
      <LogoutButton />
    </>
  );
}
