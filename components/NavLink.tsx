"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";
import React from "react";

type NavLinkProps = {
  name: string;
  url: string;
  className?: string;
  inSheet?: boolean;
};
const NavLink = (props: NavLinkProps) => {
  const pathName = usePathname();
  const { name, url, className, inSheet } = props;
  const WrapperComponent = inSheet ? SheetClose : React.Fragment;
  const wrapperProps = inSheet ? { asChild: true } : {};
  return (
    <WrapperComponent {...wrapperProps}>
      <Link
        className={`hover:underline ${pathName === url ? "font-semibold" : "auto"} ${className}`}
        href={url}
      >
        {name}
      </Link>
    </WrapperComponent>
  );
};

export default NavLink;
