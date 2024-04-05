"use client";

import { RefreshCcwDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";
import refreshContactStats from "@/app/actions/home/refreshContactStats";
import {useFormStatus} from "react-dom";

export default function RefreshStatsForm() {
  return (
    <>
      <form action={refreshContactStats}>
        <RefreshSubmitButton />
      </form>
    </>
  );
}

const RefreshSubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type={"submit"} variant={"ghost"} size={"icon"} disabled={pending}>
      <RefreshCcwDot size={"16px"} />
    </Button>
  );
};
