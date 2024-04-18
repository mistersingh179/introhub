import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import canStateChange from "@/services/canStateChange";
import { IntroStates } from "@/lib/introStates";
import approveIntroAction from "@/app/actions/introductions/approveIntroAction";
import { useFormState } from "react-dom";
import updateMessageForContactAction from "@/app/actions/introductions/updateMessageForContactAction";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import IntroCancelForm from "@/app/dashboard/introductions/list/IntroCancelForm";

type IntroUpdateWithMessagesFormProps = {
  intro: IntroWithContactFacilitatorAndRequester;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};
const IntroUpdateWithMessagesForm = (
  props: IntroUpdateWithMessagesFormProps,
) => {
  const { intro, setOpen } = props;
  const canChange = [
    IntroStates.draft,
    IntroStates["pending approval"],
  ].includes(intro.status as IntroStates);

  const action = updateMessageForContactAction.bind(null, intro.id);
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
      <form action={formActionHandler}>
        <div className={"flex flex-col gap-4"}>
          {errorMessage && (
            <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
          )}
          <h2 className={"text-xl mb-2"}> Message to Facilitator </h2>
          <Textarea
            className={"my-2"}
            name="messageForFacilitator"
            id="messageForFacilitator"
            defaultValue={intro.messageForFacilitator}
            rows={5}
          />
          <h2 className={"text-xl mb-2"}> Message to Prospect </h2>
          <Textarea
            className={"my-2"}
            name="messageForContact"
            id="messageForContact"
            defaultValue={intro.messageForContact}
            rows={5}
          />
          <div className={"w-full flex flex-row justify-around"}>
            <SubmitButton label={"Save Changes"} beDisabled={!canChange} />
          </div>
        </div>
      </form>
  );
};

export default IntroUpdateWithMessagesForm;
