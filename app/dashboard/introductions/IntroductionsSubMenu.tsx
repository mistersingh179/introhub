import NavLink from "@/components/NavLink";
import { ModeToggle } from "@/components/MyToggleButton";
import UserProfileImageNav from "@/app/dashboard/UserProfileImageNav";
import React from "react";
import { Input } from "@/components/ui/input";

export default function IntroductionsSubMenu() {
  return (
    <nav aria-label={"secondary"} className={"flex flex-row justify-between mt-8"}>
      <div className={"flex flex-row gap-4 whitespace-nowrap"}>
        <NavLink name={"Requests Sent"} url={"/dashboard/introductions/sent"} />
        <NavLink
          name={"Requests Received"}
          url={"/dashboard/introductions/received"}
        />
      </div>
      <div className={"flex flex-row gap-4 px-4"}>
        <Input type={"text"} placeholder={"search"} />
      </div>
    </nav>
  );
}
