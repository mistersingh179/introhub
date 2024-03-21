"use client";

import { createIntroductionAction } from "@/app/actions/introductions";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { useFormState } from "react-dom";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";

export default function CreateIntroductionForm() {
  const params = useParams<{ contactId: string }>();
  const action = createIntroductionAction.bind(null, params.contactId);
  const [errorMessage, dispatch] = useFormState(action, undefined);

  return (
    <>
      <form
        action={dispatch}
        className={"bg-gray-50 p-4 max-w-2xl flex flex-col gap-4"}
      >
        {errorMessage && (
          <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
        )}

        <div className="flex flex-row justify-start gap-4 items-center">
          <Label htmlFor="messageForFacilitator" className={"min-w-48"}>
            Message For Facilitator
          </Label>
          <Textarea
            name="messageForFacilitator"
            id="messageForFacilitator"
            defaultValue="Sunt galataees anhelare bassus, regius visuses."
          />
        </div>
        <div className="flex flex-row justify-start gap-4 items-center">
          <Label htmlFor="messageForContact" className={"min-w-48"}>
            Message For Contact
          </Label>
          <Textarea
            name="messageForContact"
            id="messageForContact"
            defaultValue="Pius fides aegre tractares medicina est."
          />
        </div>
        <div className={"flex flex-row justify-center"}>
          <SubmitButton label={"Create Introduction"} />
        </div>
      </form>
    </>
  );
}
