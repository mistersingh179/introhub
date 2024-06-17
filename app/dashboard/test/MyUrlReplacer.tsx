"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const MyUrlReplacer = () => {
  const { replace } = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("in useEffect");
  }, []);

  const addFooBarHandler = () => {
    const params = new URLSearchParams(searchParams);
    params.set("foo", "bar");
    replace(`${pathName}?${params.toString()}`);
  };

  const removeFooBarHandler = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("foo", "bar");
    replace(`${pathName}?${params.toString()}`);
  };

  return (
    <>
      <h2>MyUrlReplacer</h2>
      <div className={"space-x-4 m-4"}>
        <Button onClick={addFooBarHandler}>AddFooBar</Button>
        <Link href={"/dashboard/test?foo=bar"}>AddFooBar</Link>
        <Button onClick={removeFooBarHandler}>RemoveFooBar</Button>
        <Link href={"/dashboard/test"}>RemoveFooBar</Link>
      </div>
    </>
  );
};

export default MyUrlReplacer;
