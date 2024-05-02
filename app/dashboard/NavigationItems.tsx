import ShowChildren from "@/components/ShowChildren";
import NavLink from "@/components/NavLink";
import { ModeToggle } from "@/components/MyToggleButton";
import UserProfileImageNav from "@/app/dashboard/UserProfileImageNav";
import React, { Dispatch, SetStateAction } from "react";
import { SheetClose } from "@/components/ui/sheet";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import LogoutButton from "@/components/LogoutButton";

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
  const allowedEmails = [
    "sandeep@introhub.net",
    "sandeep@brandweaver.ai",
    "mistersingh179@gmail.com",
    "joserodrigofuentes@gmail.com",
    "rod@introhub.net",
    "rod@brandweaver.ai",
  ];
  let userAllowed = false;
  if (allowedEmails.includes(user.email!)) {
    userAllowed = true;
  }
  return (
    <>
      <div className={"mr-4 font-bold text-purple-600"}>IntroHub</div>
      <ShowChildren showIt={userAllowed}>
        <>
          <NavLink inSheet={inSheet} name={"Home"} url={"/dashboard/home"} />
          <NavLink
            inSheet={inSheet}
            name={"My Emails"}
            url={"/dashboard/my-emails"}
          />
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
        </>
      </ShowChildren>
      <NavLink
        inSheet={inSheet}
        name={"Introductions"}
        url={"/dashboard/introductions/list"}
      />
      <ShowChildren showIt={userAllowed}>
        <>
          <NavLink
            inSheet={inSheet}
            name={"Settings"}
            url={"/dashboard/settings"}
          />
          <NavLink
            inSheet={inSheet}
            name={"Profile"}
            url={"/dashboard/profile"}
          />
        </>
      </ShowChildren>
      <div className={"grow"}></div>
      <ModeToggle />
      <UserProfileImageNav />
      <LogoutButton />
    </>
  );
}
