"use client";

import { Input } from "@/components/ui/input";
import * as React from "react";
import { useFormState } from "react-dom";
import acceptAutoProspectingAction from "@/app/actions/user/acceptAutoProspectingAction";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";

const AcceptAutoProspectingForm = () => {
  const [errorMessage, dispatch] = useFormState(
    acceptAutoProspectingAction,
    undefined,
  );
  return (
    <>
      <form action={dispatch}>
        {errorMessage && (
          <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
        )}
        <Input type={"hidden"} name={"agreed"} value={"true"} />
        <Input type={"hidden"} name={"callbackUrl"} value={"/dashboard/home"} />
        <SubmitButton
          label={"Finish and Start Networking"}
          className={"w-full py-6 ga-track-start-using-ih"}
          variant={"branded"}
        />
      </form>
    </>
  );
};

export default AcceptAutoProspectingForm;