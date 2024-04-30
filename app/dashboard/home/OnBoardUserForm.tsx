"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import onBoardUserAction from "@/app/actions/user/onBoardUserAction";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";

export default function OnBoardUserForm() {
  const [respObj, dispatch] = useFormState(onBoardUserAction, undefined);

  return (
    <>
      {respObj && <div> {respObj.message}</div>}
      {!respObj && (
        <form action={dispatch}>
          <SubmitButton
            variant={"outline"}
            label={"Re-Onboard"}
            className={"h-8"}
          />
        </form>
      )}
    </>
  );
}
