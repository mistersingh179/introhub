"use client";

import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import updateMessageForContactAction from "@/app/actions/introductions/updateMessageForContactAction";

type IntroUpdateMessageForContactFormProps = {
  introduction: IntroWithContactFacilitatorAndRequester;
  setOpen: (newState: boolean) => void;
};
export default function UpdateMessageForContactForm(
  props: IntroUpdateMessageForContactFormProps,
) {
  const { introduction, setOpen } = props;
  const action = updateMessageForContactAction.bind(null, introduction.id);
  const [errorMessage, dispatch] = useFormState(action, undefined);

  const [submittedAt, setSubmittedAt] = useState<undefined | number>(undefined);

  useEffect(() => {
    if (submittedAt && errorMessage) {
      setOpen(true);
    } else if (submittedAt) {
      setOpen(false);
    }
  }, [submittedAt, errorMessage]);

  return (
    <>
      <form
        action={async (formData: FormData) => {
          setSubmittedAt(Date.now());
          await dispatch(formData);
        }}
      >
        {errorMessage && (
          <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
        )}
        <div className="flex flex-col items-start gap-4 mt-4">
          <Label htmlFor="messageForContact" className={"min-w-48"}>
            Message For Contact
          </Label>
          <Textarea
            name="messageForContact"
            id="messageForContact"
            defaultValue={introduction.messageForContact}
            rows={10}
          />
          <div className={"w-full flex flex-row justify-end"}>
            <SubmitButton label={"Save Changes"} />
          </div>
        </div>
      </form>
    </>
  );
}
