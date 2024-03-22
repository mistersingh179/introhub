"use client";

import { useToast } from "@/components/ui/use-toast";
import { IntroStates } from "@/lib/introStates";
import updateIntroductionAction from "@/app/actions/introductions/updateIntroductionAction";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";

type IntroApproveFormProps = {
  introduction: IntroWithContactFacilitatorAndRequester;
};
export default function IntroApproveForm(props: IntroApproveFormProps) {
  const { introduction } = props;
  const [submittedAt, setSubmittedAt] = useState<undefined | number>(undefined);
  const action = updateIntroductionAction.bind(null, introduction.id);
  const [errorMessage, dispatch] = useFormState(action, undefined);
  const { toast } = useToast();
  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Error",
        description: JSON.stringify(errorMessage, null, 2),
      });
    }
  }, [toast, errorMessage, submittedAt]);
  const formActionHandler = async (formData: FormData) => {
    setSubmittedAt(Date.now());
    await dispatch(formData);
  };
  return (
    <>
      <form action={formActionHandler}>
        <input type={"hidden"} name={"status"} value={IntroStates.cancelled} />
        <SubmitButton label={"Cancel"} />
      </form>
    </>
  );
}
