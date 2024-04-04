"use client";

import { useToast } from "@/components/ui/use-toast";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { useFormState } from "react-dom";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import rejectIntroAction from "@/app/actions/introductions/rejectIntroAction";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import canStateChange from "@/services/canStateChange";
import { IntroStates } from "@/lib/introStates";

type IntroRejectFormProps = {
  intro: IntroWithContactFacilitatorAndRequester;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
export default function IntroRejectForm(props: IntroRejectFormProps) {
  const { intro, setOpen } = props;
  const [submittedAt, setSubmittedAt] = useState<undefined | number>(undefined);
  const action = rejectIntroAction.bind(null, intro.id);
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
    if (formData.get("rejectionReason") === "Other") {
      formData.set("rejectionReason", `Other: ${otherValue}`);
    }
    console.log("formData: ", formData);
    formData.forEach((value, key) => {
      console.log("key: ", key, "value: ", value);
    });

    setSubmittedAt(Date.now());
    await dispatch(formData);
  };
  const canChange = canStateChange(
    intro.status as IntroStates,
    IntroStates.rejected,
  );
  const [otherValue, setOtherValue] = useState<string>("");
  const ref = React.createRef<HTMLButtonElement>();
  return (
    <>
      <form action={formActionHandler}>
        {errorMessage && (
          <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
        )}
        <RadioGroup
          className={"flex flex-col items-start gap-4 mt-4"}
          defaultValue={"other"}
          name={"rejectionReason"}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="I'm concerned about the credibility of the person asking for the introduction."
              id="r1"
            />
            <Label htmlFor="r1">
              I&quot;m concerned about the credibility of the person asking for
              the introduction.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="I don't see a clear benefit for my contact in this
                  introduction."
              id="r2"
            />
            <Label htmlFor="r2">
              I don&quot;t see a clear benefit for my contact in this
              introduction.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="The request doesn't seem well-thought-out or lacks
                  sufficient detail for me to proceed."
              id="r3"
            />
            <Label htmlFor="r3">
              The request doesn&quot;t seem well-thought-out or lacks sufficient
              detail for me to proceed.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="This introduction might conflict with my own interests."
              id="r4"
            />
            <Label htmlFor="r4">
              This introduction might conflict with my own interests.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={"Other"} id="r5" ref={ref} />
            <Label htmlFor="r5">Other</Label>
            <Textarea
              className={"w-96"}
              onChange={(evt) => {
                setOtherValue(evt.target.value);
                ref.current?.click();
              }}
              onClick={(evt) => ref.current?.click()}
            />
          </div>
        </RadioGroup>
        <div className={"w-full flex flex-row justify-end"}>
          <SubmitButton label={"Reject"} beDisabled={!canChange} />
        </div>
      </form>
    </>
  );
}
