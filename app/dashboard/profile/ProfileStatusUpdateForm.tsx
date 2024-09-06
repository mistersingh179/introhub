"use client";

import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import React from "react";
import { useFormState } from "react-dom";
import acceptAutoProspectingAction from "@/app/actions/user/acceptAutoProspectingAction";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";
import {usePathname} from "next/navigation";

type ProfileStatusUpdateFormProps = {
  setAgreedTo: boolean;
};

const ProfileStatusUpdateForm = (props: ProfileStatusUpdateFormProps) => {
  const { setAgreedTo } = props;
  const [errorMessage, dispatch] = useFormState(
    acceptAutoProspectingAction,
    undefined,
  );

  const pathname = usePathname();

  return (
    <>
      <ShowChildren showIt={!!errorMessage}>
        <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
      </ShowChildren>
      <form action={dispatch}>
        <Input type={'hidden'} name={'callbackUrl'} value={pathname} />
        <Input type={"hidden"} name={"agreed"} value={String(setAgreedTo)} />
        <SubmitButton
          variant={`${setAgreedTo ? "primary" : "destructive"}`}
          label={`Turn ${setAgreedTo ? "on" : "off"} IntroHub`}
        />
      </form>
    </>
  );
};

export default ProfileStatusUpdateForm;
