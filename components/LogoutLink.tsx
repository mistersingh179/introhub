"use client";

import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type LogoutLinkProps = {
  label: string;
};

const LogoutLink = (props: LogoutLinkProps) => {
  const { label } = props;
  return (
    <Link
      href={"#"}
      className={"underline"}
      onClick={async () => {
        await signOutAction();
      }}
    >
      {label}
    </Link>
  );
};

export default LogoutLink;
