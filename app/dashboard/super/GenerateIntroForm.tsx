"use client";

import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import generateIntroToAnyoneAction from "@/app/actions/super/generateIntroToAnyone";

type GenerateIntroFormProps = {
  userEmail: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const GenerateIntroForm = (props: GenerateIntroFormProps) => {
  const { userEmail, setOpen } = props;
  const [errorMessage, dispatch] = useFormState(
    generateIntroToAnyoneAction,
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
        Requester:{" "}
        <Input type={"text"} name={"requesterEmail"} value={userEmail}></Input>
        Facilitator:{" "}
        <Input
          type={"text"}
          name={"facilitatorEmail"}
          defaultValue={"rod@introhub.net"}
        ></Input>
        Prospect:{" "}
        <Input
          type={"text"}
          name={"prospectEmail"}
          defaultValue={"sandeep@introhub.net"}
        ></Input>
        <SubmitButton variant={"secondary"} label={"Generate Intro"} />
      </form>
    </>
  );
};

export default GenerateIntroForm;
