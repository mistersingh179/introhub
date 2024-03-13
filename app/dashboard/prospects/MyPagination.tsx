"use client";

import clsx from "clsx";
import Link from "next/link";

import { usePathname, useSearchParams } from "next/navigation";

export default function MyPagination() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    console.log("in createPageUrl");
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className={"flex flex-row gap-8 justify-center"}>
      <Link
        className={`${currentPage === 1 ? "pointer-events-none opacity-25" : ""}`}
        href={createPageURL(currentPage - 1)}
      >
        Previous
      </Link>
      <Link href={createPageURL(currentPage + 1)}>Next</Link>
    </div>
  );
}
