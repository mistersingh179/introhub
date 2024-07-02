"use client";

import { RefreshCcwDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import refreshScopesAction from "@/app/actions/home/refreshScopesAction";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";

export default function RefreshScopesForm() {
  const [errorMessage, dispatch] = useFormState(refreshScopesAction, undefined);
  return (
    <>
      <ShowChildren showIt={!!errorMessage}>
        <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
      </ShowChildren>
      <form action={dispatch}>
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
