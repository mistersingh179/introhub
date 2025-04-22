"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";
import * as React from "react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Group } from "@prisma/client";
import { buildS3ImageUrlFromKey } from "@/lib/url";
import updateGroupAction from "@/app/actions/groups/updateGroupAction";

type CreateGroupFormProps = {
  group: Group;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function CreateGroupForm(props: CreateGroupFormProps) {
  const { setOpen, group } = props;
  const action = updateGroupAction;
  const [errorMessage, dispatch] = useFormState(action, undefined);

  const [submittedAt, setSubmittedAt] = useState<undefined | number>();

  const [fileSelected, setFileSelected] = useState(false);

  useEffect(() => {
    if (submittedAt && errorMessage) {
      setOpen(true);
    } else if (submittedAt) {
      setOpen(false);
    }
  }, [setOpen, errorMessage, submittedAt]);

  const formActionHandler = async (formData: FormData) => {
    setSubmittedAt(Date.now());
    if ((formData.get("image") as File)?.size === 0) {
      console.log("removing image from payload as it has 0 size");
      formData.delete("image");
    }
    await dispatch(formData);
  };

  const fileChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    evt,
  ) => {
    if (evt.target.files?.length && evt.target.files.length > 0) {
      setFileSelected(true);
    }
  };

  return (
    <form
      action={formActionHandler}
      className={"max-w-2xl flex flex-col gap-4"}
    >
      <ShowChildren showIt={!!errorMessage}>
        <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
      </ShowChildren>
      <Input type={"hidden"} value={group.id} name={"id"} />
      <div className={"flex flex-row gap-4 items-center"}>
        <Label className={"min-w-48"} htmlFor={"name"}>
          Name
        </Label>
        <Input
          name={"name"}
          type={"text"}
          id="name"
          placeholder={"A memorable name for your group"}
          defaultValue={group.name}
        ></Input>
      </div>
      <div className={"flex flex-row gap-4 items-center"}>
        <Label className={"min-w-48"} htmlFor={"description"}>
          Description
        </Label>
        <Textarea
          placeholder={"Use this space to describe your group"}
          name={"description"}
          rows={3}
          defaultValue={group.description}
        ></Textarea>
      </div>
      <div className={"flex flex-row gap-4 items-center"}>
        <Label className={"min-w-48"} htmlFor={"name"}>
          Image
        </Label>
        <div className={"flex flex-col gap-4"}>
          {!fileSelected && group.imageName && (
            <img
              src={buildS3ImageUrlFromKey(group.imageName)}
              className={"w-48"}
              alt={`${group.name} group image`}
            />
          )}
          <Input
            name={"image"}
            type={"file"}
            id="image"
            onChange={fileChangeHandler}
          ></Input>
        </div>
      </div>
      <div className={"flex flex-row justify-center my-4"}>
        <SubmitButton label={"Update Group"} className={"w-fit"} />
      </div>
    </form>
  );
}
