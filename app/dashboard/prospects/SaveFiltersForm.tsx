"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import createFilterAction from "@/app/actions/filters/createFilterAction";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import React from "react";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";

const SaveFiltersForm = () => {
  const searchParams = useSearchParams();
  const action = createFilterAction;
  const [errorMessage, dispatch] = useFormState(action, undefined);
  return (
    <form action={dispatch}>
      {errorMessage && (
        <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
      )}
      <div className={"flex flex-row justify-between gap-4 items-center px-2"}>
        <Input
          type={"text"}
          name={"name"}
          placeholder={"your filter's name"}
        ></Input>
        <Input
          type={"hidden"}
          name={"searchParams"}
          value={searchParams.toString()}
        ></Input>
        <SubmitButton size="sm" label={"Save"} />
      </div>
    </form>
  );
};

export default SaveFiltersForm;
