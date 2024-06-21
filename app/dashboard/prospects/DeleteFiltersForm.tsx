"use client";

import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import deleteFilterAction from "@/app/actions/filters/deleteFilterAction";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import { Filters } from "@prisma/client";
import { Button } from "@/components/ui/button";

type DeleteFilterFormProps = {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  filtersObj: Filters;
};
const DeleteFiltersForm = (props: DeleteFilterFormProps) => {
  const { setOpen, filtersObj } = props;
  const [submittedAt, setSubmittedAt] = useState<undefined | number>(undefined);

  const action = deleteFilterAction;
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
  const cancelHandler = (
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    evt.preventDefault();
    if (setOpen) {
      setOpen(false);
    }
  };
  return (
    <>
      <form action={dispatch}>
        {errorMessage && (
          <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
        )}
        <Input type={"hidden"} name={"id"} value={filtersObj.id} />
        <div className={"flex flex-row justify-end gap-4"}>
          <Button variant={"secondary"} onClick={cancelHandler}>
            Cancel
          </Button>
          <SubmitButton label={"Delete"} variant={"destructive"} />
        </div>
      </form>
    </>
  );
};

export default DeleteFiltersForm;
