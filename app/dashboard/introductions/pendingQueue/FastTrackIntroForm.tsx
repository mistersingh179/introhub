"use client";

import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import { Introduction } from "@prisma/client";
import fastTrackIntroAction from "@/app/actions/introductions/fastTrackIntroAction";

type FastTrackIntroFormProps = {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  intro: Introduction;
};
const FastTrackIntroForm = (props: FastTrackIntroFormProps) => {
  const { setOpen, intro } = props;
  const [submittedAt, setSubmittedAt] = useState<undefined | number>(undefined);

  const action = fastTrackIntroAction;

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
        <div className={"flex flex-row justify-end gap-4 mt-4"}>
          <SubmitButton
            label={"Approve to Fast Track Intro"}
            variant={"success"}
          />
        </div>
      </form>
    </>
  );
};

export default FastTrackIntroForm;
