"use client";

import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import { Introduction } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import cancelIntroAction from "@/app/actions/introductions/cancelIntroAction";

type CancelIntroFormProps = {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  intro: Introduction;
};
const CancelIntroForm = (props: CancelIntroFormProps) => {
  const { setOpen, intro } = props;
  const [submittedAt, setSubmittedAt] = useState<undefined | number>(undefined);

  const action = cancelIntroAction;

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
  // const formActionHandler = async (formData: FormData) => {
  //   setSubmittedAt(Date.now());
  //   await dispatch(formData);
  // };
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
        <Input type={"hidden"} name={"introductionId"} value={intro.id} />
        <Textarea
          name={"cancellationReason"}
          placeholder={
            "Please provide cancellation reason so we can feed the algorithm."
          }
        ></Textarea>
        <div className={"flex flex-row justify-end gap-4 mt-4"}>
          <Button variant={"secondary"} onClick={cancelHandler}>
            Back
          </Button>
          <SubmitButton label={"Yes Cancel It!"} variant={"destructive"} />
        </div>
      </form>
    </>
  );
};

export default CancelIntroForm;
