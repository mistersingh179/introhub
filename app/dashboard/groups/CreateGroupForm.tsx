"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";
import createGroupAction from "@/app/actions/groups/createGroupAction";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import * as React from "react";

type CreateGroupFormProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function CreateGroupForm(props: CreateGroupFormProps) {
  const {setOpen} = props;
  const action = createGroupAction;
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
    <form action={formActionHandler} className={"max-w-2xl flex flex-col gap-4"}>
      <ShowChildren showIt={!!errorMessage}>
        <ErrorMessage description={JSON.stringify(errorMessage, null, 2)}/>
      </ShowChildren>
      <div className={"flex flex-row gap-4 items-center"}>
        <Label className={"min-w-48"} htmlFor={"name"}>
          Name
        </Label>
        <Input
          name={"name"}
          type={"text"}
          id="name"
          placeholder={"A memorable name for your group"}
        ></Input>
      </div>
      <div className={"flex flex-row gap-4 items-center"}>
        <Label className={"min-w-48"} htmlFor={"description"}>
          Description
        </Label>
        <Textarea
          placeholder={
            "Use this space to describe your group"
          }
          name={"description"}
          rows={3}
        ></Textarea>
      </div>
      <div className={"flex flex-row gap-4 items-center"}>
        <Label className={"min-w-48"} htmlFor={"name"}>
          Image
        </Label>
        <Input
          name={"image"}
          type={"file"}
          id="image"
        ></Input>
      </div>
      <div className={"flex flex-row justify-center my-4"}>
        <SubmitButton label={"Create Group"} className={"w-fit"}/>
      </div>
    </form>
  );
}
