"use client";

import Link from "next/link";

import { usePathname, useSearchParams } from "next/navigation";

type MyPaginationProps = {
  totalCount?: number;
};

export default function MyPagination(props: MyPaginationProps) {
  const { totalCount = Number.MAX_SAFE_INTEGER } = props;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = process.env.NODE_ENV === "development" ? 2 : 10;
  const recordsShownSoFar = currentPage * itemsPerPage;

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
      <Link
        className={`${recordsShownSoFar < totalCount ? "": "pointer-events-none opacity-25" }`}
        href={createPageURL(currentPage + 1)}>Next</Link>
    </div>
  );
}
