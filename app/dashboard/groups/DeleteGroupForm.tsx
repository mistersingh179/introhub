"use client";

import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";
import * as React from "react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import deleteGroupAction from "@/app/actions/groups/deleteGroupAction";
import { Group } from "@prisma/client";

type DeleteGroupFormProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  group: Group;
};

export default function DeleteGroupForm(props: DeleteGroupFormProps) {
  const { setOpen, group } = props;
  const action = deleteGroupAction;
  const [errorMessage, dispatch] = useFormState(action, undefined);

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
    <form
      action={formActionHandler}
      className={"max-w-2xl flex flex-col gap-4"}
    >
      <ShowChildren showIt={!!errorMessage}>
        <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
      </ShowChildren>
      <Input name={"groupId"} type={"hidden"} value={group.id}></Input>

      <div className={"flex flex-row justify-center my-4"}>
        <SubmitButton
          variant={"destructive"}
          label={"Delete Group"}
          className={"w-fit"}
        />
      </div>
    </form>
  );
}
