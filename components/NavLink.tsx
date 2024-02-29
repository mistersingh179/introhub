"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

type NavLinkProps = {
  name: string;
  url: string;
  className?: string;
};
const NavLink = (props: NavLinkProps) => {
  const pathName = usePathname();
  const { name, url, className } = props;
  return (
    <Link
      className={`hover:underline ${pathName === url ? "font-semibold" : "auto"} ${className}`}
      href={url}
    >
      {name}
    </Link>
  );
};

export default NavLink