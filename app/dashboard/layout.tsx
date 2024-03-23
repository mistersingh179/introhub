import NavLink from "@/components/NavLink";
import LogoutButton from "@/components/LogoutButton";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { ModeToggle } from "@/components/MyToggleButton";

type DashboardLayoutProps = {
  children: React.ReactNode;
};
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={""}>
      <div className={"container mx-auto min-h-dvh p-4 flex flex-col"}>
        <nav className={"flex flex-row justify-between"}>
          <div className={"flex flex-row gap-4 whitespace-nowrap"}>
            <div className={"mr-4 font-bold text-purple-600"}>IntroHub</div>
            <NavLink name={"Home"} url={"/dashboard/home"} />
            <NavLink name={"My Emails"} url={"/dashboard/my-emails"} />
            <NavLink name={"My Contacts"} url={"/dashboard/my-contacts"} />
            <NavLink name={"Prospects"} url={"/dashboard/prospects"} />
            <NavLink
              name={"Introductions"}
              url={"/dashboard/introductions/list"}
            />
            <NavLink name={"Settings"} url={"/dashboard/settings"} />
            <NavLink name={"Profile"} url={"/dashboard/profile"} />
          </div>
          <div className={"flex flex-row gap-4 px-4"}>
            <ModeToggle />
            <LogoutButton />
          </div>
        </nav>
        <main className={""}>{children}</main>
        <Toaster />
      </div>
    </div>
  );
}
