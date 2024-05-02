import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NavigationItems from "@/app/dashboard/NavigationItems";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type DashboardLayoutProps = {
  children: React.ReactNode;
};
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={""}>
      <div className={"container mx-auto min-h-dvh p-4 flex flex-col"}>
        <Sheet>
          <SheetTrigger asChild>
            <Button size={"icon"} variant={"ghost"} className={"md:hidden"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className={"flex flex-col gap-4"}>
            <NavigationItems inSheet={true} />
          </SheetContent>
        </Sheet>
        <nav
          aria-label={"primary"}
          className={"hidden md:flex flex-row gap-4 items-center"}
        >
          <NavigationItems inSheet={false} />
        </nav>
        <main className={""}>{children}</main>
        <Toaster />
      </div>
    </div>
  );
}
