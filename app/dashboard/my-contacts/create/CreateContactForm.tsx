"use client";

import createContactAction from "@/app/actions/contacts/createContactAction";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";

export default function CreateContactForm() {
  const action = createContactAction;
  const [errorMessage, dispatch] = useFormState(action, undefined);
  // todo - check when error is string
  return (
    <form action={dispatch} className={"max-w-2xl flex flex-col gap-4"}>
      <ShowChildren showIt={!!errorMessage}>
        <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
      </ShowChildren>
      <div className={"flex flex-row gap-4 items-center"}>
        <Label className={"min-w-48"} htmlFor={"email"}>
          Email
        </Label>
        <Input
          name={"email"}
          type={"email"}
          id="email"
          placeholder={"joe@shmoe.com"}
        ></Input>
      </div>
      <div className={"flex flex-row gap-4 items-center"}>
        <Label className={"min-w-48"} htmlFor={"email"}>
          Sent Count
        </Label>
        <Input
          name={"sentCount"}
          type={"number"}
          id="sentCount"
          placeholder={"50"}
        ></Input>
      </div>
      <div className={"flex flex-row gap-4 items-center"}>
        <Label className={"min-w-48"} htmlFor={"email"}>
          Received Count
        </Label>
        <Input
          name={"receivedCount"}
          type={"number"}
          id="receivedCount"
          placeholder={"100"}
        ></Input>
      </div>
      <div className={"flex flex-row justify-center my-4"}>
        <SubmitButton label={"Create Contact"} className={"w-fit"} />
      </div>
    </form>
  );
}
