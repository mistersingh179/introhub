"use client";

import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import React from "react";
import { useFormState } from "react-dom";
import createOrDeleteMembershipByUser from "@/app/actions/memberships/createOrDeleteMembershipByUser";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";
import { Input } from "@/components/ui/input";

type GroupMembershipFormProps = {
  groupId: string;
  wantsToJoin: boolean;
};

const GroupMembershipForm = (props: GroupMembershipFormProps) => {
  const { groupId, wantsToJoin } = props;
  const action = createOrDeleteMembershipByUser;
  const [errorMessage, dispatch] = useFormState(action, undefined);
  return (
    <>
      <form action={dispatch}>
        <ShowChildren showIt={!!errorMessage}>
          <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
        </ShowChildren>
        <Input type={"hidden"} name={"groupId"} value={groupId} />
        <Input
          type={"hidden"}
          name={"wantsToJoin"}
          value={String(wantsToJoin)}
        />
        <SubmitButton label={wantsToJoin ? "Join 🤝" : "Leave 🚪⬅️"}></SubmitButton>
      </form>
    </>
  );
};

export default GroupMembershipForm;
