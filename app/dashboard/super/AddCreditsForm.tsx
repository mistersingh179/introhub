"use client";

import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import addCreditsUserAction from "@/app/actions/user/addCreditsUserAction";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type AddCreditsFormProps = {
  userId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const AddCreditsForm = (props: AddCreditsFormProps) => {
  const { userId, setOpen } = props;
  const [errorMessage, dispatch] = useFormState(
    addCreditsUserAction,
    undefined,
  );
  const [submittedAt, setSubmittedAt] = useState<undefined | number>();

  useEffect(() => {
    if (submittedAt && errorMessage) {
      setOpen(true);
    } else if (submittedAt) {
      setOpen(false);
    }
  }, [setOpen, errorMessage, submittedAt]);

  const formActionHandler = async (formData: FormData) => {
    setSubmittedAt(Date.now());
    await dispatch(formData);
  };
  return (
    <>
      <form action={formActionHandler} className={"flex flex-col gap-4"}>
        {errorMessage && (
          <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
        )}
        <Input type={"hidden"} name={"userId"} value={userId}></Input>
        <Input type={"text"} name={"numberOfCreditsToAdd"}></Input>
        <SubmitButton variant={"secondary"} label={"Add Credits"} />
      </form>
    </>
  );
};

export default AddCreditsForm;
