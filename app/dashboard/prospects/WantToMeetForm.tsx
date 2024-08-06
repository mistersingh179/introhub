"use client";

import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { Star } from "lucide-react";
import * as React from "react";
import wantToMeetAction from "@/app/actions/contacts/wantToMeetAction";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type WantToMeetFormProps = {
  contactId: string;
};

const WantToMeetForm = (props: WantToMeetFormProps) => {
  const { contactId } = props;
  const action = wantToMeetAction;
  const [errorMessage, dispatch] = useFormState(action, undefined);
  return (
    <>
      <ShowChildren showIt={!!errorMessage}>
        <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
      </ShowChildren>
      <form action={dispatch}>
        <input type={"hidden"} name={"desire"} value={"true"} />
        <input type={"hidden"} name={"contactId"} value={contactId} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <SubmitButton
                variant={'outline'}
                size={"icon"}
                label={<Star />}
              />
            </TooltipTrigger>
            <TooltipContent className={"w-64"}>
              Star a Prospect to further define your ICP and prioritize an intro
              to them.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    </>
  );
};

export default WantToMeetForm;
