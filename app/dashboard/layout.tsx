import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SoonerToaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NavigationItems from "@/app/dashboard/NavigationItems";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import ClarityMetrics from "@/app/utils/ClarityMetrics";
import ShowChildren from "@/components/ShowChildren";

type DashboardLayoutProps = {
  children: React.ReactNode;
};
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = (await auth()) as Session;
  console.log("DashboardLayout session.user: ", session.user);
  const user = await prisma.user.findFirst({
    where: {
      email: session.user?.email ?? "",
    },
    include: {
      accounts: true,
    },
  });

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
        <SoonerToaster richColors />
        <ShowChildren showIt={!!user}>
          <ClarityMetrics user={user!} />
        </ShowChildren>
      </div>
    </div>
  );
}
