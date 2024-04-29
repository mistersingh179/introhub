"use client";

import { RefreshCcwDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { useFormStatus } from "react-dom";
import refreshScopesAction from "@/app/actions/home/refreshScopesAction";

export default function RefreshScopesForm() {
  return (
    <>
      <form action={refreshScopesAction}>
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
