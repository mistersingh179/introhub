"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const MyFiltersForm = () => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const limitInUrl = String(searchParams.get("limit") ?? "");

  const [limit, setLimit] = useState<string>(limitInUrl);

  useEffect(() => {
    console.log("input component has new value");
    if(limit && limitInUrl){
      if (limit !== limitInUrl) {
        const params = new URLSearchParams(searchParams);
        params.set("limit", limit);
        replace(`${pathName}?${params.toString()}`);
      }
    }
  }, [limit]);

  useEffect(() => {
    console.log("url search params has new value");
    if (limit !== limitInUrl) {
      setLimit(limitInUrl);
    }
  }, [limitInUrl]);

  return (
    <>
      <div className={"flex flex-col gap-4"}>
        <div className={"flex flex-row gap-8"}>
          <div>Limit:</div>
          <Input
            className={"w-fit"}
            type={"string"}
            value={limit}
            onChange={(evt) => {
              setLimit(evt.target.value);
            }}
          ></Input>
        </div>
        <Link href={`${usePathname()}?limit=1`}>1</Link>
        <Link href={`${usePathname()}?limit=2`}>2</Link>
        <Link href={`${usePathname()}?limit=3`}>3</Link>
      </div>
    </>
  );
};

export default MyFiltersForm;
