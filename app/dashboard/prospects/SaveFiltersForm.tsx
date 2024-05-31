"use client";

import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import createFilterAction from "@/app/actions/filters/createFilterAction";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { Checkbox } from "@/components/ui/checkbox";

type SaveFiltersFormProps = {
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

const SaveFiltersForm = (props: SaveFiltersFormProps) => {
  const { setOpen } = props;
  const searchParams = useSearchParams();
  const [submittedAt, setSubmittedAt] = useState<undefined | number>(undefined);

  const action = createFilterAction;
  const [errorMessage, dispatch] = useFormState(action, undefined);
  useEffect(() => {
    if (setOpen) {
      if (submittedAt && errorMessage) {
        setOpen(true);
      } else if (submittedAt) {
        setOpen(false);
      }
    }
  }, [setOpen, errorMessage, submittedAt]);
  const formActionHandler = async (formData: FormData) => {
    setSubmittedAt(Date.now());
    await dispatch(formData);
  };
  return (
    <form action={formActionHandler} className={"my-2"}>
      {errorMessage && (
        <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
      )}
      <div className={"flex flex-col justify-center items-start gap-4 px-2"}>
        <Input
          type={"text"}
          name={"name"}
          placeholder={"a memorable name"}
        ></Input>

        <div className="flex items-center gap-2">
          <Checkbox id="dailyEmail" name={"dailyEmail"} />
          <label htmlFor="dailyEmail" className="text-sm">
            Email me as new contacts come in this filter.
          </label>
        </div>

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
