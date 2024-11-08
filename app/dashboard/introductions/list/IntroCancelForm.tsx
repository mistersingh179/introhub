"use client";

import { useToast } from "@/components/ui/use-toast";
import { IntroStates } from "@/lib/introStates";
import cancelIntroAction from "@/app/actions/introductions/cancelIntroAction";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import canStateChange from "@/services/canStateChange";
import {Input} from "@/components/ui/input";

type IntroCancelFormProps = {
  intro: IntroWithContactFacilitatorAndRequester;
};
export default function IntroCancelForm(props: IntroCancelFormProps) {
  const { intro } = props;
  const [submittedAt, setSubmittedAt] = useState<undefined | number>(undefined);
  const action = cancelIntroAction;
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
    IntroStates.cancelled,
  );
  return (
    <>
      <form action={formActionHandler}>
        <Input type={'hidden'} name={'introductionId'} value={intro.id} />
        <SubmitButton variant={'link'} label={"Cancel Intro"} beDisabled={!canChange} />
      </form>
    </>
  );
}
