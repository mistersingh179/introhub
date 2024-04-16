"use client";

import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { Textarea } from "@/components/ui/textarea";
import IntroRejectForm from "@/app/dashboard/introductions/list/IntroRejectForm";
import IntroRejectDialog from "@/app/dashboard/introductions/list/IntroRejecDialog";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import canStateChange from "@/services/canStateChange";
import { IntroStates } from "@/lib/introStates";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import updateMessageForContactAction from "@/app/actions/introductions/updateMessageForContactAction";
import { useFormState } from "react-dom";
import approveIntroAction from "@/app/actions/introductions/approveIntroAction";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type IntroApproveWithMessageFormProps = {
  intro: IntroWithContactFacilitatorAndRequester;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};
const IntroApproveWithMessageForm = (
  props: IntroApproveWithMessageFormProps,
) => {
  const { intro, setOpen } = props;
  const canChange = canStateChange(
    intro.status as IntroStates,
    IntroStates.approved,
  );
  const action = approveIntroAction.bind(null, intro.id);
  const [errorMessage, dispatch] = useFormState(action, undefined);
  console.log("errorMessage: ", errorMessage);
  const [submittedAt, setSubmittedAt] = useState<undefined | number>(undefined);

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
    <>
      <form action={formActionHandler}>
        <div className={"flex flex-col gap-4"}>
          {errorMessage && (
            <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
          )}
          <Textarea
            name={"messageForContact"}
            rows={5}
            defaultValue={intro.messageForContact}
          />
          <div className={"flex flex-row justify-around"}>
            <IntroRejectDialog intro={intro} />
            <SubmitButton label={"Approve"} beDisabled={!canChange} />
          </div>
        </div>
      </form>
    </>
  );
};

export default IntroApproveWithMessageForm;
