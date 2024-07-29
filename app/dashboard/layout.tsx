import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NavigationItems from "@/app/dashboard/NavigationItems";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import ClarityMetrics from "@/app/utils/ClarityMetrics";
import ShowChildren from "@/components/ShowChildren";
import checkUserPermissions from "@/services/checkUserPermissions";
import MissingPermissionsDialog from "@/app/dashboard/MissingPermissionsDialog";
import AutoProspectingDialog from "@/app/dashboard/AutoProspectingDialog";

type DashboardLayoutProps = {
  children: React.ReactNode;
};
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirst({
    where: {
      email: session.user?.email ?? "",
    },
    include: {
      accounts: true,
    },
  });
  const weHavePermissions = await checkUserPermissions(user!);
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
        <ShowChildren showIt={!!user}>
          <ClarityMetrics user={user!} />
        </ShowChildren>

        <AutoProspectingDialog agreedToAutoProspecting={user!.agreedToAutoProspecting} />

        <ShowChildren showIt={!weHavePermissions}>
          <MissingPermissionsDialog />
        </ShowChildren>
      </div>
    </div>
  );
}
