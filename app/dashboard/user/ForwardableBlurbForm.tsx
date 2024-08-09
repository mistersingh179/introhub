"use client";

import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";
import * as React from "react";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { User } from "@prisma/client";
import { defaultForwardableBlurb } from "@/app/utils/constants";
import { Textarea } from "@/components/ui/textarea";
import updateForwardableBlurbAction from "@/app/actions/profile/updateForwardableBlurbAction";

type ForwardableBlurbFormProps = {
  user: User;
};

const ForwardableBlurbForm = (props: ForwardableBlurbFormProps) => {
  const { user } = props;
  const action = updateForwardableBlurbAction;
  const [errorMessage, dispatch] = useFormState(action, undefined);
  const forwardableBlurb = user.forwardableBlurb || defaultForwardableBlurb;

  return (
    <form action={dispatch} className={"flex flex-col gap-4"}>
      <ShowChildren showIt={!!errorMessage}>
        <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
      </ShowChildren>
      <div className={"flex flex-col gap-4"}>
        <Textarea
          placeholder={
            "The message which is sent to the prospect as a forwarded email from by you."
          }
          defaultValue={forwardableBlurb}
          name={"forwardableBlurb"}
          rows={10}
          className={"w-2/3"}
        ></Textarea>
        <SubmitButton className={"w-fit"} label={"Update"} />
      </div>
    </form>
  );
};

export default ForwardableBlurbForm;
