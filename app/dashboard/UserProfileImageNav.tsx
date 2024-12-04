import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getS3Url } from "@/lib/url";
import { userProfileS3DirName } from "@/app/utils/constants";
import Link from "next/link";
import NavLink from "@/components/NavLink";

export const getInitials = (input: string | null | undefined) => {
  if (!input) {
    return undefined;
  }

  let initials = "";
  const parts = input.split(" ");
  if (parts.length === 1) {
    initials = input.substring(0, 2);
  } else {
    initials = parts[0][0] + parts[1][0];
  }

  if (typeof initials === "string") {
    return initials.toUpperCase();
  } else {
    return "-";
  }
};

const UserProfileImageNav = async () => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={"w-8 h-8 rounded-full"}
          size="icon"
        >
          <Avatar className={"w-8 h-8"}>
            <AvatarImage
              src={
                (getS3Url(userProfileS3DirName, user.profileImageName ?? "") ||
                  user.image) ??
                undefined
              }
              alt={user.name ?? user.email ?? undefined}
              referrerPolicy={"no-referrer"}
            />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={"/dashboard/prospects"}>
            <DropdownMenuItem>All Prospects</DropdownMenuItem>
          </Link>
          <Link href={"/dashboard/my-contacts"}>
            <DropdownMenuItem>My Contacts</DropdownMenuItem>
          </Link>
          <Link href={"/dashboard/introductions/list"}>
            <DropdownMenuItem>All Introductions</DropdownMenuItem>
          </Link>
          <Link href={"/dashboard/competitors"}>
            <DropdownMenuItem>Competitors</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={"/dashboard/profile"}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link href={"/dashboard/user/forwardableBlurb"}>
            <DropdownMenuItem>Forwardable Blurb</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileImageNav;
