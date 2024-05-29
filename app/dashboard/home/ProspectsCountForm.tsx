"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import onBoardUserAction from "@/app/actions/user/onBoardUserAction";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import getProspectsCountAction from "@/app/actions/contacts/getProspectsCountAction";

export default function ProspectsCountForm() {
  const [count, dispatch] = useFormState(getProspectsCountAction, undefined);

  return (
    <>
      {count && <div> {count}</div>}
      <form action={dispatch}>
        <SubmitButton
          variant={"outline"}
          label={"Get Count"}
          className={"h-8"}
        />
      </form>
    </>
  );
}
