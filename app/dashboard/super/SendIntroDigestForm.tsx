"use client";

import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import { Send } from "lucide-react";
import sendIntroDigestAction from "@/app/actions/super/sendIntroDigestAction";

type SendIntroDigestFormProps = {
  userId: string;
};

const SendIntroDigestForm = (props: SendIntroDigestFormProps) => {
  const { userId } = props;
  const [errorMessage, dispatch] = useFormState(
    sendIntroDigestAction,
    undefined,
  );
  return (
    <>
      {errorMessage && (
        <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
      )}
      <form action={dispatch} className={"flex flex-col gap-4"}>
        <Input type={"hidden"} name={"userId"} value={userId}></Input>
        <SubmitButton
          className={"w-full"}
          variant={"secondary"}
          label={
            <>
              <Send size={14} className={"mr-2"} /> Send Intro Digest
            </>
          }
        />
      </form>
    </>
  );
};

export default SendIntroDigestForm;
