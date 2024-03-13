"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import _ from "lodash";
import { useCallback, useEffect } from "react";

type SearchProps = {
  placeholder: string;
};

export default function Search(props: SearchProps) {
  const { placeholder } = props;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    console.log("*** in handleSearch function ***");
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  const handleSearchMemoized = useCallback(handleSearch, [
    searchParams,
    pathname,
    replace,
  ]);
  const handleSearchDebounced = _.debounce(handleSearchMemoized, 500, {
    maxWait: 5000,
    trailing: true,
    leading: false,
  });

  return (
    <>
      <Input
        type="email"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearchDebounced(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </>
  );
}
