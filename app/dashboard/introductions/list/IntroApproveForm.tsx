"use client";

import { useToast } from "@/components/ui/use-toast";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import approveIntroAction from "@/app/actions/introductions/approveIntroAction";
import canStateChange from "@/services/canStateChange";
import { IntroStates } from "@/lib/introStates";

type IntroApproveFormProps = {
  intro: IntroWithContactFacilitatorAndRequester;
};
export default function IntroApproveForm(props: IntroApproveFormProps) {
  const { intro } = props;
  const [submittedAt, setSubmittedAt] = useState<undefined | number>(undefined);
  const action = approveIntroAction.bind(null, intro.id);
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
  const canChange = canStateChange(
    intro.status as IntroStates,
    IntroStates.approved,
  );
  return (
    <>
      <form action={formActionHandler}>
        <SubmitButton label={"Approve"} beDisabled={!canChange} />
      </form>
    </>
  );
}
