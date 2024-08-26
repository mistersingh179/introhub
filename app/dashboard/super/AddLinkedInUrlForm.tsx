"use client";

import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import connectToProfileByLinkedInUrl from "@/app/actions/user/connectToProfileByLinkedInUrl";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type AddLinkedInUrlFormProps = {
  userEmail: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const AddLinkedInUrlForm = (props: AddLinkedInUrlFormProps) => {
  const { userEmail, setOpen } = props;
  const [errorMessage, dispatch] = useFormState(
    connectToProfileByLinkedInUrl,
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
        <Input readOnly={true} type={"text"} name={"userEmail"} value={userEmail}></Input>
        <Input type={"text"} name={"linkedInUrl"}></Input>
        <SubmitButton variant={"secondary"} label={"Add LinkInUrl"} />
      </form>
    </>
  );
};

export default AddLinkedInUrlForm;
