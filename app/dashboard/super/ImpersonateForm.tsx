"use client";

import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { SignInWithCredentials } from "@/app/actions/auth";
import { VenetianMask } from "lucide-react";

type ImpersonateFormProps = {
  userId: string;
};

const ImpersonateForm = (props: ImpersonateFormProps) => {
  const { userId } = props;
  return (
    <>
      <form action={SignInWithCredentials} className={"flex flex-col gap-4"}>
        <Input
          type={"hidden"}
          name={"userToImpersonate"}
          value={userId}
        ></Input>
        <SubmitButton
          className={"w-full"}
          variant={"secondary"}
          label={
            <>
              <VenetianMask size={16} className={"mr-2"} /> Impersonate
            </>
          }
        />
      </form>
    </>
  );
};

export default ImpersonateForm;
