"use client";

import { useToast } from "@/components/ui/use-toast";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import rejectIntroAction from "@/app/actions/introductions/rejectIntroAction";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";

type IntroRejectFormProps = {
  introduction: IntroWithContactFacilitatorAndRequester;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
export default function IntroRejectForm(props: IntroRejectFormProps) {
  const { introduction, setOpen } = props;
  const [submittedAt, setSubmittedAt] = useState<undefined | number>(undefined);
  const action = rejectIntroAction.bind(null, introduction.id);
  const [errorMessage, dispatch] = useFormState(action, undefined);

  const { toast } = useToast();
  useEffect(() => {
    if (submittedAt && errorMessage) {
      setOpen(true);
    } else if (submittedAt) {
      setOpen(false);
    }
  }, [errorMessage, submittedAt]);
  const formActionHandler = async (formData: FormData) => {
    setSubmittedAt(Date.now());
    await dispatch(formData);
  };
  return (
    <>
      <form action={formActionHandler}>
        {errorMessage && (
          <ErrorMessage description={JSON.stringify(errorMessage, null, 2)}/>
        )}
        <div className="flex flex-col items-start gap-4 mt-4">
          <Label htmlFor="messageForContact" className={"min-w-48"}>
            Rejection Reason
          </Label>
          <Textarea
            name="rejectionReason"
            id="rejectionReason"
            placeholder={'I dont really know this guy'}
            rows={5}
          />
          <div className={"w-full flex flex-row justify-end"}>
            <SubmitButton label={"Reject"}/>
          </div>
        </div>
      </form>
    </>
  );
}
