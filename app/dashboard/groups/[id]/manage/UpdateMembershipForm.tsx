"use client";

import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";
import * as React from "react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Group, Membership } from "@prisma/client";
import updateOrDeleteMembershipByGroupOwner from "@/app/actions/memberships/updateOrDeleteMembershipByGroupOwner";

type UpdateMembershipFormProps = {
  shouldApprove: Boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  group: Group;
  membership: Membership;
};

export default function UpdateMembershipForm(props: UpdateMembershipFormProps) {
  const { setOpen, group, membership, shouldApprove } = props;
  const action = updateOrDeleteMembershipByGroupOwner;
  const [errorMessage, dispatch] = useFormState(action, undefined);

  const [submittedAt, setSubmittedAt] = useState<undefined | number>();

  useEffect(() => {
    if (setOpen) {
      if (submittedAt && errorMessage) {
        setOpen(true);
      } else if (submittedAt) {
        setOpen(false);
      }
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
      <Input
        name={"membershipId"}
        type={"hidden"}
        value={membership.id}
      ></Input>
      <Input
        name={"approved"}
        type={"hidden"}
        value={String(shouldApprove)}
      ></Input>

      <div className={"flex flex-row justify-center my-4"}>
        <SubmitButton
          variant={`${shouldApprove ? "default" : "destructive"}`}
          label={`${shouldApprove ? "Approve" : "Reject"}`}
          className={"w-fit"}
        />
      </div>
    </form>
  );
}
